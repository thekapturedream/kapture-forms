/**
 * Apprenticeship application.
 *
 * For employers and training providers receiving apprenticeship
 * applications under the UK apprenticeship standards. Captures
 * candidate, eligibility, education, work history, and the
 * commitment statement levy-funded apprenticeships require.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const APPRENTICESHIP_APPLICATION: PackSchema = toPackSchema({
  productId: "apprenticeship-application",
  title: "Apprenticeship application",
  pathways: [
    { id: "level-2-3", name: "Level 2–3 (intermediate / advanced)" },
    { id: "level-4-5", name: "Level 4–5 (higher)" },
    { id: "degree", name: "Level 6–7 (degree apprenticeship)" },
  ],
  sections: [
    {
      id: "applicant",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address", { required: true }),
      ],
    },
    {
      id: "eligibility",
      name: "Eligibility",
      fields: [
        field("rtw", "select-single", "Right to work in the UK", {
          required: true,
          options: ["British / Irish citizen", "Settled / pre-settled", "Visa with work permission", "Sponsorship required"],
          regulator: "Home Office",
        }),
        field("residency", "select-single", "Have you lived in the UK / EEA for the past 3 years?", {
          required: true,
          options: ["Yes", "No"],
        }),
        field("existing_apprenticeship", "select-single", "Currently on another apprenticeship?", {
          required: true,
          options: ["No", "Yes — completing soon", "Yes"],
        }),
      ],
    },
    {
      id: "education",
      name: "Education",
      fields: [
        field("highest_qualification", "select-single", "Highest qualification", {
          required: true,
          options: ["None", "GCSEs (or equivalent)", "A-levels / BTEC", "Degree", "Postgraduate"],
        }),
        field("maths_english", "checkbox-group", "Do you have GCSE-level Maths & English (or equivalent)?", {
          options: ["Maths — grade 4/C or above", "English — grade 4/C or above", "Functional Skills Level 2 in both", "None of the above"],
        }),
        field("school", "text-short", "Most recent school / college"),
        field("qualifications_evidence", "file-multi", "Upload qualification certificates"),
      ],
    },
    {
      id: "work",
      name: "Work experience",
      fields: [
        field("current_status", "select-single", "Current status", {
          required: true,
          options: ["Studying", "Employed", "Looking for work", "Self-employed", "Caring responsibilities"],
        }),
        field("recent_role", "text-short", "Most recent role"),
        field("recent_employer", "text-short", "Employer name"),
        field("duration", "text-short", "Duration"),
        field("cv_upload", "file-upload", "Upload CV"),
      ],
    },
    {
      id: "motivation",
      name: "Why this apprenticeship",
      fields: [
        field("why_role", "text-long", "Why do you want this apprenticeship?", {
          required: true,
          placeholder: "What attracts you to the role, the industry, and the employer?",
          validation: { maxLength: 1500 },
        }),
        field("career_goals", "text-long", "Where do you see yourself in 3–5 years?", {
          validation: { maxLength: 1000 },
        }),
        field("strengths", "text-long", "Three things you'd bring to this apprenticeship"),
      ],
    },
    {
      id: "support",
      name: "Support needs",
      fields: [
        field("disability_disclosure", "select-single", "Do you have a disability or learning need we should be aware of?", {
          options: ["No", "Yes — happy to discuss", "Prefer not to say"],
        }),
        field("adjustments", "text-long", "Reasonable adjustments you'd find helpful at interview or in the role"),
      ],
    },
    {
      id: "consent",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "All information here is true to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for this apprenticeship application.", {
          validation: { required: true },
        }),
        field("references", "consent-marketing", "You may contact my school / previous employer for a reference."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default APPRENTICESHIP_APPLICATION;
