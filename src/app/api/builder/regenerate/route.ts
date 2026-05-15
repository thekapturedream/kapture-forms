import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@lib/stripe";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import {
  BUILDER_FORMATS,
  SINGLE_FORMATS,
  priceForFormat,
  type BuilderFormat,
  type BuilderRegenerateBody,
} from "@lib/builder/types";

/**
 * POST /api/builder/regenerate
 *
 * Body: { orderId, format }
 *
 * Re-uses the schema + email + title from a previous fulfilled builder
 * order. Inserts a NEW builder_orders row referencing the same schema
 * with the new format, creates a Stripe Checkout session priced by
 * format (£2 single / £8 bundle), redirects.
 *
 * The original order's email is used — Stripe shows it on checkout but
 * the customer can override. No auth required: anyone with the order
 * link can regenerate, and they pay £2 / £8 to do it, so abuse is
 * self-limiting.
 */
export async function POST(req: NextRequest) {
  let body: BuilderRegenerateBody;
  try {
    body = (await req.json()) as BuilderRegenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.orderId || typeof body.orderId !== "string") {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  const isValidFormat =
    body.format === "all" || SINGLE_FORMATS.includes(body.format as never);
  if (!body.format || !isValidFormat) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: original, error } = await supabase
    .from("builder_orders")
    .select("id, email, title, schema, status")
    .eq("id", body.orderId)
    .maybeSingle();
  if (error || !original) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Insert the regenerate as a brand-new order. Keeps audit clean: each
  // fulfillment is its own row with its own Stripe session.
  const insert = await supabase
    .from("builder_orders")
    .insert({
      email: original.email,
      title: original.title,
      schema: original.schema,
      format: body.format as BuilderFormat,
      status: "pending",
    })
    .select("id")
    .single();

  if (insert.error || !insert.data) {
    return NextResponse.json(
      { error: insert.error?.message ?? "Could not queue regenerate" },
      { status: 500 },
    );
  }

  const newOrderId = insert.data.id as string;
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();
  const amount = priceForFormat(body.format);
  const formatLabel =
    body.format === "all"
      ? "All 5 formats"
      : BUILDER_FORMATS.find((f) => f.id === body.format)?.label ?? body.format;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: amount,
            product_data: {
              name: `Kapture Builder · regenerate · ${original.title ?? "form"}`,
              description: `Regenerate as ${formatLabel}, delivered to ${original.email}.`,
              metadata: { builderOrderId: newOrderId, regenerate: "1" },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/builder?paid=1&order=${newOrderId}`,
      cancel_url: `${origin}/builder/regenerate/${original.id}?cancelled=1`,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      customer_email: original.email,
      metadata: {
        type: "builder",
        builderOrderId: newOrderId,
        regenerate: "1",
        format: body.format,
      },
    });

    await supabase
      .from("builder_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", newOrderId);

    return NextResponse.json({ url: session.url, orderId: newOrderId });
  } catch (err) {
    await supabase
      .from("builder_orders")
      .update({
        status: "failed",
        error: err instanceof Error ? err.message : "Stripe error",
      })
      .eq("id", newOrderId);
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
