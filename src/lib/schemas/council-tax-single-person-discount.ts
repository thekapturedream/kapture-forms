/**
 * Council tax · single person discount.
 *
 * 25% discount application for any UK council. Captures applicant
 * identity, property, who lives there, exemptions, and the
 * 'change of circumstance' declaration councils require by law.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const COUNCIL_TAX_SPD: PackSchema = toPackSchema({
  productId: "council-tax-single-person-discount",
  title: "Council tax · single person discount",
  pathways: [
    { id: "sole-occupant", name: "I live alone" },
    { id: "others-disregarded", name: "Others live here but are disregarded" },
  ],
  sections: [
    {
      id: "applicant",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("ni_number", "text-short", "National Insurance number", { required: true }),
        field("council_account", "text-short", "Council tax account number (from your bill)"),
      ],
    },
    {
      id: "property",
      name: "The property",
      fields: [
        field("property_address", "address-uk", "Property address", { required: true }),
        field("moved_in", "date", "Date you moved in", { required: true }),
        field("tenure", "select-single", "Tenure", {
          required: true,
          options: ["Owner-occupier", "Private tenant", "Council / housing association tenant", "Lodger / sub-tenant"],
        }),
        field("effective_from", "date", "Discount effective from", { required: true, help: "Usually the date you became the sole adult occupant." }),
      ],
    },
    {
      id: "who-lives",
      name: "Who lives in the property",
      fields: [
        field("occupants_summary", "text-long", "List everyone over 18 who lives here (full name + relationship)", {
          required: true,
          placeholder: "Just write 'I live alone' if no other adults are here.",
        }),
        field("disregarded", "checkbox-group", "Are any other adults disregarded for council tax?", {
          help: "Tick anything that applies to other adults in the property.",
          options: [
            "Full-time student",
            "Severely mentally impaired (with doctor's certificate)",
            "Apprentice or trainee under 25",
            "18- or 19-year-old in full-time education",
            "Live-in carer for someone who isn't a spouse / partner",
            "Member of religious community",
            "Foreign-language student / Crown servant on diplomatic privilege",
            "Detained in hospital or prison",
            "None — I am the only adult here",
          ],
        }),
        field("disregarded_evidence", "file-multi", "Upload evidence (student certificate, doctor's letter, etc.)"),
      ],
    },
    {
      id: "second-home",
      name: "Other properties",
      fields: [
        field("other_property", "select-single", "Do you own or rent another property in the UK?", {
          required: true,
          options: ["No", "Yes — I'm declaring this property as my main home"],
        }),
        field("other_property_address", "text-long", "If yes, address of the other property"),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("change_of_circumstance", "consent-gdpr", "I will inform the council within 21 days if anyone aged 18+ moves into the property.", {
          validation: { required: true },
          regulator: "Local Government Finance Act 1992",
        }),
        field("truthful", "consent-gdpr", "I declare that the information given is true and complete.", {
          validation: { required: true },
        }),
        field("fraud", "consent-gdpr", "I understand that knowingly providing false information is a criminal offence.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed under UK GDPR for assessing this application.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(e)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default COUNCIL_TAX_SPD;
