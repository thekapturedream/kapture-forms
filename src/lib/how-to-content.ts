/**
 * Kapture Forms · how-to content.
 *
 * Single source for the /how-to/* hub. Each guide is data, rendered by
 * one template (`src/app/how-to/[slug]/page.tsx`) so adding a new guide
 * is one entry here.
 */

export interface HowToStep {
  title: string;
  body: string;
  /** Optional pre-formatted code / shell snippet shown beneath the body. */
  code?: string;
}

export interface HowToFaq {
  q: string;
  a: string;
}

export interface HowToGuide {
  slug: string;
  format?: "pdf" | "docx" | "html" | "csv" | "gforms" | "web" | "audit-hash" | "branding" | "regulators";
  /** Page title — also used as the H1 */
  title: string;
  /** Marketplace search-friendly subtitle */
  subtitle: string;
  /** One-line meta description for OG / SEO */
  description: string;
  /** Audience badges shown above the title */
  audience: string[];
  /** Read-time estimate, surfaced in the index */
  readTime: string;
  /** Lede paragraph rendered below the title */
  intro: string;
  /** Numbered steps */
  steps: HowToStep[];
  /** Frequently asked / common edge cases */
  faqs?: HowToFaq[];
  /** Cross-links to other guides */
  related?: string[];
}

