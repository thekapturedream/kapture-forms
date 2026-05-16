/**
 * Internship / placement application.
 *
 * For companies receiving applications for summer internships, year-in-
 * industry placements, sandwich years, or insight days. Captures
 * applicant, education, skills, motivation, and the right-to-work
 * basics universities require for sandwich placements.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const INTERNSHIP_PLACEMENT: PackSchema = toPackSchema({
  productId: "internship-placement-application",
  title: "Internship / placement application",
  pathways: [
    { id: "summer-internship", name: "Summer internship (4–12 weeks)" },
    { id: "year-in-industry", name: "Year in industry (sandwich)" },
    { id: "graduate-scheme", name: "Graduate scheme" },
    { id: "insight-week", name: "Insight / spring week" },
    { id: "school-leaver", name: "School-leaver / apprenticeship" },
  ],
  sections: [
    {
      id: "applicant",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address"),
        field("linkedin", "url", "LinkedIn (optional)"),
        field("portfolio", "url", "Portfolio / website (optional)"),
      ],
    },
    {
      id: "education",
      name: "Education",
      fields: [
        field("institution", "text-short", "Current school / college / university", { required: true }),
        field("course", "text-short", "Course / programme of study", { required: true }),
        field("year_of_study", "select-single", "Year of study", {
          required: true,
          options: ["Pre-A-level", "A-level / equivalent", "Year 1 (UG)", "Year 2 (UG)", "Year 3 (UG)", "Year 4 (UG)", "Masters", "PhD", "Graduated within last 12 months"],
        }),
        field("expected_grade", "select-single", "Expected / achieved degree class (if applicable)", {
          options: ["First", "2:1", "2:2", "Third", "Pass", "Not yet predicted", "N/A"],
        }),
        field("a_levels", "text-short", "A-levels / equivalent (subject — grade)"),
        field("gcses_maths_english", "select-single", "GCSE Maths & English grades", {
          options: ["Both 7+ / A or above", "Both 4–6 / C", "Mixed", "International equivalent"],
        }),
        field("transcript", "file-upload", "Upload most recent transcript (optional)"),
      ],
    },
    {
      id: "role",
      name: "About the role",
      fields: [
        field("role_applied", "text-short", "Role / programme applying for", { required: true }),
        field("location_pref", "select-single", "Location preference", {
          options: ["UK — flexible", "London", "Regional UK", "International", "Remote", "Hybrid"],
        }),
        field("availability_start", "date", "Earliest start date", { required: true }),
        field("availability_end", "date", "Latest finish date"),
        field("how_heard", "select-single", "How did you hear about us?", {
          options: ["University careers service", "Job board (LinkedIn, Bright Network, RateMyPlacement)", "Friend / referral", "Careers event", "Company website", "Social media", "Other"],
        }),
      ],
    },
    {
      id: "experience",
      name: "Experience",
      fields: [
        field("cv_upload", "file-upload", "Upload CV", { required: true }),
        field("relevant_experience", "text-long", "Most relevant prior experience (work, volunteer, society, project)", {
          validation: { maxLength: 2000 },
        }),
        field("technical_skills", "text-long", "Technical skills (languages, tools, certifications)"),
        field("soft_skills_evidence", "text-long", "Example of leading, problem-solving, or working in a team (STAR-style)", {
          placeholder: "Situation, Task, Action, Result.",
          validation: { maxLength: 2000 },
        }),
      ],
    },
    {
      id: "motivation",
      name: "Motivation",
      fields: [
        field("why_role", "text-long", "Why this role and this company?", {
          required: true,
          validation: { maxLength: 2500 },
        }),
        field("career_interest", "text-long", "Your career interests post-placement"),
        field("unique_thing", "text-long", "One thing about you that wouldn't show up on your CV"),
      ],
    },
    {
      id: "eligibility",
      name: "Eligibility",
      fields: [
        field("rtw", "select-single", "Right to work in the UK", {
          required: true,
          options: ["British / Irish citizen", "Settled / pre-settled status", "Student visa (with permitted work)", "Sponsorship required", "Other (specify)"],
          regulator: "Home Office",
        }),
        field("driving_licence", "select-single", "Driving licence (if relevant to role)", {
          options: ["Full UK licence", "Provisional", "Foreign licence", "None"],
        }),
        field("dbs", "select-single", "Existing DBS check (if applicable to role)", {
          options: ["No", "Yes — basic", "Yes — standard", "Yes — enhanced"],
        }),
      ],
    },
    {
      id: "diversity",
      name: "Diversity (anonymous)",
      intro:
        "Equality Act 2010 monitoring — answers go to HR analytics only, not to the hiring panel. Optional.",
      fields: [
        field("ethnicity_mon", "text-short", "Ethnicity (optional)"),
        field("gender_mon", "text-short", "Gender (optional)"),
        field("disability_mon", "select-single", "Do you consider yourself to have a disability?", {
          options: ["No", "Yes", "Prefer not to say"],
        }),
        field("adjustments_needed", "text-long", "Adjustments you'd find helpful at interview"),
      ],
    },
    {
      id: "consent",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "All information here is true to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for this hiring process.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("future_roles", "consent-marketing", "Keep my application on file for future roles."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default INTERNSHIP_PLACEMENT;
