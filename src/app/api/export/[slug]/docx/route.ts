import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getSchema } from "@lib/schemas";
import { buildDocx } from "@lib/exports/docx";

export const runtime = "nodejs";

/** GET /api/export/[slug]/docx — editable Word .docx of the form schema. */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createSupabaseAdminClient();
  const { data: license } = await supabase
    .from("licenses")
    .select("product_id, slug, status, active_until")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!license || license.status !== "active") {
    return new Response("License not active", { status: 403 });
  }
  if (license.active_until && new Date(license.active_until) < new Date()) {
    return new Response("License expired", { status: 403 });
  }
  const schema = getSchema(license.product_id);
  if (!schema) return new Response("Schema not authored for this product yet", { status: 404 });

  const docx = await buildDocx({ schema, licenseSlug: license.slug });
  return new Response(docx, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${license.product_id}.docx"`,
      "Cache-Control": "no-store",
    },
  });
}
