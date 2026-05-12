/**
 * Affidavit · general purpose.
 *
 * Sworn statement of facts. England & Wales / Scotland / Northern Ireland
 * variants — pathway switches the jurisdictional language printed in the
 * exported PDF. Requires sworn-before-a-commissioner-of-oaths section
 * which the runner leaves blank for in-person completion.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const AFFIDAVIT_GENERAL: PackSchema = toPackSchema({
  productId: "affidavit-general-purpose",
  title: "Affidavit · general purpose",
  pathways: [
    { id: "england-wales", name: "England & Wales" },
    { id: "scotland", name: "Scotland" },
    { id: "northern-ireland", name: "Northern Ireland" },
  ],
  sections: [
    {
      id: "deponent",
      name: "Deponent details",
      intro:
        "The deponent is the person making the sworn statement. Identity must match the document presented to the commissioner of oaths.",
      fields: [
        field("deponent_name", "name-full", "Full legal name of deponent", { required: true }),
        field("deponent_dob", "dob", "Date of birth", { required: true }),
        field("deponent_occupation", "text-short", "Occupation"),
        field("deponent_address", "address-uk", "Current postal address", { required: true }),
        field("deponent_id_type", "select-single", "Photo ID presented", {
          required: true,
          options: ["UK passport", "UK driving licence", "EEA passport", "BRP", "Other"],
        }),
        field("deponent_id_number", "text-short", "ID document number", { required: true }),
      ],
    },
    {
      id: "matter",
      name: "Matter & jurisdiction",
      fields: [
        field("matter_reference", "text-short", "Matter / case reference (if any)"),
        field("court_or_authority", "text-short", "Court / authority this affidavit is for", {
          placeholder: "e.g. Family Court, HM Land Registry, embassy",
        }),
        field("purpose", "text-long", "Purpose of this affidavit", {
          required: true,
          placeholder: "Briefly state why this sworn statement is being made.",
        }),
      ],
    },
    {
      id: "statement",
      name: "Sworn statement of facts",
      intro:
        "State the facts in numbered paragraphs. Speak only to facts within your direct knowledge — hearsay must be flagged. Add supporting documents as exhibits.",
      fields: [
        field("statement_body", "text-long", "Statement", {
          required: true,
          placeholder:
            "1. I, [name], make this affidavit in support of …\n2. I have direct knowledge of the matters stated below …\n3. …",
          validation: { maxLength: 8000 },
        }),
        field("exhibits", "file-multi", "Exhibits (attach supporting documents)"),
        field("hearsay_flag", "consent-gdpr", "I have flagged any statements based on hearsay rather than direct knowledge.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "oath",
      name: "Oath / affirmation",
      intro:
        "Choose the form that matches your religious or non-religious preference. The commissioner of oaths reads this back to you before signing.",
      fields: [
        field("oath_type", "select-single", "Oath or affirmation", {
          required: true,
          options: ["Oath (sworn on holy book)", "Affirmation (non-religious)"],
        }),
        field("declaration", "consent-gdpr", "I solemnly declare that the contents of this affidavit are true to the best of my knowledge and belief, and that no material fact has been omitted.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "execution",
      name: "Execution before commissioner",
      intro:
        "These sections are completed in person before a solicitor / commissioner of oaths / notary public.",
      fields: [
        field("deponent_signature", "signature", "Deponent signature", { required: true }),
        field("deponent_sign_date", "date", "Date sworn", { required: true }),
        field("commissioner_name", "name-full", "Commissioner of oaths · name", { required: true }),
        field("commissioner_role", "select-single", "Commissioner role", {
          required: true,
          options: ["Solicitor", "Commissioner for oaths", "Notary public", "Justice of the peace"],
        }),
        field("commissioner_address", "address-uk", "Commissioner address", { required: true }),
        field("commissioner_signature", "signature", "Commissioner signature", { required: true }),
      ],
    },
  ],
});

export default AFFIDAVIT_GENERAL;
