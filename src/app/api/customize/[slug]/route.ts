import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@lib/supabase/server";
import type { Customization } from "@lib/customization";

export const runtime = "nodejs";

/**
 * GET /api/customize/[slug]
 * Returns the current customization for the buyer's license.
 *
 * POST /api/customize/[slug]
 * Body: Customization JSON. Persists back into licenses.customization.
 *
 * Both require the requester to own the license (same customer_id ↔
 * auth user). Service-role used for the update so RLS doesn't block.
 */

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: license } = await admin
    .from("licenses")
    .select("id, slug, customer_id, customization")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!license) return NextResponse.json({ error: "License not found" }, { status: 404 });

  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!customer || customer.id !== license.customer_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ customization: license.customization ?? {} });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: Customization;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sanitised = sanitise(body);

  const admin = createSupabaseAdminClient();
  const { data: license } = await admin
    .from("licenses")
    .select("id, customer_id")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!license) return NextResponse.json({ error: "License not found" }, { status: 404 });

  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!customer || customer.id !== license.customer_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await admin
    .from("licenses")
    .update({ customization: sanitised })
    .eq("id", license.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customization: sanitised });
}

function sanitise(input: Customization): Customization {
  const out: Customization = {};
  if (typeof input.headline === "string") out.headline = input.headline.slice(0, 120);
  if (input.font === "manrope" || input.font === "inter" || input.font === "space-grotesk")
    out.font = input.font;
  if (typeof input.accent === "string" && /^#[0-9a-fA-F]{6}$/.test(input.accent))
    out.accent = input.accent;
  if (input.buttonShape === "square" || input.buttonShape === "rounded" || input.buttonShape === "pill")
    out.buttonShape = input.buttonShape;
  if (input.borderRadius === "square" || input.borderRadius === "rounded" || input.borderRadius === "pill")
    out.borderRadius = input.borderRadius;
  return out;
}
