import { PackSchema } from "./types";
import STAFF_ONBOARDING_UK_CARE from "./staff-onboarding-uk-care";
import MUTUAL_NDA from "./mutual-nda";
import TENANT_REFERENCING from "./tenant-referencing";
import GDPR_DSAR from "./gdpr-dsar";
import AFFIDAVIT_GENERAL from "./affidavit-general";
import PHOTOGRAPHY_CONSENT from "./photography-consent";

/**
 * Schema registry — productId → PackSchema.
 *
 * Two authoring styles live here side-by-side:
 *   1. Hand-written PackSchema (e.g. staff-onboarding-uk-care) — flat fields,
 *      authored when the legacy schema was the only option.
 *   2. Primitive-authored schemas — authored as FieldInstance sequences and
 *      run through @lib/primitives/to-pack-schema at module load. Same
 *      PackSchema shape comes out the other side, so every exporter works.
 *
 * Add a new schema:
 *   - Drop a file in this folder
 *   - Import + register below
 *   - Make sure productId matches the product slug from getStoreProduct
 */
const SCHEMAS: Record<string, PackSchema> = {
  "staff-onboarding-uk-care": STAFF_ONBOARDING_UK_CARE,
  "mutual-nda": MUTUAL_NDA,
  "tenant-referencing": TENANT_REFERENCING,
  "gdpr-dsar-subject-access": GDPR_DSAR,
  "affidavit-general-purpose": AFFIDAVIT_GENERAL,
  "photography-media-consent": PHOTOGRAPHY_CONSENT,
};

/**
 * Lookup the field schema for a product. Returns undefined for products
 * whose schema hasn't been authored yet (Phase 2+ packs).
 */
export function getSchema(productId: string): PackSchema | undefined {
  return SCHEMAS[productId];
}

/** Schemas the dashboard / exporters know about. */
export function listSchemas(): Array<{ productId: string; title: string; fieldCount: number; sectionCount: number }> {
  return Object.values(SCHEMAS).map((s) => ({
    productId: s.productId,
    title: s.title,
    fieldCount: s.sections.reduce((n, sec) => n + sec.fields.length, 0),
    sectionCount: s.sections.length,
  }));
}

export type { PackSchema, Field, FieldType, Section } from "./types";
