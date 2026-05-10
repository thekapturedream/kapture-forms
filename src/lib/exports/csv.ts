import { PackSchema } from "../schemas/types";

/**
 * Two CSV exports:
 *
 *   buildSchemaCsv  — one row per field, columns describing the form
 *                     (used by HRIS imports + custom build pipelines)
 *
 *   buildSubmissionsCsv — one row per submission (Phase 2; placeholder
 *                         signature so the API surface is stable).
 *
 * Both return raw CSV text. Stream with `Content-Type: text/csv`.
 */

const HEADERS = [
  "section_id",
  "section_name",
  "field_id",
  "field_label",
  "field_type",
  "required",
  "options",
  "pathways",
  "regulator",
  "help",
] as const;

export function buildSchemaCsv(schema: PackSchema): string {
  const rows: string[] = [];
  rows.push(HEADERS.join(","));
  for (const section of schema.sections) {
    for (const field of section.fields) {
      rows.push(
        [
          section.id,
          section.name,
          field.id,
          field.label,
          field.type,
          field.required ? "true" : "false",
          (field.options ?? []).join(" | "),
          (field.pathways ?? []).join(" | "),
          field.regulator ?? "",
          field.help ?? "",
        ]
          .map(csvCell)
          .join(",")
      );
    }
  }
  return rows.join("\n") + "\n";
}

/**
 * Submission row CSV. `submissions` is whatever the API hands us — an array
 * of Supabase rows or seeded mock data. Each row's `payload` JSON is
 * spread out into one column per field key.
 */
export function buildSubmissionsCsv(
  schema: PackSchema,
  submissions: Array<{ id: string; submitted_at: string; pathway_id?: string | null; audit_hash: string; payload: Record<string, unknown> }>
): string {
  const fieldIds: string[] = [];
  for (const s of schema.sections) for (const f of s.fields) fieldIds.push(f.id);
  const headers = ["submission_id", "submitted_at", "pathway", "audit_hash", ...fieldIds];
  const rows = [headers.join(",")];
  for (const sub of submissions) {
    const payload = sub.payload ?? {};
    rows.push(
      [
        sub.id,
        sub.submitted_at,
        sub.pathway_id ?? "",
        sub.audit_hash,
        ...fieldIds.map((id) => (payload[id] == null ? "" : String(payload[id]))),
      ]
        .map(csvCell)
        .join(",")
    );
  }
  return rows.join("\n") + "\n";
}

function csvCell(value: string | number | boolean): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
