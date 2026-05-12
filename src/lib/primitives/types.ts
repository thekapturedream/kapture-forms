/**
 * Kapture Forms · Primitive type system.
 *
 * Primitives are the atoms of every form in the catalogue. The catalogue
 * scales to millions of forms by composing primitives → compounds → templates,
 * not by hand-authoring each form. Every primitive ships with:
 *   - a stable id used by exporters, the runner, and the CSV serialiser
 *   - an input category for the dashboard form-builder UI
 *   - validation rules (required, min/max, pattern)
 *   - CSV serialisation (how this field becomes one or more columns)
 *   - a runner kind that tells the React renderer what to draw
 *   - an accessibility contract (label, aria, autocomplete token)
 *
 * Bridging note: the older Field/FieldType system in /lib/schemas remains
 * the authoritative format for current packs. PrimitiveSpec.legacyType lets
 * us translate a Primitive into a FieldType for the existing exporters.
 */

import type { FieldType } from "@lib/schemas/types";

/** Broad input category — used to group primitives in the builder UI. */
export type PrimitiveCategory =
  | "identity" // names, emails, phones, addresses
  | "datetime" // date, time, dob
  | "choice" // select, radio, checkbox, rating
  | "text" // single line, long form, password
  | "numeric" // currency, percent, slider, plain number
  | "media" // file upload, image upload, signature
  | "payment" // card, IBAN, tax id
  | "legal" // NDA accept, consent, terms
  | "layout" // heading, helper, divider, repeater
  | "advanced"; // postcode lookup, conditional reveal, URL

/** Tells the runner React renderer what to draw. */
export type RunnerKind =
  | "input.text"
  | "input.email"
  | "input.tel"
  | "input.url"
  | "input.password"
  | "input.number"
  | "input.currency"
  | "input.percent"
  | "input.date"
  | "input.time"
  | "input.datetime"
  | "input.slider"
  | "textarea"
  | "select.single"
  | "select.multi"
  | "select.radio"
  | "select.checkbox"
  | "select.stars"
  | "select.numeric-rating"
  | "compound.name-parts"
  | "compound.address-uk"
  | "compound.address-intl"
  | "compound.payment-card"
  | "compound.payment-iban"
  | "compound.tax-id"
  | "compound.postcode-lookup"
  | "compound.repeater"
  | "compound.password-confirm"
  | "compound.consent"
  | "upload.file"
  | "upload.file-multi"
  | "upload.image"
  | "draw.signature"
  | "layout.heading"
  | "layout.helper"
  | "layout.divider"
  | "logic.conditional-reveal";

/** CSV serialisation hint. Most primitives become one column; compounds may
 * spread into several (e.g. address-uk → line1, line2, city, postcode). */
export interface CsvSpec {
  /** Number of CSV columns this primitive contributes. */
  columns: number;
  /** Suffixes appended to the field label for each column, e.g.
   *  ["line1", "line2", "city", "postcode"] for a UK address. */
  columnSuffixes?: string[];
  /** Optional transformer name applied at serialise time. */
  transform?: "iso-date" | "phone-e164" | "money-pence" | "trim" | "boolean-yn";
}

/** Validation contract — keep it declarative so the same rules drive the
 *  runner, the PDF exporter, and the CSV import path. */
export interface ValidationSpec {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; // regex source, no flags
  /** Built-in named validators run by the runner. */
  named?: Array<
    | "email"
    | "url"
    | "uk-postcode"
    | "intl-phone"
    | "iban"
    | "vat-uk"
    | "ni-number"
    | "future-date"
    | "past-date"
    | "min-18"
  >;
}

/** Accessibility contract. autocomplete is the HTML autocomplete token. */
export interface A11ySpec {
  autocomplete?: string;
  inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search";
  /** When true, the renderer adds aria-describedby pointing to the helper. */
  hasHelper?: boolean;
}

/**
 * The full spec for a single primitive. 40 of these live in atoms.ts.
 * Adding a new primitive = appending one entry + bumping the type union.
 */
export interface PrimitiveSpec {
  id: PrimitiveId;
  label: string;
  category: PrimitiveCategory;
  /** One-line description shown in the field picker. */
  summary: string;
  runner: RunnerKind;
  csv: CsvSpec;
  defaultValidation: ValidationSpec;
  a11y: A11ySpec;
  /** Map to the legacy FieldType so existing PDF/DOCX/HTML exporters work
   *  without changes. Compound primitives that don't map cleanly use
   *  "compound" — exporters fall back to a generic renderer. */
  legacyType: FieldType | "compound";
  /** Tags used by AI form generation + search-driven discovery. */
  tags: string[];
}

/** The full id union — keep in sync with atoms.ts. */
export type PrimitiveId =
  // identity
  | "name-full"
  | "name-parts"
  | "email"
  | "phone-uk"
  | "phone-intl"
  | "address-uk"
  | "address-intl"
  | "postcode-lookup"
  // datetime
  | "date"
  | "time"
  | "datetime"
  | "dob"
  // choice
  | "select-single"
  | "select-multi"
  | "radio"
  | "checkbox-group"
  | "rating-stars"
  | "rating-numeric"
  // text
  | "text-short"
  | "text-long"
  | "password-confirm"
  | "url"
  // numeric
  | "number"
  | "currency"
  | "percent"
  | "slider"
  // media
  | "file-upload"
  | "file-multi"
  | "image-upload"
  | "signature"
  // payment
  | "payment-card"
  | "payment-iban"
  | "tax-id-uk"
  | "tax-id-intl"
  // legal
  | "nda-accept"
  | "consent-gdpr"
  | "consent-marketing"
  // layout
  | "heading"
  | "helper-text"
  | "divider"
  | "repeater"
  // advanced
  | "conditional-reveal";

/** An instance of a primitive in a form — what gets persisted in the schema. */
export interface FieldInstance {
  /** Stable instance id (uuid) for editing & analytics. */
  instanceId: string;
  /** Which primitive this instance is. */
  primitive: PrimitiveId;
  /** Author-supplied label that replaces the primitive's default. */
  label: string;
  /** Author-supplied helper text. */
  help?: string;
  /** Author-supplied placeholder. */
  placeholder?: string;
  /**
   * Author-friendly shortcut for `validation.required`. The bridge merges this
   * into the resolved validation spec so authors don't have to reach into the
   * nested object for the most common override.
   */
  required?: boolean;
  /** Author-supplied validation overrides. */
  validation?: Partial<ValidationSpec>;
  /** Author-supplied options (select / radio / checkbox). */
  options?: string[];
  /** Conditional reveal — show this field only when another field equals X. */
  showWhen?: { fieldInstanceId: string; equals: string };
  /** Regulator citation — printed in audit footer. */
  regulator?: string;
}
