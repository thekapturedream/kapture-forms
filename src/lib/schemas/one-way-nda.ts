/**
 * One-way NDA.
 *
 * Disclosing party shares confidential info; receiving party agrees not
 * to disclose. Common for hiring, vendor pitches, investor talks where
 * only one side has secrets to protect.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const ONE_WAY_NDA: PackSchema = toPackSchema({
  productId: "one-way-nda",
  title: "One-way NDA",
  pathways: [
    { id: "individual", name: "Individual receiving" },
    { id: "company", name: "Company receiving" },
  ],
  sections: [
    {
      id: "parties",
      name: "Parties",
      intro: "The disclosing party shares confidential information; the receiving party agrees to keep it confidential.",
      fields: [
        field("discloser_name", "name-full", "Disclosing party · name", { required: true }),
        field("discloser_company", "text-short", "Disclosing party · company"),
        field("discloser_email", "email", "Disclosing party · email", { required: true }),
        field("discloser_address", "address-uk", "Disclosing party · address", { required: true }),
        field("receiver_name", "name-full", "Receiving party · name", { required: true }),
        field("receiver_company", "text-short", "Receiving party · company"),
        field("receiver_email", "email", "Receiving party · email", { required: true }),
        field("receiver_address", "address-uk", "Receiving party · address", { required: true }),
      ],
    },
    {
      id: "scope",
      name: "Scope & term",
      fields: [
        field("purpose", "text-long", "Purpose of disclosure", {
          required: true,
          placeholder: "e.g. Evaluating a potential commercial partnership.",
        }),
        field("effective_date", "date", "Effective date", { required: true }),
        field("term_months", "number", "Confidentiality term · months", {
          required: true,
          help: "How long the receiving party must keep the information confidential. 24 months is typical.",
          validation: { min: 1, max: 120 },
        }),
        field("governing_law", "select-single", "Governing law", {
          required: true,
          options: ["England & Wales", "Scotland", "Northern Ireland"],
        }),
      ],
    },
    {
      id: "exclusions",
      name: "Standard carve-outs",
      fields: [
        field("excl_public", "consent-gdpr", "Information already public is not confidential.", {
          validation: { required: true },
        }),
        field("excl_known", "consent-gdpr", "Information already known to the receiving party (with evidence) is not confidential.", {
          validation: { required: true },
        }),
        field("excl_required", "consent-gdpr", "Disclosure compelled by law is permitted (with notice where lawful).", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "execution",
      name: "Execution",
      fields: [
        field("receiver_sig", "signature", "Receiving party · signature", { required: true }),
        field("receiver_sig_date", "date", "Date signed", { required: true }),
        field("discloser_sig", "signature", "Disclosing party · signature", { required: true }),
        field("discloser_sig_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default ONE_WAY_NDA;
