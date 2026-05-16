/**
 * FOI request.
 *
 * Freedom of Information request under the FOIA 2000 (England, Wales,
 * Northern Ireland) and FOISA 2002 (Scotland). The 20-working-day
 * statutory clock starts when the authority receives a valid request.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const FOI_REQUEST: PackSchema = toPackSchema({
  productId: "foi-request",
  title: "FOI request",
  pathways: [
    { id: "england-wales-ni", name: "FOIA 2000 — England, Wales, NI" },
    { id: "scotland", name: "FOISA 2002 — Scotland" },
  ],
  sections: [
    {
      id: "requester",
      name: "Requester details",
      intro:
        "Under the Act, only your real name and an address for correspondence (postal or email) are required. Other details are optional.",
      fields: [
        field("full_name", "name-full", "Your full name", { required: true, regulator: "FOIA 2000 s.8" }),
        field("email", "email", "Email address for correspondence", { required: true }),
        field("alt_address", "text-long", "Postal address (alternative to email)"),
        field("on_behalf", "select-single", "Are you requesting on behalf of someone else?", {
          options: ["No — for myself", "Yes — journalist", "Yes — campaigner / NGO", "Yes — legal representative", "Yes — researcher"],
        }),
        field("organisation", "text-short", "Organisation (if any)"),
      ],
    },
    {
      id: "authority",
      name: "Public authority",
      fields: [
        field("authority_name", "text-short", "Name of the public authority you're asking", {
          required: true,
          placeholder: "e.g. Department for Education, Birmingham City Council, NHS Trust X",
        }),
        field("authority_email", "email", "FOI inbox of the authority (if known)"),
        field("reference", "text-short", "Previous FOI reference (if related to one)"),
      ],
    },
    {
      id: "request",
      name: "Your request",
      fields: [
        field("request_summary", "text-short", "One-line summary of what you're asking for", {
          required: true,
        }),
        field("request_body", "text-long", "Full request — be specific", {
          required: true,
          placeholder:
            "Describe exactly what information you want. Specify date ranges, departments, document types if known. Numbered points help.",
          validation: { maxLength: 5000 },
        }),
        field("date_range", "text-short", "Date range of interest", {
          placeholder: "e.g. 1 Jan 2024 – 31 Dec 2024",
        }),
        field("format_pref", "select-single", "Preferred format of response", {
          required: true,
          options: ["Email — text / PDF", "CSV / spreadsheet", "Postal — printed", "No preference"],
        }),
      ],
    },
    {
      id: "exemptions-context",
      name: "If exemptions are claimed",
      intro: "Optional context — helpful if the authority might refuse on the grounds of cost or exemption.",
      fields: [
        field("public_interest", "text-long", "Public interest argument", {
          placeholder: "Why is it in the public interest for this information to be released?",
        }),
        field("cost_consideration", "select-single", "If the request might exceed the cost limit, would you accept a narrowed version?", {
          options: ["Yes — please contact me to narrow it", "No — please refuse formally so I can request review"],
        }),
      ],
    },
    {
      id: "declaration",
      name: "Submit",
      fields: [
        field("understands_statutory", "consent-gdpr", "I understand the authority has 20 working days to respond.", {
          validation: { required: true },
          regulator: "FOIA 2000 s.10",
        }),
        field("data", "consent-gdpr", "I consent to my contact details being processed for this request.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(c)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date submitted", { required: true }),
      ],
    },
  ],
});

export default FOI_REQUEST;
