import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getSchema } from "@lib/schemas";
import { buildEmbedHtml } from "@lib/exports/html-embed";

export const runtime = "nodejs";

/** GET /api/export/[slug]/html — self-contained embeddable HTML form. */
export async function GET(
  req: NextRequest,
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
  const schema = getSchema(license.product_id);
  if (!schema) return new Response("Schema not authored for this product yet", { status: 404 });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const html = buildEmbedHtml({ schema, licenseSlug: license.slug, baseUrl });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${license.product_id}-embed.html"`,
      "Cache-Control": "no-store",
    },
  });
}
