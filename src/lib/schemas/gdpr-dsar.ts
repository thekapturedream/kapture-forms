/**
 * GDPR · Data Subject Access Request (DSAR).
 *
 * UK GDPR Article 15 + ICO Subject Access Request code of practice. Captures
 * requester identity, scope of request, identity verification documents, and
 * controller-side decision flags. One-month statutory clock starts when the
 * controller is satisfied with the verification.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const GDPR_DSAR: PackSchema = toPackSchema({
  productId: "gdpr-dsar-subject-access",
  title: "GDPR · DSAR (subject access)",
  pathways: [
    { id: "self", name: "Request from the data subject" },
    { id: "representative", name: "Request from an authorised representative" },
    { id: "parent-guardian", name: "Parent / guardian on behalf of a minor" },
  ],
  sections: [
    {
      id: "requester",
      name: "Requester details",
      intro:
        "We use these details only to match you against our records and to send you the response. UK GDPR Article 15.",
      fields: [
        field("requester_name", "name-full", "Your full legal name", { required: true, regulator: "UK GDPR · Art. 15" }),
        field("requester_dob", "dob", "Date of birth", { required: true }),
        field("requester_email", "email", "Email", { required: true }),
        field("requester_phone", "phone-uk", "Phone (optional)"),
        field("requester_address", "address-uk", "Current postal address", { required: true }),
        field("previous_name", "text-short", "Previous name on our records (if different)"),
        field("account_ref", "text-short", "Customer / account reference (if known)", {
          help: "Speeds up matching. Leave blank if you don't have one.",
        }),
      ],
    },
    {
      id: "representative",
      name: "Representative (if applicable)",
      intro:
        "If you are submitting on someone else's behalf, fill in this section. We need a signed authority form before we can respond.",
      fields: [
        field("rep_name", "name-full", "Representative · full name"),
        field("rep_relationship", "text-short", "Relationship to the data subject"),
        field("rep_email", "email", "Representative · email"),
        field("authority_upload", "file-upload", "Upload signed authority form", {
          help: "Sign-of-authority letter or LPA. PDF or image.",
        }),
      ],
    },
    {
      id: "scope",
      name: "Scope of the request",
      intro:
        "Telling us what to look for narrows the search and gets your response back faster. Article 15 still entitles you to a copy of all your personal data — this section just helps us prioritise.",
      fields: [
        field("scope_types", "checkbox-group", "Types of data requested", {
          required: true,
          options: [
            "All personal data we hold",
            "Account / contact records",
            "Marketing communications history",
            "Transaction / billing records",
            "Customer service interactions (call logs, chats, emails)",
            "Cookies / web tracking data",
            "Recordings (CCTV, audio, video)",
            "Profiling / automated decision outputs",
          ],
        }),
        field("date_range", "text-short", "Date range of interest", {
          placeholder: "e.g. last 24 months, or specific dates",
        }),
        field("departments", "text-long", "Specific teams / departments", {
          placeholder: "e.g. complaints handling, fraud team",
        }),
        field("format_pref", "select-single", "Preferred response format", {
          required: true,
          options: ["Secure download (default)", "Encrypted PDF email", "Postal copy (printed)"],
        }),
      ],
    },
    {
      id: "identity",
      name: "Identity verification",
      intro:
        "ICO guidance: a controller may ask for proof of identity before responding. Upload one photo ID and one proof of address. Both must show the name and address you've given above.",
      fields: [
        field("id_type", "select-single", "Photo ID type", {
          required: true,
          options: ["UK passport", "UK driving licence", "EEA passport", "BRP", "Other"],
        }),
        field("id_upload", "file-upload", "Upload photo ID", { required: true }),
        field("poa_type", "select-single", "Proof of address type", {
          required: true,
          options: [
            "Utility bill (last 3 months)",
            "Council tax letter (current year)",
            "Bank statement (last 3 months)",
            "HMRC letter (last 6 months)",
          ],
        }),
        field("poa_upload", "file-upload", "Upload proof of address", { required: true }),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("declaration_truthful", "consent-gdpr", "I confirm the information above is correct and that I am entitled to make this request.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 15",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default GDPR_DSAR;
