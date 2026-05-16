/**
 * HR onboarding · UK employer.
 *
 * Generic UK new-starter pack — non-clinical. Covers identity, right to
 * work, P45 / starter declaration, bank + pension, emergency contact,
 * and the consents most employers gather day one.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const HR_ONBOARDING_UK_EMPLOYER: PackSchema = toPackSchema({
  productId: "hr-onboarding-uk-employer",
  title: "HR onboarding · UK employer",
  pathways: [
    { id: "permanent", name: "Permanent employee" },
    { id: "fixed-term", name: "Fixed-term / contract" },
    { id: "apprentice", name: "Apprentice" },
    { id: "intern", name: "Intern / placement" },
  ],
  sections: [
    {
      id: "personal",
      name: "Personal details",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("ni_number", "text-short", "National Insurance number", { required: true, regulator: "HMRC" }),
        field("email", "email", "Personal email", { required: true }),
        field("phone", "phone-uk", "Mobile", { required: true }),
        field("address", "address-uk", "Home address", { required: true }),
      ],
    },
    {
      id: "right-to-work",
      name: "Right to work",
      intro: "Original document must be checked in person on or before the first day.",
      fields: [
        field("rtw_type", "select-single", "Document type", {
          required: true,
          options: ["UK / Irish passport", "EEA passport", "BRP", "Share code", "Settled-status digital ID", "Other"],
          regulator: "Home Office",
        }),
        field("rtw_number", "text-short", "Document / share code", { required: true, regulator: "Home Office" }),
        field("rtw_expiry", "date", "Document expiry (if applicable)"),
        field("rtw_upload", "file-upload", "Upload document scan", { required: true }),
      ],
    },
    {
      id: "starter-declaration",
      name: "HMRC starter declaration",
      intro: "Used in place of a P45 if you don't have one.",
      fields: [
        field("p45_held", "select-single", "Do you have a P45 for the current tax year?", {
          required: true,
          options: ["Yes — uploading below", "No"],
          regulator: "HMRC",
        }),
        field("p45_upload", "file-upload", "Upload P45 (if held)"),
        field("starter_statement", "select-single", "Which statement applies to you?", {
          required: true,
          options: [
            "A — This is my first job since 6 April and I've had no other taxable income",
            "B — This is my only job since 6 April but I had another job earlier",
            "C — I have another job or receive a state / occupational pension",
          ],
          regulator: "HMRC",
        }),
        field("student_loan", "select-single", "Student loan", {
          required: true,
          options: ["None", "Plan 1", "Plan 2", "Plan 4 (Scotland)", "Plan 5", "Postgraduate loan"],
          regulator: "HMRC",
        }),
      ],
    },
    {
      id: "bank-pension",
      name: "Bank & pension",
      fields: [
        field("bank_holder", "name-full", "Bank account holder name", { required: true }),
        field("sort_code", "text-short", "Sort code", {
          required: true,
          placeholder: "00-00-00",
          validation: { pattern: "^\\d{2}-?\\d{2}-?\\d{2}$" },
        }),
        field("account_number", "text-short", "Account number", { required: true }),
        field("pension_optout", "select-single", "Workplace pension", {
          required: true,
          options: ["Auto-enrol me", "Opt-out (I'll arrange separately)"],
        }),
      ],
    },
    {
      id: "emergency",
      name: "Emergency contact",
      fields: [
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_relation", "text-short", "Relationship", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
        field("medical_notes", "text-long", "Anything we should know in a medical emergency? (allergies, conditions)"),
      ],
    },
    {
      id: "consents",
      name: "Consents",
      fields: [
        field("contract", "consent-gdpr", "I've read and agree to my employment contract.", {
          validation: { required: true },
        }),
        field("handbook", "consent-gdpr", "I've read and agree to the employee handbook.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for employment purposes.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default HR_ONBOARDING_UK_EMPLOYER;
