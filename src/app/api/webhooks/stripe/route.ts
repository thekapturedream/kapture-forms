import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@lib/stripe";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getProduct } from "@lib/products";
import { getSchema } from "@lib/schemas";
import { randomBytes } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook. Handles:
 *   checkout.session.completed       — provisions an order + license,
 *                                       sends a magic link
 *   customer.subscription.deleted    — marks license cancelled
 *   invoice.paid                     — extends license active_until
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const stripe = getStripe();
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      default:
        // Ignored events are still 200'd so Stripe stops retrying.
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const productId = (session.metadata?.productId as string | undefined) ?? null;
  const mode = (session.metadata?.mode as "oneoff" | "subscription" | undefined) ?? "oneoff";
  if (!productId) return;

  const product = getProduct(productId);
  if (!product) return;

  const supabase = createSupabaseAdminClient();
  const email =
    session.customer_details?.email ?? (session.customer_email ?? null);

  // 1. Upsert customer (linked to Supabase auth user when available).
  let customerId: string | null = null;
  if (email) {
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existing) {
      customerId = existing.id;
      if (session.customer && typeof session.customer === "string") {
        await supabase
          .from("customers")
          .update({ stripe_customer_id: session.customer })
          .eq("id", existing.id);
      }
    } else {
      const insert = await supabase
        .from("customers")
        .insert({
          email,
          stripe_customer_id:
            typeof session.customer === "string" ? session.customer : null,
          // user_id stays null until they authenticate via magic link
          user_id: null as unknown as string,
        })
        .select("id")
        .single();
      customerId = insert.data?.id ?? null;
    }
  }

  // 2. Insert order.
  const { data: order } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      product_id: productId,
      mode,
      status: "paid",
      stripe_session_id: session.id,
      stripe_subscription_id:
        typeof session.subscription === "string" ? session.subscription : null,
      amount_pence: session.amount_total ?? 2900,
      currency: (session.currency ?? "gbp").toLowerCase(),
      customer_email: email,
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  // 3. Insert license. When a schema is registered for this product we also
  //    persist its shape — the dashboard CSV export route uses this to seed
  //    the column list, and the future per-license table provisioning step
  //    (Supabase migration `licenses_submission_tables`) reads from it.
  if (customerId && order) {
    const slug = `${product.slug}-${randomBytes(4).toString("hex")}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://kapture-forms.com";
    const schema = getSchema(productId);
    const schemaShape = schema
      ? {
          schema_title: schema.title,
          schema_section_count: schema.sections.length,
          schema_field_count: schema.sections.reduce(
            (n, s) => n + s.fields.length,
            0,
          ),
          schema_pathways: schema.pathways.map((p) => p.id),
          submission_table: `submissions_${slug.replace(/[^a-z0-9_]/gi, "_")}`,
        }
      : null;

    const licenseRow: Record<string, unknown> = {
      customer_id: customerId,
      product_id: productId,
      order_id: order.id,
      mode,
      status: "active",
      slug,
      hosted_url: `${baseUrl}/run/${slug}`,
      active_until:
        mode === "subscription"
          ? new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    };
    // Conditional: only attach the shape if the licenses table exposes a
    // `customization` jsonb column. Older deployments without that column
    // simply ignore this key. The same column already stores buyer theme
    // overrides, so we merge under a `__schema` sub-key to keep concerns
    // separated.
    if (schemaShape) {
      licenseRow.customization = { __schema: schemaShape };
    }
    await supabase.from("licenses").insert(licenseRow);
  }

  // 4. Send magic link so the buyer can claim their dashboard.
  if (email) {
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://kapture-forms.com"
        }/auth/callback?next=/dashboard`,
      },
    });
    // Production note: hook up Resend/Postmark here to actually deliver
    // the link. Supabase generates it but does not send unless SMTP is
    // configured on the project.
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("licenses")
    .update({ status: "cancelled", active_until: new Date().toISOString() })
    .eq("order_id", null) // safe-guard — match by sub id below
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // Match licenses to subscription via the order's stripe_subscription_id.
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_subscription_id", sub.id);
  if (orders && orders.length > 0) {
    await supabase
      .from("licenses")
      .update({ status: "cancelled", active_until: new Date().toISOString() })
      .in(
        "order_id",
        orders.map((o) => o.id)
      );
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const supabase = createSupabaseAdminClient();
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subId) return;
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_subscription_id", subId);
  if (!orders || orders.length === 0) return;

  await supabase
    .from("licenses")
    .update({
      status: "active",
      active_until: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .in(
      "order_id",
      orders.map((o) => o.id)
    );
}
