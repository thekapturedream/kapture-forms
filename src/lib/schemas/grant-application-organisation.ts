/**
 * Grant application · organisation.
 *
 * For funders receiving applications from charities, CICs, social
 * enterprises, and community groups. Captures organisational identity,
 * the project, budget, outcomes, and the safeguarding / governance
 * basics most UK funders require.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const GRANT_APPLICATION_ORGANISATION: PackSchema = toPackSchema({
  productId: "grant-application-organisation",
  title: "Grant application · organisation",
  pathways: [
    { id: "charity", name: "Registered charity" },
    { id: "cic", name: "CIC / social enterprise" },
    { id: "constituted", name: "Constituted community group" },
  ],
  sections: [
    {
      id: "org",
      name: "About your organisation",
      fields: [
        field("org_name", "text-short", "Organisation name", { required: true }),
        field("org_type", "select-single", "Organisation type", {
          required: true,
          options: ["Registered charity", "CIC", "Social enterprise", "Constituted group", "Co-op", "Other"],
        }),
        field("charity_number", "text-short", "Charity / company number"),
        field("website", "url", "Website"),
        field("year_founded", "number", "Year founded", { validation: { min: 1800, max: 2099 } }),
        field("mission", "text-long", "Mission statement (one paragraph)", {
          required: true,
          validation: { maxLength: 600 },
        }),
        field("address", "address-uk", "Registered office address", { required: true }),
      ],
    },
    {
      id: "contact",
      name: "Primary contact",
      fields: [
        field("contact_name", "name-full", "Lead contact name", { required: true }),
        field("contact_role", "text-short", "Their role", { required: true }),
        field("contact_email", "email", "Email", { required: true }),
        field("contact_phone", "phone-uk", "Phone", { required: true }),
      ],
    },
    {
      id: "project",
      name: "The project",
      fields: [
        field("project_title", "text-short", "Project title", { required: true }),
        field("project_summary", "text-long", "Summary (one paragraph)", {
          required: true,
          placeholder: "What will the grant pay for and who benefits?",
          validation: { maxLength: 800 },
        }),
        field("project_need", "text-long", "What is the need this project addresses?", {
          required: true,
          validation: { maxLength: 1200 },
        }),
        field("beneficiaries", "text-long", "Who will benefit, and roughly how many?", {
          required: true,
          validation: { maxLength: 800 },
        }),
        field("location", "text-short", "Project location", { required: true }),
        field("start_date", "date", "Project start date", { required: true }),
        field("end_date", "date", "Project end date", { required: true }),
      ],
    },
    {
      id: "outcomes",
      name: "Outcomes & measurement",
      fields: [
        field("outcomes", "text-long", "What outcomes will the project deliver?", {
          required: true,
          placeholder: "List 3–5 measurable outcomes (e.g. '40 young people complete a 12-week mentoring programme').",
          validation: { maxLength: 1200 },
        }),
        field("evaluation", "text-long", "How will you measure success?", {
          required: true,
          placeholder: "Surveys, attendance, case studies, third-party data?",
          validation: { maxLength: 800 },
        }),
      ],
    },
    {
      id: "budget",
      name: "Budget",
      fields: [
        field("amount_requested", "currency", "Amount requested (GBP)", { required: true }),
        field("total_project_cost", "currency", "Total project cost (GBP)", { required: true }),
        field("matched_funding", "currency", "Matched funding secured (GBP)"),
        field("budget_breakdown", "file-upload", "Upload budget breakdown (PDF or spreadsheet)", { required: true }),
        field("other_funders", "text-long", "Other funders approached for this project"),
      ],
    },
    {
      id: "governance",
      name: "Governance & safeguarding",
      fields: [
        field("safeguarding_policy", "select-single", "Do you have a written safeguarding policy?", {
          required: true,
          options: ["Yes — current within 12 months", "Yes — older than 12 months", "No / under development", "Not applicable"],
        }),
        field("ed_policy", "select-single", "Do you have an equality, diversity & inclusion policy?", {
          required: true,
          options: ["Yes", "No / under development", "Not applicable"],
        }),
        field("accounts_upload", "file-upload", "Upload most recent annual accounts", { required: true }),
        field("trustees", "text-long", "Names and roles of trustees / directors", { required: true }),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "The information in this application is true and accurate.", {
          validation: { required: true },
        }),
        field("share_outcomes", "consent-gdpr", "We agree to share outcome data and a case study if funded.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signed (authorised signatory)", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default GRANT_APPLICATION_ORGANISATION;
