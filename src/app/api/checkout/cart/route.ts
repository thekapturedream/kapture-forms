import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@lib/stripe";
import { getStoreProduct, type StoreProduct } from "@lib/store-product";
import type { CartCheckoutRequest } from "@lib/cart/types";

/**
 * POST /api/checkout/cart
 *
 * Body: { items: [{ slug, optionId, qty }], email? }
 *
 * Resolves every cart item server-side so prices can't be tampered with
 * client-side. Creates a single Stripe Checkout session bundling all line
 * items. Returns { url }.
 *
 * Constraints:
 *  - Subscriptions / passes can't be combined with one-off items in a
 *    single session — Stripe rejects mixed modes. The drawer already
 *    disables checkout in that case; we re-validate here as a backstop.
 *  - Only one subscription / pass per cart at a time. Quantity > 1 is
 *    rejected for those modes.
 *  - Bundles, pre-orders, and one-offs combine freely under "payment" mode.
 */
export async function POST(req: NextRequest) {
  let body: CartCheckoutRequest;
  try {
    body = (await req.json()) as CartCheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Resolve every item.
  type Resolved = {
    product: StoreProduct;
    option: StoreProduct["options"][number];
    qty: number;
  };
  const resolved: Resolved[] = [];

  for (const raw of body.items) {
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "Malformed cart item" }, { status: 400 });
    }
    if (typeof raw.slug !== "string" || typeof raw.optionId !== "string") {
      return NextResponse.json({ error: "Malformed cart item" }, { status: 400 });
    }
    const qty = Number.isFinite(raw.qty) ? Math.max(1, Math.floor(raw.qty)) : 1;
    const product = getStoreProduct(raw.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${raw.slug}` },
        { status: 404 },
      );
    }
    const option = product.options.find((o) => o.id === raw.optionId);
    if (!option) {
      return NextResponse.json(
        { error: `Pricing option ${raw.optionId} not available for ${raw.slug}` },
        { status: 400 },
      );
    }
    resolved.push({ product, option, qty });
  }

  const hasRecurring = resolved.some(
    (r) => r.option.mode === "subscription" || r.option.mode === "pass",
  );
  const hasOneOff = resolved.some(
    (r) => r.option.mode !== "subscription" && r.option.mode !== "pass",
  );

  if (hasRecurring && hasOneOff) {
    return NextResponse.json(
      {
        error:
          "Stripe can't combine a subscription with one-off items in one session. Check out the subscription first.",
      },
      { status: 400 },
    );
  }
  if (hasRecurring && resolved.length > 1) {
    return NextResponse.json(
      { error: "Only one subscription / pass per checkout." },
      { status: 400 },
    );
  }
  if (hasRecurring && resolved[0].qty > 1) {
    return NextResponse.json(
      { error: "Subscriptions are quantity 1 per checkout." },
      { status: 400 },
    );
  }

  const customerEmail =
    typeof body.email === "string" && /.+@.+\..+/.test(body.email)
      ? body.email.trim()
      : undefined;

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();
  const isSubscription = hasRecurring;

  const line_items = resolved.map(({ product, option, qty }) => ({
    price_data: {
      currency: "gbp" as const,
      unit_amount: option.pricePence,
      product_data: {
        name: lineName(product, option),
        description: lineDescription(product, option).slice(0, 380),
        metadata: {
          productId: product.id,
          slug: product.slug,
          mode: option.mode,
        },
      },
      ...(isSubscription ? { recurring: { interval: "month" as const } } : {}),
    },
    quantity: qty,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      customer_email: customerEmail,
      metadata: {
        cartItems: JSON.stringify(
          resolved.map((r) => ({
            slug: r.product.slug,
            mode: r.option.mode,
            qty: r.qty,
          })),
        ).slice(0, 480),
        cartTotal: String(
          resolved.reduce((n, r) => n + r.option.pricePence * r.qty, 0),
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function lineName(p: StoreProduct, opt: StoreProduct["options"][number]): string {
  switch (opt.mode) {
    case "preorder":
      return `Pre-order · ${p.title}`;
    case "subscription":
      return `${p.title} · hosted (monthly)`;
    case "pass":
      return `Kapture Forms · Designer Pass`;
    case "bundle":
      return `${p.title} · bundle`;
    default:
      return p.title;
  }
}

function lineDescription(p: StoreProduct, opt: StoreProduct["options"][number]): string {
  if (opt.mode === "preorder") {
    return `Reserve fee for ${p.title}. Full pack delivered free at launch.`;
  }
  if (opt.mode === "pass") {
    return "Unlimited downloads, source files, white-label rights. Cancel anytime.";
  }
  if (opt.mode === "subscription") {
    return `${p.title} hosted with a branded URL, magic-link invites, audit-hashed submissions.`;
  }
  if (opt.mode === "bundle") {
    return `${p.title} — bundle of ${p.whatsIncluded.length} packs.`;
  }
  return `${p.title} — five export formats, audit-hashed, lifetime updates.`;
}
