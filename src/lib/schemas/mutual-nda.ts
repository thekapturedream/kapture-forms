/**
 * Mutual NDA — both parties accept reciprocal confidentiality obligations.
 *
 * Authored on primitives. The bridge in @lib/primitives/to-pack-schema
 * translates it into the legacy PackSchema the exporters consume, so this
 * file ships PDF / DOCX / HTML / CSV / Google Forms with no extra work.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const MUTUAL_NDA: PackSchema = toPackSchema({
  productId: "mutual-nda",
  title: "Mutual NDA",
  pathways: [
    { id: "individual", name: "Individual to individual" },
    { id: "company-to-company", name: "Company to company" },
  ],
  sections: [
    {
      id: "parties",
      name: "Parties",
      intro:
        "Both parties below take on identical confidentiality obligations. Fill in for each side.",
      fields: [
        field("party_a_name", "name-full", "Party A · full legal name", { required: true }),
        field("party_a_company", "text-short", "Party A · company (if any)", {
          help: "Leave blank if signing as an individual.",
        }),
        field("party_a_email", "email", "Party A · email", { required: true }),
        field("party_a_address", "address-uk", "Party A · address", { required: true }),
        field("party_b_name", "name-full", "Party B · full legal name", { required: true }),
        field("party_b_company", "text-short", "Party B · company (if any)"),
        field("party_b_email", "email", "Party B · email", { required: true }),
        field("party_b_address", "address-uk", "Party B · address", { required: true }),
      ],
    },
    {
      id: "scope",
      name: "Scope & purpose",
      intro:
        "Describe the engagement these confidentiality obligations cover. Be specific — courts read narrow NDAs as binding and broad ones as fishing.",
      fields: [
        field("purpose", "text-long", "Purpose of disclosure", {
          placeholder: "e.g. Evaluating a potential commercial partnership for a software product.",
          required: true,
        }),
        field("effective_date", "date", "Effective date", { required: true }),
        field("term_months", "number", "Term · months", {
          help: "How long the obligations stay in force after the effective date. 24 months is typical.",
          required: true,
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
      name: "Exclusions",
      intro:
        "Standard carve-outs that protect both parties from over-reach. Tick the ones that apply.",
      fields: [
        field("excl_public", "consent-gdpr", "Information already in the public domain is excluded.", {
          validation: { required: true },
        }),
        field("excl_independent", "consent-gdpr", "Information independently developed without reference to disclosed material is excluded.", {
          validation: { required: true },
        }),
        field("excl_required_by_law", "consent-gdpr", "Disclosure compelled by law or regulator is permitted (with notice where lawful).", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "execution",
      name: "Execution",
      intro:
        "Both parties sign below. The runner stores a SHA-256 hash of every signed submission.",
      fields: [
        field("party_a_sig", "signature", "Party A · signature", { required: true }),
        field("party_a_sig_date", "date", "Party A · date signed", { required: true }),
        field("party_b_sig", "signature", "Party B · signature", { required: true }),
        field("party_b_sig_date", "date", "Party B · date signed", { required: true }),
      ],
    },
  ],
});

export default MUTUAL_NDA;
