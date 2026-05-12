import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@lib/stripe";
import { getStoreProduct, type StoreProduct } from "@lib/store-product";

/**
 * POST /api/buy/[productId]
 *
 * `productId` can be:
 *   - A product slug (any taxonomy form, "designer-pass", a bundle slug)
 *
 * Body:
 *   { mode: "oneoff" | "subscription" | "preorder" | "bundle" | "pass",
 *     email?: string }
 *
 * Resolves the StoreProduct and the chosen option, then creates a Stripe
 * Checkout Session with inline price_data. Returns { url } for the
 * client to redirect to.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const product = getStoreProduct(params.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body: { mode?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const customerEmail =
    typeof body.email === "string" && /.+@.+\..+/.test(body.email)
      ? body.email.trim()
      : undefined;

  // Find the requested option, default to the primary one.
  const option =
    product.options.find((o) => o.mode === body.mode) ??
    product.options.find((o) => o.primary) ??
    product.options[0];

  if (!option) {
    return NextResponse.json({ error: "No purchase option available" }, { status: 400 });
  }

  // Subscriptions = subscription mode in Stripe. Everything else = payment.
  const isSubscription = option.mode === "subscription" || option.mode === "pass";

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: option.pricePence,
            product_data: {
              name: lineName(product, option),
              description: lineDescription(product, option).slice(0, 380),
              metadata: { productId: product.id, slug: product.slug },
            },
            ...(isSubscription ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${product.slug}?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      customer_email: customerEmail,
      metadata: {
        productId: product.id,
        slug: product.slug,
        mode: option.mode,
        status: product.status,
        industry: product.industry,
        ...(product.subcategory ? { subcategory: product.subcategory } : {}),
      },
      subscription_data: isSubscription
        ? {
            metadata: {
              productId: product.id,
              slug: product.slug,
              mode: option.mode,
            },
          }
        : undefined,
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
    return `Reserve fee for ${p.title}. The full pack ships in ${p.release ?? "the launch window"} at no extra cost — your reservation locks the 50% discount on the £29 launch price.`;
  }
  if (opt.mode === "pass") {
    return "Unlimited downloads, source files, white-label rights on one client domain, hosted runner. Cancel anytime.";
  }
  if (opt.mode === "subscription") {
    return `${p.title} hosted with a branded URL, magic-link invites, audit-hashed submissions, and inspector read-only access.`;
  }
  if (opt.mode === "bundle") {
    return `${p.title} — bundle of ${p.whatsIncluded.length} packs at a single price.`;
  }
  return `${p.title} — five export formats, audit-hashed, lifetime updates.`;
}
