/**
 * Power of attorney · LPA finance.
 *
 * Drafting form for an England & Wales Lasting Power of Attorney for
 * Property & Financial Affairs. Captures donor, attorneys, replacement
 * attorneys, decisions, restrictions, and certificate provider. The
 * exported PDF mirrors the OPG LP1F structure.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const LPA_FINANCE: PackSchema = toPackSchema({
  productId: "power-of-attorney-lpa-finance",
  title: "Power of attorney · LPA finance",
  pathways: [
    { id: "single-attorney", name: "Single attorney" },
    { id: "joint", name: "Joint attorneys (must agree on everything)" },
    { id: "joint-and-several", name: "Jointly and severally (can act alone or together)" },
  ],
  sections: [
    {
      id: "donor",
      name: "About you (the donor)",
      intro: "You're the person granting authority. You must have mental capacity at the time of signing.",
      fields: [
        field("full_name", "name-full", "Your full legal name", { required: true, regulator: "OPG" }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("address", "address-uk", "Current address", { required: true }),
        field("phone", "phone-uk", "Phone"),
        field("email", "email", "Email"),
      ],
    },
    {
      id: "attorneys",
      name: "Attorneys",
      intro: "The people you trust to make decisions about your finances. You can name up to 4.",
      fields: [
        field("attorney_1_name", "name-full", "Attorney 1 · name", { required: true }),
        field("attorney_1_dob", "dob", "Attorney 1 · date of birth", { required: true }),
        field("attorney_1_address", "address-uk", "Attorney 1 · address", { required: true }),
        field("attorney_1_relationship", "text-short", "Relationship to you", { required: true }),
        field("attorney_2_name", "name-full", "Attorney 2 · name"),
        field("attorney_2_dob", "dob", "Attorney 2 · date of birth"),
        field("attorney_2_address", "address-uk", "Attorney 2 · address"),
        field("attorney_2_relationship", "text-short", "Relationship to you"),
        field("attorney_3_name", "name-full", "Attorney 3 · name"),
        field("attorney_3_address", "address-uk", "Attorney 3 · address"),
        field("attorney_4_name", "name-full", "Attorney 4 · name"),
        field("attorney_4_address", "address-uk", "Attorney 4 · address"),
      ],
    },
    {
      id: "replacement",
      name: "Replacement attorneys",
      intro: "Optional — people to step in if any of your original attorneys can't act.",
      fields: [
        field("replacement_1_name", "name-full", "Replacement 1 · name"),
        field("replacement_1_address", "address-uk", "Replacement 1 · address"),
        field("replacement_2_name", "name-full", "Replacement 2 · name"),
        field("replacement_2_address", "address-uk", "Replacement 2 · address"),
      ],
    },
    {
      id: "when",
      name: "When the LPA can be used",
      fields: [
        field("when_use", "select-single", "When should your attorneys be able to act?", {
          required: true,
          options: [
            "As soon as the LPA is registered, with my permission",
            "Only when I don't have mental capacity to make a decision",
          ],
        }),
      ],
    },
    {
      id: "preferences",
      name: "Preferences & instructions",
      intro:
        "Preferences are guidance your attorneys should consider. Instructions are rules they must follow.",
      fields: [
        field("preferences", "text-long", "Preferences (guidance)", {
          placeholder: "e.g. 'I would prefer my attorneys to invest only in ESG-aligned funds.'",
        }),
        field("instructions", "text-long", "Instructions (rules)", {
          placeholder: "e.g. 'My attorneys must consult my brother before selling any property.'",
        }),
      ],
    },
    {
      id: "people-notified",
      name: "People to be notified",
      intro: "Optional. The OPG notifies these people when the LPA is registered, so they can object if concerned.",
      fields: [
        field("notify_1_name", "name-full", "Person 1 · name"),
        field("notify_1_address", "address-uk", "Person 1 · address"),
        field("notify_2_name", "name-full", "Person 2 · name"),
        field("notify_2_address", "address-uk", "Person 2 · address"),
      ],
    },
    {
      id: "certificate-provider",
      name: "Certificate provider",
      intro:
        "Independent person confirming you understand the LPA and aren't under pressure. Must be 18+, not a family member or attorney.",
      fields: [
        field("cp_name", "name-full", "Certificate provider · name", { required: true }),
        field("cp_address", "address-uk", "Certificate provider · address", { required: true }),
        field("cp_role", "select-single", "Certificate provider type", {
          required: true,
          options: [
            "Someone who has known you personally for 2+ years",
            "A professional (solicitor, GP, social worker, etc.)",
          ],
        }),
        field("cp_profession", "text-short", "Profession (if applicable)"),
      ],
    },
    {
      id: "sign",
      name: "Signatures",
      intro: "Sign in the order required by the LPA: you, certificate provider, then each attorney.",
      fields: [
        field("donor_signature", "signature", "Donor signature", { required: true }),
        field("donor_sig_date", "date", "Donor date", { required: true }),
        field("cp_signature", "signature", "Certificate provider signature", { required: true }),
        field("cp_sig_date", "date", "Certificate provider date", { required: true }),
        field("attorney_1_signature", "signature", "Attorney 1 signature", { required: true }),
        field("attorney_1_sig_date", "date", "Attorney 1 date", { required: true }),
      ],
    },
  ],
});

export default LPA_FINANCE;
