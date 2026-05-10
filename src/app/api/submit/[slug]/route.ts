import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@lib/supabase/server";

export const runtime = "nodejs";

/**
 * POST /api/submit/[slug]
 *
 * Body: { pathway: string, payload: Record<string, unknown> }
 *
 * 1. Looks up the license by slug.
 * 2. Computes SHA-256 of (license_id + pathway + canonical payload + timestamp).
 * 3. Inserts a row into `submissions` with the audit hash.
 * 4. Inserts a `submission_events` row marking 'submitted'.
 * 5. Returns the submission id + audit hash to the client.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  let body: { pathway?: string; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.payload || typeof body.payload !== "object") {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: license } = await supabase
    .from("licenses")
    .select("id, product_id, status, active_until, mode")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!license) {
    return NextResponse.json({ error: "Unknown license" }, { status: 404 });
  }
  if (license.status !== "active") {
    return NextResponse.json({ error: "License inactive" }, { status: 403 });
  }
  if (license.active_until && new Date(license.active_until) < new Date()) {
    return NextResponse.json({ error: "License expired" }, { status: 403 });
  }

  const submittedAt = new Date().toISOString();
  const canonical = JSON.stringify({
    license_id: license.id,
    pathway: body.pathway ?? null,
    payload: body.payload,
    submitted_at: submittedAt,
  });
  const auditHash = createHash("sha256").update(canonical).digest("hex");

  const submitterEmail =
    typeof body.payload.email === "string" ? body.payload.email : null;

  const { data: inserted, error } = await supabase
    .from("submissions")
    .insert({
      license_id: license.id,
      product_id: license.product_id,
      pathway_id: body.pathway ?? null,
      payload: body.payload,
      audit_hash: auditHash,
      submitted_by_email: submitterEmail,
      submitted_at: submittedAt,
      status: "submitted",
    })
    .select("id, audit_hash, submitted_at")
    .single();

  if (error || !inserted) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to record submission" },
      { status: 500 }
    );
  }

  await supabase.from("submission_events").insert({
    submission_id: inserted.id,
    event_type: "submitted",
    actor_email: submitterEmail,
    actor_role: "applicant",
    payload: { pathway: body.pathway ?? null, audit_hash: auditHash },
  });

  return NextResponse.json({
    id: inserted.id,
    audit_hash: inserted.audit_hash,
    submitted_at: inserted.submitted_at,
  });
}
