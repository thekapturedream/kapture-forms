import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getSchema } from "@lib/schemas";
import { buildPdf } from "@lib/exports/pdf";

export const runtime = "nodejs";

/**
 * GET /api/export/[slug]/pdf
 * Generates a print-ready A4 PDF for the buyer's pack from the live schema.
 * Streams the binary directly. Browser downloads it as <pack>.pdf.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createSupabaseAdminClient();
  const { data: license } = await supabase
    .from("licenses")
    .select("id, product_id, slug, status, active_until")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!license || license.status !== "active") {
    return new Response("License not active", { status: 403 });
  }
  if (license.active_until && new Date(license.active_until) < new Date()) {
    return new Response("License expired", { status: 403 });
  }

  const schema = getSchema(license.product_id);
  if (!schema) {
    return new Response("Schema not authored for this product yet", { status: 404 });
  }

  const pdf = await buildPdf({ schema, licenseSlug: license.slug });
  // Buffer.from gives us a BodyInit-compatible value (Node Buffer extends Uint8Array)
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${license.product_id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
