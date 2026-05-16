/**
 * Job application · standard.
 *
 * General-purpose hiring form. Covers identity, eligibility to work,
 * experience, references, and equal-opportunities monitoring (kept
 * optional and clearly flagged for UK Equality Act 2010 compliance).
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const JOB_APPLICATION_STANDARD: PackSchema = toPackSchema({
  productId: "job-application-standard",
  title: "Job application · standard",
  pathways: [
    { id: "permanent", name: "Permanent role" },
    { id: "fixed-term", name: "Fixed-term / contract" },
    { id: "apprentice", name: "Apprentice / trainee" },
  ],
  sections: [
    {
      id: "role",
      name: "About the role",
      intro:
        "Tell us which role you're applying for. We tailor the rest of the form to that.",
      fields: [
        field("role_title", "text-short", "Role title you're applying for", { required: true }),
        field("how_you_heard", "select-single", "How did you hear about this role?", {
          required: true,
          options: ["LinkedIn", "Indeed", "Company website", "Referral", "Recruiter", "Other"],
        }),
        field("available_from", "date", "Available to start from", { required: true }),
        field("desired_salary", "currency", "Expected salary (GBP)"),
      ],
    },
    {
      id: "personal",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Mobile phone", { required: true }),
        field("address", "address-uk", "Current address", { required: true }),
        field("linkedin", "url", "LinkedIn profile (optional)"),
        field("portfolio", "url", "Portfolio / website (optional)"),
      ],
    },
    {
      id: "eligibility",
      name: "Right to work",
      intro:
        "All UK employers must verify right to work before a start date. Upload one document.",
      fields: [
        field("rtw_status", "select-single", "Right-to-work status", {
          required: true,
          options: [
            "British or Irish citizen",
            "Settled or pre-settled status",
            "Skilled Worker / Tier 2 visa",
            "Graduate visa",
            "Other UK visa",
            "Sponsorship required",
          ],
          regulator: "Home Office",
        }),
        field("rtw_share_code", "text-short", "Share code (if applicable)", {
          help: "From the Home Office View and prove your right to work service.",
        }),
        field("rtw_document", "file-upload", "Upload right-to-work document", {
          required: true,
          help: "Passport, BRP, or settled-status screenshot — PDF or image.",
        }),
      ],
    },
    {
      id: "experience",
      name: "Experience",
      fields: [
        field("cv_upload", "file-upload", "Upload your CV", { required: true }),
        field("cover_letter", "text-long", "Why are you the right person for this role?", {
          required: true,
          placeholder: "Tell us about relevant experience, achievements, and what you'd bring.",
          validation: { maxLength: 1500 },
        }),
        field("notice_period", "select-single", "Current notice period", {
          required: true,
          options: ["Immediately available", "1 week", "2 weeks", "1 month", "2 months", "3 months+"],
        }),
      ],
    },
    {
      id: "references",
      name: "References",
      intro: "We contact references only after a verbal offer is made.",
      fields: [
        field("ref1_name", "name-full", "Reference 1 · name", { required: true }),
        field("ref1_role", "text-short", "Reference 1 · their role", { required: true }),
        field("ref1_email", "email", "Reference 1 · email", { required: true }),
        field("ref2_name", "name-full", "Reference 2 · name"),
        field("ref2_role", "text-short", "Reference 2 · their role"),
        field("ref2_email", "email", "Reference 2 · email"),
      ],
    },
    {
      id: "consent",
      name: "Consents",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to my data being stored and used for this hiring process only.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("consent_keep", "consent-marketing", "Keep my CV on file for future roles."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default JOB_APPLICATION_STANDARD;
