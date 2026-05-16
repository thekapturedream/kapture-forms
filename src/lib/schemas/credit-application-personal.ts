/**
 * Credit application · personal.
 *
 * Unsecured personal loan application form. Captures identity, income,
 * outgoings, the loan ask, and FCA-mandated affordability assessment
 * prompts.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const CREDIT_APPLICATION_PERSONAL: PackSchema = toPackSchema({
  productId: "credit-application-personal",
  title: "Credit application · personal",
  pathways: [
    { id: "single", name: "Sole applicant" },
    { id: "joint", name: "Joint application" },
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
        field("current_address", "address-uk", "Current address", { required: true }),
        field("time_at_address", "select-single", "Time at current address", {
          required: true,
          options: ["Under 6 months", "6–12 months", "1–3 years", "3–5 years", "5+ years"],
        }),
        field("previous_address", "text-long", "Previous address (if at current under 3 years)"),
        field("residential_status", "select-single", "Residential status", {
          required: true,
          options: ["Owner — mortgage", "Owner — outright", "Renting privately", "Renting council / housing assoc.", "Living with parents / family", "Other"],
        }),
        field("marital_status", "select-single", "Marital status", {
          required: true,
          options: ["Single", "Married", "Civil partnership", "Cohabiting", "Divorced", "Widowed"],
        }),
        field("dependents", "number", "Number of financial dependents"),
      ],
    },
    {
      id: "employment",
      name: "Employment & income",
      fields: [
        field("employment_status", "select-single", "Employment status", {
          required: true,
          options: ["Employed full-time", "Employed part-time", "Self-employed", "Contractor", "Retired", "Student", "Between roles"],
        }),
        field("employer_name", "text-short", "Employer name"),
        field("job_title", "text-short", "Job title"),
        field("start_date", "date", "Start date with this employer"),
        field("gross_annual_income", "currency", "Gross annual income (GBP)", { required: true }),
        field("net_monthly_income", "currency", "Net monthly take-home (GBP)", { required: true }),
        field("other_income", "currency", "Other monthly income (benefits, side income)"),
        field("payslips_upload", "file-multi", "Upload last 3 payslips (or SA302 for self-employed)"),
      ],
    },
    {
      id: "outgoings",
      name: "Outgoings",
      intro: "FCA affordability — please be accurate. We cross-check via Open Banking if you consent below.",
      fields: [
        field("rent_or_mortgage", "currency", "Rent / mortgage (monthly)", { required: true }),
        field("council_tax", "currency", "Council tax (monthly)"),
        field("utilities", "currency", "Utilities & broadband (monthly)"),
        field("food", "currency", "Food & groceries (monthly)"),
        field("transport", "currency", "Transport (monthly)"),
        field("childcare", "currency", "Childcare (monthly)"),
        field("existing_credit", "currency", "Existing credit / loan repayments (monthly)"),
        field("other_outgoings", "currency", "Other regular outgoings (monthly)"),
      ],
    },
    {
      id: "loan-ask",
      name: "The loan",
      fields: [
        field("amount", "currency", "Loan amount requested (GBP)", { required: true }),
        field("term_months", "number", "Loan term · months", {
          required: true,
          validation: { min: 6, max: 84 },
        }),
        field("purpose", "select-single", "Loan purpose", {
          required: true,
          options: ["Home improvements", "Debt consolidation", "Car / vehicle", "Wedding", "Medical / dental", "Holiday", "Family event", "Business", "Other"],
        }),
        field("purpose_detail", "text-long", "More detail on the purpose"),
      ],
    },
    {
      id: "credit-history",
      name: "Credit history",
      fields: [
        field("bankruptcy", "select-single", "Have you ever been declared bankrupt or entered an IVA?", {
          required: true,
          options: ["No", "Yes — over 6 years ago", "Yes — within the last 6 years"],
        }),
        field("ccjs", "select-single", "Any CCJs or defaults in the last 6 years?", {
          required: true,
          options: ["No", "Yes — settled", "Yes — outstanding"],
        }),
        field("ccj_detail", "text-long", "If yes, please explain"),
      ],
    },
    {
      id: "consent",
      name: "Consent & declaration",
      fields: [
        field("truthful", "consent-gdpr", "All information here is true to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("credit_check", "consent-gdpr", "I consent to a hard credit check via Experian / Equifax / TransUnion.", {
          validation: { required: true },
          regulator: "FCA",
        }),
        field("open_banking", "consent-marketing", "I consent to providing Open Banking data to speed up the affordability check."),
        field("marketing", "consent-marketing", "Send me product updates and offers."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default CREDIT_APPLICATION_PERSONAL;
