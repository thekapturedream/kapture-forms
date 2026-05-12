/**
 * Public surface for the Kapture primitives library.
 *
 * Import paths from app code:
 *   import { listPrimitives, getPrimitive } from "@lib/primitives";
 *   import { buildCsv } from "@lib/primitives/csv";
 *   import type { PrimitiveSpec, FieldInstance } from "@lib/primitives";
 *
 * The atoms.ts file is the single source of truth for the catalogue — every
 * new primitive added there lights up here automatically.
 */

export { PRIMITIVES } from "./atoms";
export {
  getPrimitive,
  findPrimitive,
  listPrimitives,
  listByCategory,
  listCategories,
  searchPrimitives,
  csvColumnCount,
} from "./registry";
export { csvHeaders, csvRow, buildCsv, serializeValue, csvEscape } from "./csv";
export type {
  PrimitiveSpec,
  PrimitiveId,
  PrimitiveCategory,
  RunnerKind,
  CsvSpec,
  ValidationSpec,
  A11ySpec,
  FieldInstance,
} from "./types";
