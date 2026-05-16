/**
 * Bursary / scholarship application.
 *
 * Universal financial-support application. Used by trusts, foundations,
 * schools, universities, and charities. Captures applicant background,
 * the funding ask, financial need, academic / professional context, and
 * a personal statement.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const BURSARY_SCHOLARSHIP: PackSchema = toPackSchema({
  productId: "bursary-scholarship-application",
  title: "Bursary / scholarship application",
  pathways: [
    { id: "school", name: "School-age applicant" },
    { id: "university", name: "University / college applicant" },
    { id: "professional", name: "Professional development" },
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
        field("address", "address-uk", "Address", { required: true }),
        field("nationality", "text-short", "Nationality / residency status", { required: true }),
      ],
    },
    {
      id: "guardian",
      name: "Parent / guardian",
      intro: "For applicants under 18.",
      fields: [
        field("guardian_name", "name-full", "Guardian · name"),
        field("guardian_email", "email", "Guardian · email"),
        field("guardian_phone", "phone-uk", "Guardian · phone"),
      ],
    },
    {
      id: "study",
      name: "Course / programme",
      fields: [
        field("institution", "text-short", "School / institution name", { required: true }),
        field("course_title", "text-short", "Course / programme title", { required: true }),
        field("level", "select-single", "Level of study", {
          required: true,
          options: [
            "Primary",
            "Secondary",
            "Sixth form / A-level",
            "Undergraduate",
            "Postgraduate (Masters)",
            "Postgraduate (PhD)",
            "Vocational / professional",
          ],
        }),
        field("start_date", "date", "Course start date", { required: true }),
        field("duration", "text-short", "Course duration", { placeholder: "e.g. 3 years full-time" }),
        field("offer_evidence", "file-upload", "Upload offer letter or enrolment confirmation"),
      ],
    },
    {
      id: "funding",
      name: "Funding request",
      fields: [
        field("amount", "currency", "Amount requested (GBP)", { required: true }),
        field("purpose", "select-single", "Funding purpose", {
          required: true,
          options: ["Tuition fees", "Living costs", "Books & equipment", "Travel / placement", "Childcare", "Other"],
        }),
        field("purpose_detail", "text-long", "Detail your funding need (one paragraph)", {
          required: true,
          validation: { maxLength: 1200 },
        }),
      ],
    },
    {
      id: "financial",
      name: "Financial need",
      fields: [
        field("household_income", "select-single", "Household income (annual, before tax)", {
          required: true,
          options: ["Under £15k", "£15–25k", "£25–35k", "£35–50k", "£50–75k", "£75k+", "Prefer not to say"],
        }),
        field("dependents", "number", "Number of people in your household"),
        field("other_funding", "text-long", "Other funding you've received or applied for"),
        field("circumstances", "text-long", "Anything specific about your financial circumstances we should know?"),
        field("evidence", "file-multi", "Upload supporting documents (payslips, benefit letters, tax statements)"),
      ],
    },
    {
      id: "statement",
      name: "Personal statement",
      fields: [
        field("statement", "text-long", "Tell us about yourself, your ambitions, and why this funding matters", {
          required: true,
          placeholder: "Where you've come from, what you're working towards, and how this support changes things.",
          validation: { maxLength: 4000 },
        }),
        field("achievements", "text-long", "Notable achievements (academic, sporting, community)"),
        field("references", "text-long", "Referees (name, role, email — we may contact them)", {
          required: true,
        }),
      ],
    },
    {
      id: "consent",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "All information I've given is true and complete to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for this funding application.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("share_outcome", "consent-marketing", "If successful, I'm happy for my story to be used in (anonymised) impact reporting."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default BURSARY_SCHOLARSHIP;
