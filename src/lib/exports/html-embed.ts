import { Field, PackSchema } from "../schemas/types";

/**
 * Generate a self-contained .html file the buyer can drop into their own
 * careers / intake page. No external dependencies — fonts inlined from
 * Google CDN via <link>, all CSS scoped via `data-kapture` attribute.
 *
 * The form posts to /api/embed/[licenseSlug] on the buyer's Kapture
 * hosted endpoint. That endpoint applies CORS and an Origin allowlist —
 * defined per license in the buyer dashboard (Phase 2 of embed).
 */

interface BuildEmbedArgs {
  schema: PackSchema;
  licenseSlug: string;
  /** Absolute base URL of the Kapture deployment, e.g. https://forms.thekapture.com */
  baseUrl: string;
}

export function buildEmbedHtml({ schema, licenseSlug, baseUrl }: BuildEmbedArgs): string {
  const submitUrl = `${baseUrl}/api/embed/${encodeURIComponent(licenseSlug)}`;
  const fields = schema.sections
    .map((section) => sectionHtml(section.id, section.name, section.intro, section.fields))
    .join("\n");

  return `<!doctype html>
<html lang="en" data-kapture-pack="${escAttr(schema.productId)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escHtml(schema.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
  <style>
${STYLE}
  </style>
</head>
<body data-kapture>
  <main data-kapture-form>
    <header data-kapture-head>
      <span data-kapture-kicker>FORMS · STORE</span>
      <h1>${escHtml(schema.title)}</h1>
      <p data-kapture-pathways>${escHtml(schema.pathways.map((p) => p.name).join(" · "))}</p>
    </header>

    <form id="kapture-form" data-kapture-license="${escAttr(licenseSlug)}" novalidate>
      <fieldset data-kapture-pathway>
        <legend>Pathway</legend>
        ${schema.pathways
          .map(
            (p, i) =>
              `<label><input type="radio" name="pathway" value="${escAttr(p.id)}" ${i === 0 ? "checked" : ""} /> ${escHtml(p.name)}</label>`
          )
          .join("")}
      </fieldset>

${fields}

      <button type="submit" data-kapture-submit>Submit · sign · audit-hash</button>
      <p data-kapture-foot>
        Powered by <a href="${escAttr(baseUrl)}" target="_blank" rel="noopener">Kapture Forms</a> · License ${escHtml(licenseSlug)}
      </p>
    </form>

    <div data-kapture-status hidden></div>
  </main>

  <script>
    (function () {
      var form = document.getElementById('kapture-form');
      var status = document.querySelector('[data-kapture-status]');
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        var pathway = fd.get('pathway');
        fd.forEach(function (v, k) { if (k !== 'pathway') payload[k] = v; });
        status.hidden = false;
        status.textContent = 'Submitting…';
        try {
          var res = await fetch(${JSON.stringify(submitUrl)}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pathway: pathway, payload: payload })
          });
          var data = await res.json();
          if (!res.ok) throw new Error(data.error || 'submission failed');
          status.textContent = 'Submitted. Audit hash: ' + (data.audit_hash || 'recorded');
          form.reset();
        } catch (err) {
          status.textContent = 'Submission failed: ' + (err.message || err);
        }
      });
    })();
  </script>
</body>
</html>
`;
}

function sectionHtml(id: string, name: string, intro: string | undefined, fields: Field[]): string {
  return `      <fieldset data-kapture-section="${escAttr(id)}">
        <legend>${escHtml(name)}</legend>
        ${intro ? `<p data-kapture-intro>${escHtml(intro)}</p>` : ""}
        ${fields.map(fieldHtml).join("\n        ")}
      </fieldset>`;
}

