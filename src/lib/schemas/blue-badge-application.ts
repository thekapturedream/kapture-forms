/**
 * Blue badge application.
 *
 * Disabled person's parking badge — England, Wales, Scotland, NI.
 * Captures eligibility under the automatic + assessed categories,
 * supporting evidence, and the photo + signature for the badge itself.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const BLUE_BADGE: PackSchema = toPackSchema({
  productId: "blue-badge-application",
  title: "Blue badge application",
  pathways: [
    { id: "automatic", name: "Eligible without assessment (automatic)" },
    { id: "assessed", name: "Eligibility needs to be assessed" },
    { id: "child-under-3", name: "Child under 3 (bulky equipment)" },
    { id: "renewal", name: "Renewal of existing badge" },
  ],
  sections: [
    {
      id: "applicant",
      name: "Applicant details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("ni_number", "text-short", "National Insurance number"),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Home address", { required: true }),
        field("time_at_address", "select-single", "Time at this address", {
          required: true,
          options: ["Under 6 months", "6–12 months", "1–3 years", "3+ years"],
        }),
      ],
    },
    {
      id: "automatic-eligibility",
      name: "Automatic eligibility",
      intro: "Tick whichever applies. Upload the supporting letter / decision.",
      fields: [
        field("auto_pip_mobility", "select-single", "PIP — 8 or more points in 'moving around'", {
          options: ["Yes", "No"],
          regulator: "DfT",
        }),
        field("auto_pip_planning", "select-single", "PIP — 10 points in 'planning and following a journey' descriptor E", {
          options: ["Yes", "No"],
        }),
        field("auto_dla_higher", "select-single", "DLA — higher-rate mobility component", {
          options: ["Yes", "No"],
        }),
        field("auto_war_pension", "select-single", "War Pensioners Mobility Supplement", {
          options: ["Yes", "No"],
        }),
        field("auto_afcs", "select-single", "AFCS tariff 1–8 with permanent disability affecting mobility", {
          options: ["Yes", "No"],
        }),
        field("auto_registered_blind", "select-single", "Registered severely sight-impaired (blind)", {
          options: ["Yes", "No"],
        }),
        field("evidence_upload", "file-multi", "Upload supporting evidence (PIP / DLA letter, etc.)"),
      ],
    },
    {
      id: "assessed-eligibility",
      name: "Assessed eligibility",
      intro: "Complete if you don't fit an automatic category.",
      fields: [
        field("mobility_difficulty", "text-long", "Describe how your condition affects walking", {
          placeholder: "How far can you walk without help? What stops you? Do you use any aids?",
          validation: { maxLength: 1500 },
        }),
        field("conditions", "text-long", "Conditions affecting your mobility", {
          placeholder: "Diagnosis + when diagnosed.",
        }),
        field("medications", "text-long", "Medications related to your mobility"),
        field("hidden_disability", "select-single", "Do you have a non-visible disability affecting journeys?", {
          options: ["No", "Yes — autism / cognitive", "Yes — mental health", "Yes — other"],
        }),
        field("hidden_detail", "text-long", "If yes, how this affects journeys"),
        field("medical_evidence", "file-multi", "Upload medical evidence (consultant letter, prescription list)"),
      ],
    },
    {
      id: "photo-id",
      name: "Photo & ID",
      fields: [
        field("recent_photo", "file-upload", "Upload a recent passport-style photo", {
          required: true,
          help: "Plain background, head and shoulders, eyes clearly visible.",
        }),
        field("id_type", "select-single", "Proof of identity", {
          required: true,
          options: ["UK passport", "UK driving licence", "Birth certificate", "BRP", "Other"],
        }),
        field("id_upload", "file-upload", "Upload ID", { required: true }),
        field("poa_upload", "file-upload", "Upload proof of address (under 12 months)", { required: true }),
      ],
    },
    {
      id: "fee",
      name: "Fee & badge",
      fields: [
        field("council_area", "text-short", "Local council issuing the badge", { required: true }),
        field("fee_aware", "consent-gdpr", "I understand the badge fee (up to £10 in England, free in Scotland & Wales).", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "The information is true to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("misuse_warning", "consent-gdpr", "I understand misuse of a blue badge can result in a £1,000 fine and confiscation.", {
          validation: { required: true },
          regulator: "DfT",
        }),
        field("data", "consent-gdpr", "I consent to my data being shared with the council and DfT for verification.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(e)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default BLUE_BADGE;
