/**
 * Primitive instances → PackSchema bridge.
 *
 * The existing PDF, DOCX, HTML, CSV, and Google Forms exporters all read
 * PackSchema (lib/schemas/types.ts). Authors write forms in primitives
 * (richer, validated, CSV-aware) and this bridge translates them at build
 * time so nothing in the export pipeline has to change.
 *
 * Translation rules:
 *  - Non-compound primitive  → one Field
 *  - Compound primitive      → N Fields, one per columnSuffix
 *                              (e.g. address-uk → 5 fields)
 *  - Layout primitives       → skipped (no data column)
 *
 * Author-side ergonomics: pass a list of section blocks; each block has a
 * name, optional intro, and a sequence of "rows". A row is either a single
 * FieldInstance or a tuple of FieldInstances that share a CSS row in the
 * runner (collapses to siblings in the legacy schema).
 */

import { getPrimitive } from "./registry";
import type { FieldInstance } from "./types";
import type {
  Field,
  FieldType,
  PackSchema,
  Section,
} from "@lib/schemas/types";

export interface SectionBlock {
  id: string;
  name: string;
  intro?: string;
  fields: FieldInstance[];
}

export interface PrimitiveSchemaInput {
  productId: string;
  title: string;
  /** Pathway flows — same contract as PackSchema.pathways. Authors can leave
   *  this empty when the form has no pathway switching. */
  pathways?: PackSchema["pathways"];
  sections: SectionBlock[];
}

/** Map a primitive's legacyType to a FieldType the exporters know about.
 *  "compound" is handled by expandCompound and never reaches here. */
function legacyToFieldType(legacy: Exclude<Field["type"], never>): FieldType {
  return legacy;
}

/** Expand one FieldInstance into one or more Field rows. */
function expand(inst: FieldInstance): Field[] {
  const spec = getPrimitive(inst.primitive);

  // Layout primitives carry no data — exporters render them as headings via
  // the section intro instead, so we drop them at the schema layer.
  if (spec.csv.columns === 0 && spec.legacyType === "compound") {
    return [];
  }

  // Resolve required: shortcut on FieldInstance takes precedence, then the
  // validation override, then the primitive's default.
  const resolvedRequired =
    inst.required ??
    inst.validation?.required ??
    spec.defaultValidation.required ??
    false;

  // Non-compound — straight 1:1 map.
  if (spec.legacyType !== "compound") {
    const f: Field = {
      id: inst.instanceId,
      label: inst.label,
      type: legacyToFieldType(spec.legacyType),
    };
    if (resolvedRequired) f.required = true;
    if (inst.placeholder) f.placeholder = inst.placeholder;
    if (inst.help) f.help = inst.help;
    if (inst.options) f.options = inst.options;
    if (inst.regulator) f.regulator = inst.regulator;
    return [f];
  }

  // Compound → one Field per CSV column suffix. Each gets its own id so
  // the runner can collect values into a parent group later, but the legacy
  // exporters see flat fields.
  const out: Field[] = [];
  const suffixes = spec.csv.columnSuffixes ?? [];
  const baseLabel = inst.label;
  for (let i = 0; i < spec.csv.columns; i++) {
    const suf = suffixes[i] ?? `part-${i + 1}`;
    const childLabel = humaniseSuffix(suf);
    out.push({
      id: `${inst.instanceId}__${suf}`,
      label: `${baseLabel} · ${childLabel}`,
      type: pickCompoundChildType(inst.primitive, suf),
      required: resolvedRequired,
      regulator: inst.regulator,
    });
  }
  return out;
}

/** Map a compound child suffix to its sensible Field type. */
function pickCompoundChildType(
  primitive: FieldInstance["primitive"],
  suffix: string,
): FieldType {
  // Country dropdown gets a select; everything else stays text.
  if (suffix === "country") return "select";
  if (primitive === "tax-id-intl" && suffix === "country") return "select";
  return "text";
}

function humaniseSuffix(suf: string): string {
  switch (suf) {
    case "line1":
      return "Address line 1";
    case "line2":
      return "Address line 2";
    case "town":
      return "Town";
    case "city":
      return "City";
    case "county":
      return "County";
    case "region":
      return "Region";
    case "country":
      return "Country";
    case "postcode":
      return "Postcode";
    case "first":
      return "First name";
    case "middle":
      return "Middle name";
    case "last":
      return "Last name";
    case "id":
      return "Tax ID";
    default:
      return suf.charAt(0).toUpperCase() + suf.slice(1).replace(/-/g, " ");
  }
}

/**
 * Translate a primitive-authored schema into the legacy PackSchema shape
 * consumed by every exporter. Call this at module-import time so the schema
 * registry sees a regular PackSchema and nothing downstream changes.
 */
export function toPackSchema(input: PrimitiveSchemaInput): PackSchema {
  const sections: Section[] = input.sections.map((block) => {
    const fields: Field[] = [];
    for (const inst of block.fields) {
      fields.push(...expand(inst));
    }
    return {
      id: block.id,
      name: block.name,
      intro: block.intro,
      fields,
    };
  });

  return {
    productId: input.productId,
    title: input.title,
    pathways: input.pathways ?? [{ id: "default", name: "Standard" }],
    sections,
  };
}

/**
 * Builder shorthand — create a FieldInstance with the most common defaults.
 * Lets schema authors write tight, readable specs:
 *
 *   field("nda_full_name", "name-full", "Full legal name", { required: true })
 */
export function field(
  instanceId: string,
  primitive: FieldInstance["primitive"],
  label: string,
  opts: Partial<Omit<FieldInstance, "instanceId" | "primitive" | "label">> = {},
): FieldInstance {
  return { instanceId, primitive, label, ...opts };
}
