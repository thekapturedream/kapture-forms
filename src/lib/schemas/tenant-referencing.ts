/**
 * Tenant referencing — UK letting-agent / landlord pack.
 *
 * Captures everything a referencing service collects before issuing a
 * tenancy: identity, right to rent, employment & income, current landlord
 * reference, affordability calculation, and explicit consents for credit
 * check + employer contact.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const TENANT_REFERENCING: PackSchema = toPackSchema({
  productId: "tenant-referencing",
  title: "Tenant referencing",
  pathways: [
    { id: "employed", name: "Employed applicant" },
    { id: "self-employed", name: "Self-employed applicant" },
    { id: "student", name: "Student applicant" },
    { id: "guarantor", name: "Guarantor" },
  ],
  sections: [
    {
      id: "identity",
      name: "Identity & right to rent",
      intro:
        "Photo ID and proof-of-address evidence is checked in person and uploaded here. Right-to-rent shares the Home Office service check.",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true, regulator: "Home Office" }),
        field("dob", "dob", "Date of birth", { required: true, regulator: "Home Office" }),
        field("email", "email", "Email", { required: true }),
        field("mobile", "phone-uk", "Mobile", { required: true }),
        field("current_address", "address-uk", "Current address", { required: true, regulator: "Right to Rent" }),
        field("time_at_address", "select-single", "Time at current address", {
          required: true,
          options: ["< 6 months", "6–12 months", "1–2 years", "2–5 years", "5+ years"],
        }),
        field("rtr_doc_type", "select-single", "Right-to-rent document", {
          required: true,
          options: ["UK passport", "EEA passport", "BRP", "Share code", "Settled status digital ID", "Other"],
          regulator: "Right to Rent",
        }),
        field("rtr_doc_upload", "file-upload", "Upload document (photo or PDF)", { required: true, regulator: "Right to Rent" }),
      ],
    },
    {
      id: "employment",
      name: "Employment & income",
      intro:
        "Pay-slip evidence is uploaded here. Self-employed applicants upload SA302 or last full-year accounts instead.",
      fields: [
        field("employment_status", "select-single", "Employment status", {
          required: true,
          options: ["Employed", "Self-employed", "Contractor", "Student", "Retired", "Between roles"],
        }),
        field("employer_name", "text-short", "Employer / trading name", { required: true }),
        field("job_title", "text-short", "Job title"),
        field("start_date", "date", "Start date with this employer", { required: true }),
        field("gross_annual", "currency", "Gross annual income (GBP)", { required: true }),
        field("payslip_upload", "file-multi", "Last 3 payslips (or SA302)", { required: true }),
        field("hr_contact_name", "name-full", "HR / accountant contact · name", { required: true }),
        field("hr_contact_email", "email", "HR / accountant contact · email", { required: true }),
        field("hr_contact_phone", "phone-uk", "HR / accountant contact · phone"),
      ],
    },
    {
      id: "previous-landlord",
      name: "Current / previous landlord",
      intro:
        "We contact the current landlord. Skip only if this is your first tenancy.",
      fields: [
        field("has_landlord", "select-single", "Do you have a current or recent landlord?", {
          required: true,
          options: ["Yes", "No — first tenancy"],
        }),
        field("landlord_name", "name-full", "Landlord / agent · name"),
        field("landlord_email", "email", "Landlord / agent · email"),
        field("landlord_phone", "phone-uk", "Landlord / agent · phone"),
        field("rent_paid_pcm", "currency", "Rent paid · per calendar month"),
        field("arrears_history", "select-single", "Any arrears in the last 12 months?", {
          options: ["No arrears", "Once · cleared", "Multiple · cleared", "Currently in arrears"],
        }),
      ],
    },
    {
      id: "affordability",
      name: "Affordability",
      intro:
        "30× monthly rent is the industry-standard income threshold. We calculate this automatically from the figures above.",
      fields: [
        field("target_rent_pcm", "currency", "Target rent · per calendar month", { required: true }),
        field("affordability_acknowledged", "consent-gdpr", "I confirm the gross annual income figure above is accurate.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "consents",
      name: "Consents",
      intro:
        "Explicit consent under UK GDPR for credit check, employer contact, and landlord contact.",
      fields: [
        field("consent_credit", "consent-gdpr", "I consent to a soft credit check via Experian / Equifax.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("consent_employer", "consent-gdpr", "I consent to the letting agent contacting my employer for reference.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("consent_landlord", "consent-gdpr", "I consent to the letting agent contacting my current landlord for reference.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("signature", "signature", "Applicant signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default TENANT_REFERENCING;