function fieldHtml(f: Field): string {
  const id = `f-${escAttr(f.id)}`;
  const req = f.required ? " required" : "";
  const dp = (f.pathways ?? []).join(",");
  const pathwaysAttr = dp ? ` data-pathways="${escAttr(dp)}"` : "";
  const labelHtml = `<label for="${id}">${escHtml(f.label)}${f.required ? ' <span data-kapture-req>*</span>' : ""}${
    f.regulator ? ` <span data-kapture-reg>${escHtml(f.regulator)}</span>` : ""
  }</label>`;

  switch (f.type) {
    case "textarea":
      return `<div data-kapture-row${pathwaysAttr}>${labelHtml}<textarea id="${id}" name="${escAttr(f.id)}"${req}></textarea></div>`;
    case "select":
      return `<div data-kapture-row${pathwaysAttr}>${labelHtml}<select id="${id}" name="${escAttr(f.id)}"${req}><option value="">— select —</option>${(f.options ?? [])
        .map((o) => `<option value="${escAttr(o)}">${escHtml(o)}</option>`)
        .join("")}</select></div>`;
    case "checkbox":
      return `<div data-kapture-row data-kapture-check${pathwaysAttr}><label><input type="checkbox" id="${id}" name="${escAttr(f.id)}" value="1"${req} /> ${escHtml(f.label)}${
        f.regulator ? ` <span data-kapture-reg>${escHtml(f.regulator)}</span>` : ""
      }</label></div>`;
    default:
      return `<div data-kapture-row${pathwaysAttr}>${labelHtml}<input type="${f.type}" id="${id}" name="${escAttr(f.id)}"${req} placeholder="${escAttr(f.placeholder ?? "")}" /></div>`;
  }
}

function escHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
function escAttr(s: string): string {
  return escHtml(s);
}

const STYLE = `
  [data-kapture] { box-sizing:border-box; font-family:'Inter',system-ui,sans-serif; color:#0A0A0A; background:#fff; margin:0; padding:24px; }
  [data-kapture] *, [data-kapture] *:before, [data-kapture] *:after { box-sizing:border-box; }
  [data-kapture-form] { max-width:720px; margin:0 auto; }
  [data-kapture-head] { margin-bottom:24px; }
  [data-kapture-kicker] { font-family:'JetBrains Mono',monospace; font-size:.6875rem; letter-spacing:.14em; color:#876300; display:inline-flex; align-items:center; gap:.5rem; }
  [data-kapture-kicker]:before { content:''; width:24px; height:2px; background:#FFD400; }
  [data-kapture-form] h1 { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(1.5rem,3.5vw,2.25rem); letter-spacing:-.02em; margin:.5rem 0; }
  [data-kapture-pathways] { color:#3A3A3A; font-size:.875rem; margin:0; }
  fieldset { border:1px solid #ECEAE3; border-radius:14px; padding:16px 20px; margin:0 0 16px; }
  legend { font-family:'Space Grotesk',sans-serif; font-weight:600; padding:0 6px; font-size:.875rem; }
  [data-kapture-intro] { font-size:.8125rem; color:#555; margin:0 0 8px; }
  [data-kapture-row] { display:flex; flex-direction:column; gap:6px; margin:10px 0; }
  [data-kapture-row] label { font-family:'JetBrains Mono',monospace; font-size:.6875rem; text-transform:uppercase; letter-spacing:.08em; color:#3A3A3A; font-weight:600; }
  [data-kapture-row] input, [data-kapture-row] select, [data-kapture-row] textarea { width:100%; padding:10px 12px; border:1px solid #D4D4D4; border-radius:10px; font-size:.9rem; background:#fff; }
  [data-kapture-row] textarea { min-height:96px; }
  [data-kapture-check] { flex-direction:row; align-items:flex-start; gap:8px; }
  [data-kapture-check] label { font-family:'Inter',sans-serif; text-transform:none; letter-spacing:0; font-size:.875rem; font-weight:400; color:#0A0A0A; display:flex; gap:8px; align-items:flex-start; }
  [data-kapture-req] { color:#B42318; }
  [data-kapture-reg] { font-family:'JetBrains Mono',monospace; font-size:.625rem; letter-spacing:.04em; color:#0A0A0A; background:#FFD400; padding:1px 6px; border-radius:6px; margin-left:6px; }
  [data-kapture-submit] { background:#FFD400; color:#0A0A0A; border:1px solid #FFD400; padding:12px 16px; border-radius:10px; font-weight:600; cursor:pointer; font-size:.9rem; }
  [data-kapture-submit]:hover { background:#F5B400; }
  [data-kapture-foot] { font-size:.75rem; color:#6B7280; margin-top:12px; }
  [data-kapture-foot] a { color:#0A0A0A; }
  [data-kapture-status] { margin-top:12px; padding:10px 12px; border-radius:10px; background:#F5F5F5; font-family:'JetBrains Mono',monospace; font-size:.8125rem; }
`;
