/**
 * Primitive registry — id → spec lookup, plus category filters.
 *
 * The dashboard form-builder UI uses this to show the field picker. The
 * runner uses this to resolve a FieldInstance.primitive → RunnerKind. The
 * AI form generator uses tag/category filters to pick the right atom for
 * a natural-language field description.
 */

import { PRIMITIVES } from "./atoms";
import type {
  PrimitiveCategory,
  PrimitiveId,
  PrimitiveSpec,
} from "./types";

const BY_ID = new Map<PrimitiveId, PrimitiveSpec>(
  PRIMITIVES.map((p) => [p.id, p]),
);

/** Resolve a primitive id to its full spec. Throws if unknown — primitive
 *  ids are part of the persisted schema, so an unknown id is a data bug,
 *  not a runtime branch. */
export function getPrimitive(id: PrimitiveId): PrimitiveSpec {
  const spec = BY_ID.get(id);
  if (!spec) {
    throw new Error(`Unknown Kapture primitive: ${id}`);
  }
  return spec;
}

/** Soft lookup — returns undefined instead of throwing. Use in places where
 *  the id comes from untrusted input (e.g. an API payload from an old
 *  client). */
export function findPrimitive(id: string): PrimitiveSpec | undefined {
  return BY_ID.get(id as PrimitiveId);
}

/** All primitives. Stable order matches atoms.ts source order. */
export function listPrimitives(): PrimitiveSpec[] {
  return PRIMITIVES;
}

/** Filter by category — feeds the builder field-picker tabs. */
export function listByCategory(category: PrimitiveCategory): PrimitiveSpec[] {
  return PRIMITIVES.filter((p) => p.category === category);
}

/** All distinct categories, in atoms-order. */
export function listCategories(): PrimitiveCategory[] {
  const seen = new Set<PrimitiveCategory>();
  const out: PrimitiveCategory[] = [];
  for (const p of PRIMITIVES) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      out.push(p.category);
    }
  }
  return out;
}

/** Tag search — used by AI form generation. Match on any tag substring. */
export function searchPrimitives(query: string): PrimitiveSpec[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRIMITIVES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

/** How many CSV columns this primitive contributes. Useful for the export
 *  layer when sizing the row buffer. */
export function csvColumnCount(id: PrimitiveId): number {
  return getPrimitive(id).csv.columns;
}
