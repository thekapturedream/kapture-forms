/**
 * Simple will.
 *
 * Straightforward will instructions for England & Wales / Scotland /
 * Northern Ireland. Captures testator details, executors, beneficiaries,
 * specific gifts, residuary estate, and guardianship for minors.
 *
 * For complex estates (trusts, business assets, foreign property) buyer
 * is signposted to a solicitor in the runner.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const SIMPLE_WILL: PackSchema = toPackSchema({
  productId: "simple-will",
  title: "Simple will",
  pathways: [
    { id: "england-wales", name: "England & Wales" },
    { id: "scotland", name: "Scotland" },
    { id: "northern-ireland", name: "Northern Ireland" },
  ],
  sections: [
    {
      id: "testator",
      name: "About you (the testator)",
      fields: [
        field("full_name", "name-full", "Your full legal name", { required: true }),
        field("previous_names", "text-short", "Previously known as (if different)"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("address", "address-uk", "Current address", { required: true }),
        field("marital_status", "select-single", "Marital status", {
          required: true,
          options: ["Single", "Married", "Civil partnership", "Cohabiting", "Divorced", "Widowed"],
        }),
        field("revoke_prior", "consent-gdpr", "I revoke all previous wills and codicils.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "executors",
      name: "Executors",
      intro: "The people you appoint to carry out your wishes. Pick 1–2 primary plus 1 backup.",
      fields: [
        field("executor_1_name", "name-full", "Executor 1 · name", { required: true }),
        field("executor_1_address", "address-uk", "Executor 1 · address", { required: true }),
        field("executor_1_relationship", "text-short", "Relationship to you"),
        field("executor_2_name", "name-full", "Executor 2 · name"),
        field("executor_2_address", "address-uk", "Executor 2 · address"),
        field("executor_2_relationship", "text-short", "Relationship to you"),
        field("backup_executor_name", "name-full", "Backup executor · name"),
        field("backup_executor_address", "address-uk", "Backup executor · address"),
      ],
    },
    {
      id: "guardians",
      name: "Guardians for minor children",
      intro: "Skip if you have no children under 18.",
      fields: [
        field("has_minors", "select-single", "Do you have children under 18?", {
          required: true,
          options: ["Yes", "No"],
        }),
        field("children_names", "text-long", "Names and dates of birth of children under 18"),
        field("guardian_name", "name-full", "Guardian · name"),
        field("guardian_address", "address-uk", "Guardian · address"),
        field("guardian_relationship", "text-short", "Relationship to your children"),
        field("backup_guardian_name", "name-full", "Backup guardian · name"),
      ],
    },
    {
      id: "specific-gifts",
      name: "Specific gifts",
      intro: "Items or sums you'd like to leave to named people / charities before the residue is divided.",
      fields: [
        field("gifts_list", "text-long", "Specific gifts (one per line)", {
          placeholder:
            "e.g. £1,000 to John Smith of 1 High Street\nMy wedding ring to my daughter Sarah\n£500 to Cancer Research UK (1089464)",
          validation: { maxLength: 3000 },
        }),
      ],
    },
    {
      id: "residue",
      name: "Residuary estate",
      intro: "Everything else, after debts and specific gifts.",
      fields: [
        field("residue_to", "select-single", "I leave the residue of my estate to", {
          required: true,
          options: [
            "My spouse / civil partner only",
            "My spouse / civil partner; if they predecease me, to my children equally",
            "My children equally",
            "Named beneficiaries (specify below)",
            "Named charities (specify below)",
          ],
        }),
        field("residue_beneficiaries", "text-long", "Beneficiaries and shares", {
          placeholder:
            "e.g. 50% to my son James, 50% to my daughter Sarah\nor 100% to the British Red Cross (220949)",
        }),
        field("if_predecease", "text-long", "If a beneficiary predeceases me, their share goes to…", {
          placeholder: "e.g. their issue per stirpes, or to the surviving beneficiaries equally",
        }),
      ],
    },
    {
      id: "wishes",
      name: "Funeral wishes",
      fields: [
        field("funeral", "select-single", "Funeral preference", {
          options: ["Burial", "Cremation", "Whatever my executors decide", "Other (note below)"],
        }),
        field("funeral_notes", "text-long", "Specific funeral wishes"),
        field("organ_donation", "select-single", "Organ donation", {
          options: ["I wish to donate organs / tissues for transplantation or research", "I do not wish to donate", "Leave to next of kin"],
        }),
      ],
    },
    {
      id: "execution",
      name: "Signing",
      intro:
        "Your will must be signed in front of two witnesses, neither of whom is a beneficiary (or married to one). All three sign in each other's presence.",
      fields: [
        field("testator_signature", "signature", "Your signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
        field("witness_1_name", "name-full", "Witness 1 · name", { required: true }),
        field("witness_1_address", "address-uk", "Witness 1 · address", { required: true }),
        field("witness_1_signature", "signature", "Witness 1 · signature", { required: true }),
        field("witness_2_name", "name-full", "Witness 2 · name", { required: true }),
        field("witness_2_address", "address-uk", "Witness 2 · address", { required: true }),
        field("witness_2_signature", "signature", "Witness 2 · signature", { required: true }),
      ],
    },
  ],
});

export default SIMPLE_WILL;
