/**
 * AML / KYC onboarding.
 *
 * Anti-money-laundering customer due diligence for any UK firm covered
 * by the Money Laundering Regulations 2017 — banks, fintechs, estate
 * agents, accountants, law firms, art dealers. Captures identity,
 * address, source of funds, PEP/sanctions self-declaration.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const AML_KYC_ONBOARDING: PackSchema = toPackSchema({
  productId: "aml-kyc-onboarding",
  title: "AML / KYC onboarding",
  pathways: [
    { id: "individual", name: "Individual customer" },
    { id: "company", name: "UK limited company" },
    { id: "partnership", name: "Partnership / LLP" },
    { id: "trust", name: "Trust" },
  ],
  sections: [
    {
      id: "identity",
      name: "Identity",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true, regulator: "MLR 2017" }),
        field("dob", "dob", "Date of birth", { required: true, regulator: "MLR 2017" }),
        field("nationality", "text-short", "Nationality", { required: true }),
        field("tax_residency", "text-short", "Tax residency country", { required: true }),
        field("ni_or_tin", "text-short", "NI number / Tax ID", { required: true, regulator: "HMRC" }),
        field("id_type", "select-single", "Photo ID type", {
          required: true,
          options: ["UK passport", "Foreign passport", "UK driving licence", "EEA national ID", "BRP", "Other"],
          regulator: "MLR 2017",
        }),
        field("id_number", "text-short", "Document number", { required: true }),
        field("id_expiry", "date", "Document expiry", { required: true }),
        field("id_upload", "file-upload", "Upload photo ID", { required: true }),
      ],
    },
    {
      id: "address",
      name: "Address verification",
      fields: [
        field("current_address", "address-uk", "Current address", { required: true, regulator: "MLR 2017" }),
        field("time_at_address", "select-single", "Time at this address", {
          required: true,
          options: ["Under 6 months", "6–12 months", "1–3 years", "3+ years"],
        }),
        field("previous_address", "text-long", "Previous address (if at current under 3 years)"),
        field("poa_type", "select-single", "Proof-of-address document", {
          required: true,
          options: [
            "Utility bill (last 3 months)",
            "Council tax letter (current year)",
            "Bank statement (last 3 months)",
            "HMRC letter (last 6 months)",
            "Mortgage statement (last 12 months)",
            "Tenancy agreement",
          ],
          regulator: "MLR 2017",
        }),
        field("poa_upload", "file-upload", "Upload proof of address", { required: true }),
      ],
    },
    {
      id: "company",
      name: "Company details",
      intro: "For corporate / partnership customers.",
      fields: [
        field("company_name", "text-short", "Registered name"),
        field("company_number", "text-short", "Companies House number"),
        field("incorporation_date", "date", "Incorporation date"),
        field("registered_address", "address-uk", "Registered office"),
        field("trading_address", "address-uk", "Trading address (if different)"),
        field("ubo_names", "text-long", "Names of all ultimate beneficial owners (25%+)", {
          help: "Plus their date of birth and nationality.",
          regulator: "MLR 2017",
        }),
        field("incorporation_doc", "file-upload", "Upload certificate of incorporation"),
      ],
    },
    {
      id: "source-of-funds",
      name: "Source of funds & wealth",
      fields: [
        field("primary_source", "select-single", "Primary source of funds", {
          required: true,
          options: [
            "Salary / employment income",
            "Self-employment / business profits",
            "Sale of property",
            "Sale of business",
            "Inheritance",
            "Investment returns",
            "Pension",
            "Savings (accumulated)",
            "Gift",
            "Other",
          ],
          regulator: "MLR 2017",
        }),
        field("source_explanation", "text-long", "Explain the source of funds", {
          required: true,
          validation: { maxLength: 1500 },
        }),
        field("expected_volume", "select-single", "Expected annual transaction volume", {
          required: true,
          options: ["Under £10k", "£10–50k", "£50–250k", "£250k–1m", "£1m+"],
        }),
        field("source_evidence", "file-multi", "Upload evidence (payslips, sale agreement, accounts)"),
      ],
    },
    {
      id: "pep-sanctions",
      name: "PEP & sanctions self-declaration",
      intro:
        "A PEP is a Politically Exposed Person — current or former senior politician, judge, military officer, or close family / associate.",
      fields: [
        field("pep_status", "select-single", "Are you (or a close family member) a PEP?", {
          required: true,
          options: ["No", "Yes — I am a PEP", "Yes — close family / associate of a PEP"],
          regulator: "MLR 2017",
        }),
        field("pep_detail", "text-long", "If yes, describe the role / relationship"),
        field("sanctions_declaration", "consent-gdpr", "I confirm I am not listed on any UK or international sanctions list (OFSI, OFAC, UN, EU).", {
          validation: { required: true },
          regulator: "OFSI",
        }),
        field("adverse_media", "select-single", "Any criminal convictions or current investigations?", {
          required: true,
          options: ["No", "Yes — please contact me"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("truthful", "consent-gdpr", "All information I've given is true and complete.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being used for AML / KYC, including electronic verification with credit-reference agencies.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(c)",
        }),
        field("ongoing_monitoring", "consent-gdpr", "I understand the firm will conduct ongoing monitoring and may request updated information.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default AML_KYC_ONBOARDING;
