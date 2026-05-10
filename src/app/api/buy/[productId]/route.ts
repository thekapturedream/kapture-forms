import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@lib/stripe";
import { getProduct } from "@lib/products";

/**
 * POST /api/buy/[productId]
 *
 * Creates a Stripe Checkout Session and returns its hosted URL.
 * Body: { mode: "oneoff" | "subscription" }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const product = getProduct(params.productId);
  if (!product || product.status !== "live") {
    return NextResponse.json({ error: "Product not available" }, { status: 404 });
  }

  let body: { mode?: "oneoff" | "subscription" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const mode = body.mode === "subscription" ? "subscription" : "oneoff";

  const priceId =
    mode === "subscription" ? product.price.subscription : product.price.oneOff;

  if (!priceId) {
    // Fallback — Stripe price not yet created. Use price_data inline so
    // the buy button still works in dev before publisher seeds prices.
    return createCheckoutWithInlinePrice(req, product, mode);
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: mode === "subscription" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${product.slug}?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      metadata: {
        productId: product.id,
        productSlug: product.slug,
        mode,
      },
      subscription_data:
        mode === "subscription"
          ? { metadata: { productId: product.id, productSlug: product.slug } }
          : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function createCheckoutWithInlinePrice(
  req: NextRequest,
  product: ReturnType<typeof getProduct> & object,
  mode: "oneoff" | "subscription"
) {
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: mode === "subscription" ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: 2900,
            product_data: {
              name: product.title,
              description: product.description.slice(0, 380),
              metadata: { productId: product.id },
            },
            ...(mode === "subscription"
              ? { recurring: { interval: "month" } }
              : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${product.slug}?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      metadata: {
        productId: product.id,
        productSlug: product.slug,
        mode,
      },
      subscription_data:
        mode === "subscription"
          ? { metadata: { productId: product.id, productSlug: product.slug } }
          : undefined,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
