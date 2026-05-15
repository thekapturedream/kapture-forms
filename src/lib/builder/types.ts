/**
 * Builder fulfillment types — shared between the /api/builder/checkout
 * route, the Stripe webhook fulfillment function, and the builder dialog.
 */

import type { PackSchema } from "@lib/schemas/types";

/** Individual file formats the builder can render. */
export type SingleBuilderFormat = "pdf" | "docx" | "html" | "csv" | "gforms";

/** All formats the builder API accepts — 'all' is the 5-pack bundle. */
export type BuilderFormat = SingleBuilderFormat | "all";

/** The 5 single-file formats in delivery order — used when rendering a bundle. */
export const SINGLE_FORMATS: SingleBuilderFormat[] = [
  "pdf",
  "docx",
  "html",
  "csv",
  "gforms",
];

export const BUILDER_FORMATS: Array<{
  id: SingleBuilderFormat;
  label: string;
  blurb: string;
  extension: string;
  mime: string;
}> = [
  {
    id: "pdf",
    label: "Print-ready PDF",
    blurb: "A4 cover page, signature block, audit footer. Print or e-sign.",
    extension: "pdf",
    mime: "application/pdf",
  },
  {
    id: "docx",
    label: "Editable Word .docx",
    blurb: "Track-changes ready. Open in Word, Google Docs, or Pages.",
    extension: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  {
    id: "html",
    label: "Embeddable HTML",
    blurb: "Drop into your site. Submits to a Kapture endpoint.",
    extension: "html",
    mime: "text/html",
  },
  {
    id: "csv",
    label: "CSV schema",
    blurb: "One row per field. Import into Bamboo, Breathe, Workday.",
    extension: "csv",
    mime: "text/csv",
  },
  {
    id: "gforms",
    label: "Google Forms spec",
    blurb: "JSON + Apps Script. Paste into Google Forms, run, done.",
    extension: "json",
    mime: "application/json",
  },
];

/** Per-format fee — £2. */
export const BUILDER_FEE_PENCE = 200;
/** 5-format bundle — £8 (save £2 vs. 5×£2). */
export const BUILDER_BUNDLE_PENCE = 800;

export function priceForFormat(format: BuilderFormat): number {
  return format === "all" ? BUILDER_BUNDLE_PENCE : BUILDER_FEE_PENCE;
}

export interface BuilderCheckoutBody {
  email: string;
  format: BuilderFormat;
  title?: string;
  schema: PackSchema;
}

export interface BuilderRegenerateBody {
  orderId: string;
  format: BuilderFormat;
}
