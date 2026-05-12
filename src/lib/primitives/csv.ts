/**
 * Primitive → CSV serialisation.
 *
 * Every form has a matching CSV mirror. Headers come from FieldInstance.label
 * (one header per CSV column the primitive contributes). Values come through
 * this module — each primitive may declare a `transform` that converts the
 * runner-side value to its canonical CSV form.
 *
 * Why a separate module: the runner stores rich values (Date objects,
 * structured address records, signature data URLs). The CSV mirror must be
 * flat text. Centralising the conversion here keeps the runner free of
 * export concerns and gives us one place to evolve the format.
 */

import { getPrimitive } from "./registry";
import type { FieldInstance } from "./types";

/** Escape a string for RFC-4180 CSV — quote-wrap if it contains delimiters. */
export function csvEscape(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  const s = String(raw);
  if (s.includes(",") || s.includes("\"") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build the CSV header row for a sequence of field instances. Compound
 * primitives expand into multiple columns using their `columnSuffixes`.
 */
export function csvHeaders(fields: FieldInstance[]): string[] {
  const out: string[] = [];
  for (const f of fields) {
    const spec = getPrimitive(f.primitive);
    if (spec.csv.columns === 0) continue;
    if (spec.csv.columns === 1) {
      out.push(f.label);
      continue;
    }
    const suffixes = spec.csv.columnSuffixes ?? [];
    for (let i = 0; i < spec.csv.columns; i++) {
      const suf = suffixes[i] ?? `col${i + 1}`;
      out.push(`${f.label} · ${suf}`);
    }
  }
  return out;
}

/**
 * Serialise one submitted value according to a primitive's transform.
 * The runner value shape per primitive is documented in the runner code;
 * this function handles the common cases and falls back to String() for the
 * rest. Unknown / null becomes empty string.
 */
export function serializeValue(
  primitiveId: FieldInstance["primitive"],
  raw: unknown,
): string | string[] {
  const spec = getPrimitive(primitiveId);
  if (raw === null || raw === undefined) {
    return spec.csv.columns > 1 ? new Array(spec.csv.columns).fill("") : "";
  }

  // Compound — value is an array or object that maps 1:1 to the suffixes.
  if (spec.csv.columns > 1) {
    if (Array.isArray(raw)) {
      const out = new Array(spec.csv.columns).fill("");
      for (let i = 0; i < spec.csv.columns; i++) {
        out[i] = raw[i] === undefined || raw[i] === null ? "" : String(raw[i]);
      }
      return out;
    }
    if (typeof raw === "object" && spec.csv.columnSuffixes) {
      const r = raw as Record<string, unknown>;
      return spec.csv.columnSuffixes.map((k) =>
        r[k] === undefined || r[k] === null ? "" : String(r[k]),
      );
    }
    return new Array(spec.csv.columns).fill("");
  }

  // Single column with a transform.
  switch (spec.csv.transform) {
    case "iso-date":
      return raw instanceof Date
        ? raw.toISOString().slice(0, 10)
        : String(raw);
    case "phone-e164":
      // Strip spaces, plus only, digits — leave the runner-side
      // libphonenumber-style normalisation as a future upgrade.
      return String(raw).replace(/[^0-9+]/g, "");
    case "money-pence":
      if (typeof raw === "number") return (Math.round(raw * 100) / 100).toFixed(2);
      return String(raw);
    case "trim":
      return String(raw).trim();
    case "boolean-yn":
      if (typeof raw === "boolean") return raw ? "Y" : "N";
      if (typeof raw === "string") return /^(y|yes|true|1)$/i.test(raw) ? "Y" : "N";
      return raw ? "Y" : "N";
    default:
      return String(raw);
  }
}

/**
 * Render one submission as a single CSV row. Field order must match the
 * order used by csvHeaders() — pass the same `fields` array.
 */
export function csvRow(
  fields: FieldInstance[],
  values: Record<string, unknown>,
): string {
  const cells: string[] = [];
  for (const f of fields) {
    const spec = getPrimitive(f.primitive);
    if (spec.csv.columns === 0) continue;
    const v = values[f.instanceId];
    const serialised = serializeValue(f.primitive, v);
    if (Array.isArray(serialised)) {
      for (const c of serialised) cells.push(csvEscape(c));
    } else {
      cells.push(csvEscape(serialised));
    }
  }
  return cells.join(",");
}

/**
 * Build a full CSV document — header row + N submission rows.
 * Use `\r\n` line endings per RFC-4180 so Excel on Windows treats it cleanly.
 */
export function buildCsv(
  fields: FieldInstance[],
  submissions: Array<Record<string, unknown>>,
): string {
  const lines = [csvHeaders(fields).map(csvEscape).join(",")];
  for (const s of submissions) {
    lines.push(csvRow(fields, s));
  }
  return lines.join("\r\n") + "\r\n";
}
