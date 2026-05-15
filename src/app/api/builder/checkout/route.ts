import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@lib/stripe";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import {
  BUILDER_FEE_PENCE,
  BUILDER_FORMATS,
  type BuilderCheckoutBody,
  type BuilderFormat,
} from "@lib/builder/types";

/**
 * POST /api/builder/checkout
 *
 * Body: { email, format, title?, schema }
 *
 * Stores the schema in public.builder_orders (status='pending'), creates
 * a £2 Stripe Checkout session with metadata.type='builder' +
 * metadata.builderOrderId, and returns { url } for the client to redirect.
 *
 * On checkout.session.completed the Stripe webhook reads the row, renders
 * the schema into the requested format, emails the file, and stamps the
 * row fulfilled. No buyer login required — Kapture Builder is a one-shot,
 * pay-by-email service.
 */
export async function POST(req: NextRequest) {
  let body: BuilderCheckoutBody;
  try {
    body = (await req.json()) as BuilderCheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validation.
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  if (!body.format || !BUILDER_FORMATS.some((f) => f.id === body.format)) {
    return NextResponse.json({ error: "Choose a format" }, { status: 400 });
  }
  if (!body.schema || typeof body.schema !== "object") {
    return NextResponse.json({ error: "Missing schema" }, { status: 400 });
  }
  if (!Array.isArray(body.schema.sections) || body.schema.sections.length === 0) {
    return NextResponse.json(
      { error: "Add at least one section with a field before generating" },
      { status: 400 },
    );
  }
  const totalFields = body.schema.sections.reduce(
    (n, s) => n + (Array.isArray(s.fields) ? s.fields.length : 0),
    0,
  );
  if (totalFields === 0) {
    return NextResponse.json(
      { error: "Your form has no fields yet" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : body.schema.title || "Kapture form";

  // Insert pending order — the schema lives server-side so we don't have to
  // ship it through Stripe metadata (which has hard size limits).
  const insert = await supabase
    .from("builder_orders")
    .insert({
      email,
      format: body.format as BuilderFormat,
      title,
      schema: body.schema,
      status: "pending",
    })
    .select("id")
    .single();

  if (insert.error || !insert.data) {
    const msg = insert.error?.message ?? "Could not save your order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const orderId = insert.data.id as string;
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = getStripe();
  const formatLabel =
    BUILDER_FORMATS.find((f) => f.id === body.format)?.label ?? body.format;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: BUILDER_FEE_PENCE,
            product_data: {
              name: `Kapture Builder · ${title}`,
              description: `Auto-generated ${formatLabel} delivered to ${email}.`,
              metadata: { builderOrderId: orderId },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/builder?paid=1&order=${orderId}`,
      cancel_url: `${origin}/builder?cancelled=1`,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      customer_email: email,
      metadata: {
        type: "builder",
        builderOrderId: orderId,
        format: body.format,
      },
    });

    // Stamp the session id back on the order so the webhook can correlate.
    await supabase
      .from("builder_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", orderId);

    return NextResponse.json({ url: session.url, orderId });
  } catch (err) {
    // Don't leave a dangling pending row — mark it failed so we can debug.
    await supabase
      .from("builder_orders")
      .update({
        status: "failed",
        error: err instanceof Error ? err.message : "Stripe error",
      })
      .eq("id", orderId);
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
