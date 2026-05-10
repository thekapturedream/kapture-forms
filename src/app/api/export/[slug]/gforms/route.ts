import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getSchema } from "@lib/schemas";
import { buildGFormsSpec, APPS_SCRIPT_TEMPLATE } from "@lib/exports/gforms";

export const runtime = "nodejs";

/**
 * GET /api/export/[slug]/gforms
 * Returns a .json bundle containing the spec + the Apps Script importer.
 * Buyer pastes into Tools → Script Editor and runs createForm().
 */
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
  const schema = getSchema(license.product_id);
  if (!schema) return new Response("Schema not authored for this product yet", { status: 404 });

  const spec = buildGFormsSpec(schema);
  const bundle = {
    spec,
    apps_script: APPS_SCRIPT_TEMPLATE,
    instructions: [
      "1. Open script.google.com → New Project.",
      "2. Replace the file contents with `apps_script` below.",
      "3. Replace `SPEC = {/* paste-here */}` with the value of `spec` (the JSON object before this).",
      "4. Save. Run `createForm()`. First run will request OAuth — accept.",
      "5. The console logs the form URL — open it to inspect.",
    ],
  };

  const body = JSON.stringify(bundle, null, 2);
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${license.product_id}-google-forms.json"`,
      "Cache-Control": "no-store",
    },
  });
}