export const HOW_TO_GUIDES: HowToGuide[] = [
  // ---------------------------------------------------------------- PDF
  {
    slug: "pdf",
    format: "pdf",
    title: "Print-ready PDF",
    subtitle: "A4 · audit-hash footer · drop straight into the HR file",
    description:
      "How to download, print, and store the Kapture Forms PDF — including how the audit hash on the footer satisfies CQC, NMC, and DSPT inspectors.",
    audience: ["HR admin", "Registered manager", "Compliance lead"],
    readTime: "3 min",
    intro:
      "The PDF is the universal artefact. It prints at A4, signs in ink, scans cleanly, and the audit footer shows every inspector that the form was generated from a regulator-mapped pack. Use it when you need a piece of paper and a wet signature.",
    steps: [
      {
        title: "Download",
        body: "Open the dashboard, find the licence, and click `Download` under the PDF tile. The file lands in your browser as `<pack-id>.pdf`.",
      },
      {
        title: "Inspect the audit footer",
        body: "Every page footer carries the licence slug, generated date, and page number. The licence slug is the key the inspector or your auditor uses to verify the pack against the regulator-mapping in our marketplace listing.",
      },
      {
        title: "Print + sign",
        body: "Print at 100% scale (no fit-to-page — that distorts the field lines). Have the applicant sign in pen at the signature block and the manager counter-sign.",
      },
      {
        title: "Scan and file",
        body: "Scan back to PDF at 300dpi. Save under `Onboarding/<staff-name>/<date>.pdf` in your evidence drive.",
        code: "Onboarding/\n  jane-smith/\n    2026-05-10-onboarding-signed.pdf",
      },
      {
        title: "Re-download when the regulator updates",
        body: "Whenever CQC, NMC, or HCPC changes a required field, we update the schema. Re-download the PDF on your next intake — your previous PDFs stay valid for the staff already onboarded.",
      },
    ],
    faqs: [
      {
        q: "What if my printer rescales the page?",
        a: "Open the print dialog → Scale → set to 100% (or 'Actual size'). Fit-to-page mangles the field lines and breaks the audit footer alignment.",
      },
      {
        q: "Can I edit the PDF in Acrobat / Preview?",
        a: "Yes, but if you change a field label you break the regulator mapping. Use the DOCX export instead — that's the editing surface.",
      },
      {
        q: "Is the audit footer enough on its own?",
        a: "It's the start. The full audit hash is generated when you submit through the hosted runner (not the printed PDF). For paper-only flows, the footer + your signed signature block is the audit trail.",
      },
    ],
    related: ["docx", "audit-hash", "branding"],
  },

  // ---------------------------------------------------------------- DOCX
  {
    slug: "docx",
    format: "docx",
    title: "Editable Word (.docx)",
    subtitle: "Track-changes ready · drop into your house style",
    description:
      "How to open, edit, and re-export the Kapture Forms Word document. For HR teams that brand every artefact in their own style.",
    audience: ["HR admin", "L&D lead", "House-style editor"],
    readTime: "4 min",
    intro:
      "The DOCX is the editable surface. Use it when you need your own header / footer, your own colour, or a specific phrase added on top of the regulator-required fields. It opens cleanly in Microsoft Word, Google Docs, LibreOffice, and Apple Pages.",
    steps: [
      {
        title: "Download + open",
        body: "From the dashboard, click `Download` under DOCX. Open in Word — you'll see the cover page, the section blocks, and the signature table.",
      },
      {
        title: "Add your house style",
        body: "Apply your brand to the cover only. Leave the section labels and field labels untouched — those are the regulator-mapped strings.",
      },
      {
        title: "Track changes (optional)",
        body: "If your auditor wants to see the diff between our pack and your edited version, turn on Track Changes (Review → Track Changes) before editing. Save the .docx with revisions visible.",
      },
      {
        title: "Re-export to PDF for the file",
        body: "Once edited, File → Export → PDF. Or print to PDF. The PDF you produce here replaces the auto-generated PDF in your filing — keep the audit footer line at the bottom of every page.",
      },
      {
        title: "Don't change required fields",
        body: "If you need to add a field, contact us — we'll add it to the schema for the whole industry. Local edits get lost on the next regulator update.",
      },
    ],
    faqs: [
      {
        q: "Can I delete sections I don't use?",
        a: "Yes — but the field count drops on your audit footer. If you're confident those sections genuinely don't apply to your provider, delete them and add a note to your DPO.",
      },
      {
        q: "Where do I add our logo?",
        a: "Header (Insert → Header). Centre it above the cover-page brand mark. Don't replace the Kapture mark — the inspector uses it to verify the pack origin.",
      },
    ],
    related: ["pdf", "branding", "regulators"],
  },

  // ---------------------------------------------------------------- HTML embed
  {
    slug: "html",
    format: "html",
    title: "HTML embed",
    subtitle: "Drop the form into your careers page · same audit hash",
    description:
      "How to embed the Kapture Forms widget on your careers / intake page. Self-contained HTML, no build step, posts to our audit-hashed endpoint.",
    audience: ["Web developer", "Careers manager", "Marketing lead"],
    readTime: "5 min",
    intro:
      "The HTML embed is a single, self-contained file. You upload it to your CMS or paste it into a page template, and the form runs on your domain — but submissions still get the audit hash because they POST to our hosted endpoint.",
    steps: [
      {
        title: "Download the embed",
        body: "From the dashboard, click `Download` under HTML. You get a single `.html` file with the form, scoped CSS, and a JavaScript handler.",
      },
      {
        title: "Allowlist your origin",
        body: "Email forms@thekapture.com with the domain you'll embed on (e.g. `careers.your-care-group.com`). We add it to the licence's CORS allowlist within an hour.",
      },
      {
        title: "Drop into your CMS",
        body: "WordPress: Custom HTML block. Webflow: Embed component. Squarespace: Code block. Or save as a standalone page on your server.",
        code: '<!-- WordPress example -->\n<!-- wp:html -->\n<!-- paste contents of .html file here -->\n<!-- /wp:html -->',
      },
      {
        title: "Test the submission",
        body: "Submit a test entry. Check the dashboard — the row should appear with an audit hash and your buyer email. If the dashboard shows nothing, your origin isn't on the allowlist yet.",
      },
      {
        title: "Style the wrapper",
        body: "All Kapture styles are scoped under `[data-kapture]`. Wrap or nest the embed inside your own grid / page chrome — your CSS won't conflict.",
      },
    ],
    faqs: [
      {
        q: "Can I change the colours?",
        a: "Yes — override the CSS variables `--kapture-yellow` and `--kapture-black` from your parent stylesheet. Keep contrast above 4.5:1 for AA accessibility.",
      },
      {
        q: "Does it work without JavaScript?",
        a: "No — the audit hash requires a fetch to our endpoint. JS-disabled visitors get a fallback message pointing them to your hosted Kapture URL.",
      },
      {
        q: "What about multi-page forms?",
        a: "The embed is single-page. For multi-step UX, link buttons that scroll between sections — the data persists in the form until submitted.",
      },
    ],
    related: ["hosted", "audit-hash", "csv"],
  },

  // ---------------------------------------------------------------- CSV
  {
    slug: "csv",
    format: "csv",
    title: "CSV — schema + submissions",
    subtitle: "Bamboo · Breathe · Workday import-ready",
    description:
      "How to use the Kapture Forms CSV exports. Two flavours: the schema CSV (one row per field) and the submissions CSV (one row per submission).",
    audience: ["HRIS admin", "Data analyst", "Integration engineer"],
    readTime: "6 min",
    intro:
      "Two CSVs ship per pack. The **schema CSV** describes the form so you can recreate it inside your HRIS. The **submissions CSV** is the running ledger of every hosted-form submission — bring it into your warehouse, your auditor's spreadsheet, or your monthly report.",
    steps: [
      {
        title: "Schema CSV — for your HRIS",
        body: "From the dashboard, click `Download` under CSV. The file lists every field: section, label, type, required, options, regulator citation. Map these columns to your HRIS field model and import.",
        code: "section_id,section_name,field_id,field_label,field_type,required,options,pathways,regulator,help",
      },
      {
        title: "Submissions CSV — for reporting",
        body: "Click the `Download submissions CSV` button below the format grid. One row per submission, one column per field, plus `audit_hash` and `submitted_at`. Open in Excel / Google Sheets / Power BI.",
      },
      {
        title: "Import into Bamboo HR",
        body: "Bamboo → Settings → Import Data → Custom CSV. Map `field_id` → Bamboo field name. Required columns: `field_label`, `field_type`. The schema CSV ships in the exact shape Bamboo expects.",
      },
      {
        title: "Import into Workday",
        body: "Workday accepts CSV through the Data Import wizard (Setup → Integrations → Data Import). Use the schema CSV as the field-config source. The submissions CSV maps onto Workday's standard `Worker_Profile` import shape.",
      },
      {
        title: "Schedule weekly snapshots",
        body: "If you want a weekly snapshot dropped into S3 / Drive, hit the `/api/export/[slug]/csv?kind=submissions` endpoint from your scheduler with your licence slug. The endpoint requires the licence to be active — no extra auth.",
        code: "curl -O https://forms.thekapture.com/api/export/<licence-slug>/csv?kind=submissions",
      },
    ],
    faqs: [
      {
        q: "What's the encoding?",
        a: "UTF-8 with comma delimiters. Excel on Windows sometimes mis-detects this — open via `Data → From Text/CSV` and pick UTF-8 explicitly.",
      },
      {
        q: "Can I get JSON instead?",
        a: "The Google Forms export returns JSON. For the wider 'submissions as JSON' use case, contact us — the API supports it but the dashboard UI is CSV-only today.",
      },
      {
        q: "Does the submissions CSV include payroll-sensitive fields?",
        a: "Yes — bank and pension fields are present. Treat the file as confidential and store in a controlled-access location.",
      },
    ],
    related: ["html", "audit-hash"],
  },

  // ---------------------------------------------------------------- GForms
  {
    slug: "google-forms",
    format: "gforms",
    title: "Google Forms spec",
    subtitle: "Apps Script importer · recreates the pack as a Google Form",
    description:
      "How to use the Kapture Forms Google Forms JSON. Paste the bundled Apps Script + spec into a fresh Google Form and run createForm() — the entire pack rebuilds in seconds.",
    audience: ["Google Workspace admin", "Operations lead"],
    readTime: "5 min",
    intro:
      "The Google Forms export is for teams who already live in Google Workspace and want responses to land directly in Google Sheets. The bundled Apps Script recreates every section, every field, every conditional choice — you don't rebuild the form by hand.",
    steps: [
      {
        title: "Download the bundle",
        body: "From the dashboard, click `Download` under GFORMS. You get a `.json` file containing two things: `spec` (the schema) and `apps_script` (the importer code).",
      },
      {
        title: "Open Apps Script",
        body: "Visit script.google.com → New Project. Replace the boilerplate with the contents of `apps_script` from the bundle.",
      },
      {
        title: "Paste the spec",
        body: "Find the line `const SPEC = {/* paste-here */};` and replace `{/* paste-here */}` with the value of `spec` from the JSON bundle. Save.",
      },
      {
        title: "Run createForm()",
        body: "Click Run. First run will request OAuth — accept the scopes (`Manage your forms in Google Drive`). The script will create a fresh Form and log the URL.",
      },
      {
        title: "Connect to a Sheet",
        body: "In the new Form: Responses → Link to Sheets. Submissions land as rows in Sheets. Note: this path doesn't carry the audit hash — only the hosted Kapture runner does.",
      },
    ],
    faqs: [
      {
        q: "Why not a one-click import?",
        a: "Google Forms doesn't have a public bulk-import API. Apps Script is the official path. Once you've run it, the form is yours.",
      },
      {
        q: "Will it re-run if I update the spec?",
        a: "No — re-running creates a brand-new form. To update an existing form, edit the fields manually or run a custom Apps Script that mutates the existing form.",
      },
      {
        q: "Can responses still be audit-hashed?",
        a: "No. Google Forms responses live in your Google environment. To get the audit hash, point staff at the hosted Kapture URL instead.",
      },
    ],
    related: ["html", "csv", "hosted"],
  },

  // ---------------------------------------------------------------- Hosted
  {
    slug: "hosted",
    format: "web",
    title: "Hosted form runner",
    subtitle: "Branded URL · magic-link invites · queue · audit hash",
    description:
      "How to use the Kapture Forms hosted runner. The fully-managed surface — your branded URL, magic links to your applicants, and a queue with audit hashes built in.",
    audience: ["Registered manager", "HR admin", "Compliance lead"],
    readTime: "5 min",
    intro:
      "The hosted runner is the highest-trust path. Every submission lands in your dashboard signed and timestamped. Inspectors get read-only access. Staff get a magic link to the form — no password, no rebuild.",
    steps: [
      {
        title: "Open your hosted form",
        body: "From the dashboard, click `Open form` on the hosted licence row. You'll land at `forms.thekapture.com/run/<licence-slug>`.",
      },
      {
        title: "Send a magic link to a candidate",
        body: "From your hosted page, click `Invite` (Phase 2 UI — for now, share the URL directly). The candidate gets a one-time link by email and lands straight in the form.",
      },
      {
        title: "Pick the right pathway",
        body: "Permanent clinical, permanent non-clinical, agency / bank, volunteer / student. The form auto-hides fields that don't apply — saving the candidate time.",
      },
      {
        title: "Watch the submission audit hash",
        body: "On submit, the runner shows the SHA-256 audit hash. That hash is the same one stored in the database, exported in the CSV, and footnoted on the PDF generated from this submission.",
        code: "audit_hash = sha256(license_id + pathway + canonical(payload) + submitted_at)",
      },
      {
        title: "Co-brand the runner",
        body: "Premium subscribers can swap the Kapture chrome for their own logo + colours. See the branding guide.",
      },
    ],
    faqs: [
      {
        q: "Can multiple staff fill out the same form at once?",
        a: "Yes — each magic link is independent. Use the queue view to see who's mid-flow and who's submitted.",
      },
      {
        q: "What happens if the candidate refreshes mid-form?",
        a: "Their entries are not persisted between sessions (Phase 2 will autosave). Encourage candidates to complete in one sitting.",
      },
      {
        q: "Is the audit hash visible to the candidate?",
        a: "Yes — they see it on the success page after submitting. Builds trust + makes them a witness to the audit trail.",
      },
    ],
    related: ["audit-hash", "branding", "html"],
  },

  // ---------------------------------------------------------------- Audit hash
  {
    slug: "audit-hash",
    format: "audit-hash",
    title: "The audit hash, explained",
    subtitle: "What it is · what it proves · how to read it",
    description:
      "How the Kapture Forms SHA-256 audit hash works, what it proves to a CQC / NMC / DSPT inspector, and how to verify it against the database.",
    audience: ["Compliance lead", "Registered manager", "Auditor"],
    readTime: "4 min",
    intro:
      "Every submission through the hosted runner is signed with a SHA-256 hash. That hash is computed from the licence ID, the pathway, a canonical (sorted) JSON of the payload, and the server-stamped timestamp. It's tamper-evident, it's reproducible, and it's defensible.",
    steps: [
      {
        title: "What goes into the hash",
        body: "The SHA-256 input is the JSON string of `{license_id, pathway, payload, submitted_at}`. Field order is fixed. Whitespace is canonicalised. Two identical submissions produce identical hashes.",
        code: "audit_hash = sha256(JSON.stringify({\n  license_id, pathway, payload, submitted_at\n}))",
      },
      {
        title: "Where it appears",
        body: "On the candidate's success screen. In the database (`submissions.audit_hash`). In the submissions CSV (`audit_hash` column). On the PDF generated from a recorded submission (Phase 2 — currently the field is in the footer).",
      },
      {
        title: "What it proves",
        body: "That this exact payload, against this exact licence, at this exact second, hasn't been altered since submission. If the database changes, the hash will not match a recomputation.",
      },
      {
        title: "How an inspector verifies",
        body: "Open the audit log row in the dashboard. The hash and the canonical payload are both visible. The inspector can recompute SHA-256 of the canonical payload using any tool (e.g. `shasum -a 256`) and confirm the match.",
        code: "echo -n '<canonical-json>' | shasum -a 256",
      },
      {
        title: "What it doesn't prove",
        body: "It doesn't prove the submitter is who they say they are — that's the right-to-work + DBS check. It doesn't prove a specific person filled it out — that's the signature block on the PDF. It proves the data hasn't been changed since it was captured.",
      },
    ],
    faqs: [
      {
        q: "Is SHA-256 enough?",
        a: "Yes. SHA-256 is the standard for tamper-evidence in regulatory contexts. NHS Digital, GOV.UK Verify, and HMRC all use it.",
      },
      {
        q: "What about the printed PDF — does it have an audit hash?",
        a: "The PDF you download for blank-form filling has a licence slug + generated date in the footer (the audit footer is the trail). The hash is generated only when a real submission lands through the hosted runner.",
      },
      {
        q: "Can I include the hash in my own audit logs?",
        a: "Yes — pull the submissions CSV and store `audit_hash` alongside your own audit metadata.",
      },
    ],
    related: ["hosted", "csv", "pdf"],
  },

  // ---------------------------------------------------------------- Branding
  {
    slug: "branding",
    format: "branding",
    title: "Co-brand the hosted runner",
    subtitle: "Your logo · your colours · still our audit trail",
    description:
      "How to swap the Kapture chrome on the hosted runner for your own brand, while keeping the regulator-mapped fields and the audit hash intact.",
    audience: ["Marketing lead", "Registered manager"],
    readTime: "3 min",
    intro:
      "Co-branding turns the hosted runner into your form. Your logo, your colours, your domain — but the field schema, the validation, and the audit hash stay locked. Available on the £29/mo subscription tier and above.",
    steps: [
      {
        title: "Upload your logo",
        body: "Settings → Branding → Logo. SVG preferred (~120px wide). PNG accepted at 2x resolution.",
      },
      {
        title: "Pick your accent colour",
        body: "Settings → Branding → Accent. We swap our yellow `#FFD400` for your colour everywhere except the audit footer (which stays Kapture-branded for inspector-recognition).",
      },
      {
        title: "Custom subdomain",
        body: "Point a CNAME at `cname.kapture-forms.com`. We auto-issue the cert. Branding goes live immediately.",
        code: "careers.your-org.com  CNAME  cname.kapture-forms.com",
      },
      {
        title: "Email-from address",
        body: "Settings → Branding → Email-from. We send magic links from your domain via DKIM-aligned Resend. Five-minute setup with one TXT record.",
      },
      {
        title: "Limits",
        body: "We never let you remove the audit footer or the regulator citations. Those are the bits the inspector checks. Everything else is yours.",
      },
    ],
    faqs: [
      {
        q: "Can I white-label completely?",
        a: "Multi-site / NHS plans can. The Kapture wordmark stays in the source code (for support contact) but the visible chrome is fully yours.",
      },
      {
        q: "What about the PDF?",
        a: "Subscriptions can upload a custom PDF cover and footer. The audit footer line stays — that's the inspector-readable trail.",
      },
    ],
    related: ["hosted", "regulators"],
  },

  // ---------------------------------------------------------------- Regulators
  {
    slug: "regulators",
    format: "regulators",
    title: "Regulator mapping",
    subtitle: "Which CQC / NMC / DSPT clause every field satisfies",
    description:
      "How to read the regulator citations on each Kapture Forms field, and how to defend the pack to a CQC inspector or auditor.",
    audience: ["Compliance lead", "Registered manager", "Auditor"],
    readTime: "5 min",
    intro:
      "Every field on every Kapture pack carries a regulator citation — the specific clause the field exists to satisfy. CQC SAF, NMC Code, HCPC standards, DSPT, Care Act 2014, MCA 2005 — the pack is defensible because it's mapped to the source.",
    steps: [
      {
        title: "Read the citation tag",
        body: "On the PDF, citations sit right-aligned beside the field label. On the DOCX, they're inline after the label. On the CSV, they're in the `regulator` column. On the hosted runner, they're a yellow chip beside the field.",
      },
      {
        title: "Cross-reference the clause",
        body: "Take the citation (e.g. `Care Certificate Std 10`) into the regulator's source document. The field exists to satisfy that clause.",
      },
      {
        title: "What to show the inspector",
        body: "Print or download the schema CSV. Hand the inspector the row that matches the field they're querying. They'll see the citation and the validation rule. If they want to verify the source, point them at our marketplace listing — we link the regulator clause for every field.",
      },
      {
        title: "Updates when the regulator changes",
        body: "When CQC publishes a new SAF, our compliance team updates the schema. Your next download — PDF, DOCX, CSV, anything — carries the new fields. Submissions made before the update keep their original audit hash and pack version.",
      },
      {
        title: "Disputed fields",
        body: "If your auditor disagrees with a field's regulator mapping, email forms@thekapture.com with the citation and the auditor's note. We respond within one working day, update the schema if warranted, and credit your account.",
      },
    ],
    faqs: [
      {
        q: "What if a field has no citation?",
        a: "That field exists for operational completeness (e.g. preferred name) and isn't required by a specific regulator. Optional by design.",
      },
      {
        q: "Can I see the full mapping in advance of buying?",
        a: "Yes — the marketplace listing shows every section. Email us if you want the full schema CSV before purchase, we'll send a sample.",
      },
    ],
    related: ["audit-hash", "branding"],
  },
];

export function getGuide(slug: string): HowToGuide | undefined {
  return HOW_TO_GUIDES.find((g) => g.slug === slug);
}
