import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getSchema } from "@lib/schemas";
import { buildSchemaCsv, buildSubmissionsCsv } from "@lib/exports/csv";

export const runtime = "nodejs";

/**
 * GET /api/export/[slug]/csv?kind=schema|submissions
 * Default `kind` is `schema`. `submissions` returns one row per recorded
 * submission (audit-hashed) for the licensee.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") === "submissions" ? "submissions" : "schema";

  const supabase = createSupabaseAdminClient();
  const { data: license } = await supabase
    .from("licenses")
    .select("id, product_id, slug, status, active_until")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!license || license.status !== "active") {
    return new Response("License not active", { status: 403 });
  }
  const schema = getSchema(license.product_id);
  if (!schema) return new Response("Schema not authored for this product yet", { status: 404 });

  let csv: string;
  let filename: string;
  if (kind === "submissions") {
    const { data: rows } = await supabase
      .from("submissions")
      .select("id, submitted_at, pathway_id, audit_hash, payload")
      .eq("license_id", license.id)
      .order("submitted_at", { ascending: false });
    csv = buildSubmissionsCsv(schema, rows ?? []);
    filename = `${license.product_id}-submissions.csv`;
  } else {
    csv = buildSchemaCsv(schema);
    filename = `${license.product_id}-schema.csv`;
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
