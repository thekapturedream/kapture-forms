import { PackSchema } from "./types";
import STAFF_ONBOARDING_UK_CARE from "./staff-onboarding-uk-care";

const SCHEMAS: Record<string, PackSchema> = {
  "staff-onboarding-uk-care": STAFF_ONBOARDING_UK_CARE,
};

/**
 * Lookup the field schema for a product. Returns undefined for products
 * whose schema hasn't been authored yet (Phase 2+ packs).
 */
export function getSchema(productId: string): PackSchema | undefined {
  return SCHEMAS[productId];
}

export type { PackSchema, Field, FieldType, Section } from "./types";
