import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@lib/supabase/server";
import { getProduct } from "@lib/products";

export const runtime = "nodejs";

/**
 * GET /api/export/[slug]/pdf
 *
 * Returns an A4 print-optimised HTML document. Browsers can save as PDF
 * via the print dialog. Real PDF rendering (puppeteer or @react-pdf/renderer)
 * lands in Phase 2 — this gate is the same: license must be active.
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
  const product = getProduct(license.product_id);
  if (!product) return new Response("Unknown product", { status: 404 });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escape(product.title)} · print template</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #0a0a0a; font-size: 11pt; line-height: 1.45; margin: 0; }
  h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22pt; letter-spacing: -0.02em; margin: 0 0 4pt; }
  h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13pt; margin: 18pt 0 4pt; padding-bottom: 4pt; border-bottom: 1px solid #d4d4d4; }
  .kicker { font-family: 'JetBrains Mono', monospace; font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: #876300; margin-bottom: 4pt; }
  .meta { font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; color: #6b7280; }
  .row { display: flex; gap: 16pt; }
  .field { flex: 1; padding: 4pt 0; border-bottom: 1px dashed #d4d4d4; min-height: 28pt; }
  .field label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 7pt; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280; margin-bottom: 2pt; }
  .checkbox { display: flex; align-items: flex-start; gap: 6pt; padding: 3pt 0; }
  .checkbox span.box { width: 10pt; height: 10pt; border: 1px solid #0a0a0a; display: inline-block; margin-top: 2pt; flex: 0 0 10pt; }
  footer { position: fixed; bottom: 8mm; left: 16mm; right: 16mm; border-top: 1px solid #d4d4d4; padding-top: 4pt; font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; color: #6b7280; display: flex; justify-content: space-between; }
  .pathways { display: flex; gap: 6pt; flex-wrap: wrap; margin: 10pt 0; }
  .pathway { padding: 4pt 8pt; border: 1px solid #0a0a0a; border-radius: 4pt; font-size: 8pt; }
</style>
</head>
<body>
  <div class="kicker">KAPTURE FORMS · ${product.industry.toUpperCase()}</div>
  <h1>${escape(product.title)}</h1>
  <div class="meta">License ${license.slug} · ${product.meta}</div>
  <div class="pathways">${product.pathways
    .map((p) => `<span class="pathway">☐ ${escape(p.name)}</span>`)
    .join("")}</div>

  <h2>Personal details</h2>
  <div class="row"><div class="field"><label>Full legal name</label></div></div>
  <div class="row">
    <div class="field"><label>Preferred name</label></div>
    <div class="field"><label>Date of birth</label></div>
  </div>
  <div class="row">
    <div class="field"><label>National Insurance number</label></div>
    <div class="field"><label>Email</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Mobile</label></div>
    <div class="field"><label>Address</label></div>
  </div>

  <h2>Right to work</h2>
  <div class="row">
    <div class="field"><label>Document type</label></div>
    <div class="field"><label>Document number</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Issue date</label></div>
    <div class="field"><label>Expiry date</label></div>
  </div>

  <h2>DBS · barred lists</h2>
  <div class="row">
    <div class="field"><label>DBS certificate number</label></div>
    <div class="field"><label>DBS issue date</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Update service?</label></div>
    <div class="field"><label>Barred list checked</label></div>
  </div>

  <h2>Professional registration (clinical only)</h2>
  <div class="row">
    <div class="field"><label>Body (NMC / HCPC / GMC)</label></div>
    <div class="field"><label>PIN / number</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Renewal date</label></div>
    <div class="field"><label>Restrictions</label></div>
  </div>

  <h2>Mandatory training</h2>
  <div class="row">
    <div class="field"><label>Safeguarding adults · date</label></div>
    <div class="field"><label>Moving & handling · date</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Infection control · date</label></div>
    <div class="field"><label>Fire safety · date</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Mental capacity · date</label></div>
    <div class="field"><label>First aid · date</label></div>
  </div>

  <h2>References</h2>
  <div class="row">
    <div class="field"><label>Reference 1 · name</label></div>
    <div class="field"><label>Reference 1 · email</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Reference 2 · name</label></div>
    <div class="field"><label>Reference 2 · email</label></div>
  </div>

  <h2>Bank · pension</h2>
  <div class="row">
    <div class="field"><label>Account holder</label></div>
    <div class="field"><label>Sort code</label></div>
  </div>
  <div class="row">
    <div class="field"><label>Account number</label></div>
    <div class="field"><label>Pension status</label></div>
  </div>

  <h2>Consents · acknowledgements</h2>
  <div class="checkbox"><span class="box"></span><span>I confirm the data above is accurate and consent to its processing under UK GDPR for the purposes of employment.</span></div>
  <div class="checkbox"><span class="box"></span><span>I have read and agree to comply with the Code of Conduct for healthcare support workers.</span></div>
  <div class="checkbox"><span class="box"></span><span>I understand my safeguarding obligations and the routes for raising concerns.</span></div>

  <h2>Signature</h2>
  <div class="row">
    <div class="field" style="min-height:60pt"><label>Applicant signature</label></div>
    <div class="field" style="min-height:60pt"><label>Date</label></div>
  </div>

  <footer>
    <span>Kapture Forms · ${product.id}</span>
    <span>License ${license.slug} · printed ${new Date().toISOString().slice(0, 10)}</span>
  </footer>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${product.id}.html"`,
      "Cache-Control": "no-store",
    },
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
