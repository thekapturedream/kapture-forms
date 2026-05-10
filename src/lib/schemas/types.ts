/**
 * Kapture Forms · pack schema types.
 *
 * Every form pack defines its data model with these types. The PDF, DOCX,
 * HTML, CSV, and Google Forms exporters all read from this schema — so a
 * field added once propagates to every format. The hosted runner uses the
 * same schema to render the live form.
 */

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "number"
  | "select"
  | "multi-select"
  | "checkbox"
  | "textarea"
  | "signature";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Placeholder / hint for hosted runner */
  placeholder?: string;
  /** Helper text shown below the field */
  help?: string;
  /** For select / multi-select. */
  options?: string[];
  /**
   * Pathways for which this field is rendered. Omit for "applies to all".
   * Matches Pathway.id from products.ts.
   */
  pathways?: string[];
  /** Regulator citation, e.g. "CQC SAF KLOE S5" — printed in the audit footer. */
  regulator?: string;
}

export interface Section {
  id: string;
  name: string;
  /** Optional intro paragraph rendered above the fields. */
  intro?: string;
  fields: Field[];
}

export interface PackSchema {
  productId: string;
  title: string;
  /**
   * One or more pathway IDs. The hosted runner uses these to switch
   * conditional fields. PDF / DOCX / HTML render every field with a
   * "(applies to: …)" tag.
   */
  pathways: { id: string; name: string }[];
  sections: Section[];
}
