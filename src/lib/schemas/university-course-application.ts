/**
 * University course application.
 *
 * Direct-to-institution course application (postgraduate, mature
 * entrant, transfer, returning student). UCAS handles undergraduate
 * intake; this covers everything else universities receive directly.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const UNIVERSITY_COURSE_APPLICATION: PackSchema = toPackSchema({
  productId: "university-course-application",
  title: "University course application",
  pathways: [
    { id: "postgraduate-taught", name: "Postgraduate taught (MA / MSc / MBA)" },
    { id: "postgraduate-research", name: "Postgraduate research (MRes / MPhil / PhD)" },
    { id: "international-ug", name: "International undergraduate" },
    { id: "mature", name: "Mature entrant" },
    { id: "transfer", name: "Transfer / returning student" },
  ],
  sections: [
    {
      id: "applicant",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full legal name (as on passport)", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("nationality", "text-short", "Nationality", { required: true }),
        field("country_of_residence", "text-short", "Country of residence", { required: true }),
        field("address", "address-uk", "Address"),
        field("requires_visa", "select-single", "Will you need a student visa?", {
          required: true,
          options: ["No — British / Irish or settled status", "No — already on a suitable visa", "Yes — Student Route", "Yes — other"],
          regulator: "UKVI",
        }),
        field("passport_number", "text-short", "Passport number (if applicable)"),
      ],
    },
    {
      id: "course",
      name: "Course",
      fields: [
        field("course_code", "text-short", "Course code / title", { required: true }),
        field("course_level", "select-single", "Level", {
          required: true,
          options: ["Foundation", "Undergraduate", "Postgraduate taught", "Postgraduate research", "Professional / CPD"],
        }),
        field("mode", "select-single", "Mode of study", {
          required: true,
          options: ["Full-time", "Part-time", "Distance learning", "Hybrid"],
        }),
        field("start_intake", "select-single", "Start intake", {
          required: true,
          options: ["September", "January", "April", "Other"],
        }),
        field("start_year", "number", "Start year", { required: true, validation: { min: 2025, max: 2035 } }),
        field("entry_year", "select-single", "Entry year (if direct entry)", {
          options: ["Year 1", "Year 2", "Year 3 (final year)"],
        }),
        field("second_choice", "text-short", "Second-choice course at this university"),
      ],
    },
    {
      id: "qualifications",
      name: "Academic qualifications",
      fields: [
        field("highest_qual", "text-short", "Highest qualification (subject, grade)", { required: true }),
        field("institution_attended", "text-short", "Most recent institution attended", { required: true }),
        field("start_date", "date", "Start date"),
        field("end_date", "date", "End / expected end date"),
        field("transcript_upload", "file-upload", "Upload transcript / official results", { required: true }),
        field("other_quals", "text-long", "Other relevant qualifications & grades"),
        field("english_proficiency", "select-single", "English language proficiency", {
          required: true,
          options: ["First language", "IELTS — to be submitted", "TOEFL", "Cambridge Advanced", "Studied previously in English", "Other"],
        }),
        field("english_score_upload", "file-upload", "Upload English-language test result (if applicable)"),
      ],
    },
    {
      id: "experience",
      name: "Experience (for PG / mature applicants)",
      fields: [
        field("relevant_experience", "text-long", "Relevant work / volunteer / research experience", {
          validation: { maxLength: 3000 },
        }),
        field("cv_upload", "file-upload", "Upload CV"),
        field("publications", "text-long", "Publications / outputs (for research applicants)"),
      ],
    },
    {
      id: "personal-statement",
      name: "Personal statement",
      fields: [
        field("why_course", "text-long", "Why this course and this institution?", {
          required: true,
          validation: { maxLength: 4000 },
        }),
        field("career_goals", "text-long", "Career goals after completing the course"),
        field("research_proposal", "text-long", "Research proposal (PGR applicants)", {
          validation: { maxLength: 8000 },
        }),
      ],
    },
    {
      id: "references",
      name: "References",
      fields: [
        field("ref_1_name", "name-full", "Referee 1 · name", { required: true }),
        field("ref_1_role", "text-short", "Their role / institution", { required: true }),
        field("ref_1_email", "email", "Email", { required: true }),
        field("ref_2_name", "name-full", "Referee 2 · name"),
        field("ref_2_role", "text-short", "Their role / institution"),
        field("ref_2_email", "email", "Email"),
      ],
    },
    {
      id: "fees-funding",
      name: "Fees & funding",
      fields: [
        field("fee_status", "select-single", "Likely fee status", {
          required: true,
          options: ["Home (UK)", "International", "Republic of Ireland", "Unsure — please assess"],
        }),
        field("funding_source", "select-single", "How will you fund your studies?", {
          required: true,
          options: ["Self-funded", "Student Finance England / equivalent", "Employer sponsorship", "Scholarship application pending", "Government scholarship (international)", "Research council funded"],
        }),
        field("scholarship_request", "select-single", "Would you like to be considered for departmental scholarships?", {
          options: ["Yes", "No"],
        }),
      ],
    },
    {
      id: "support-needs",
      name: "Support needs",
      fields: [
        field("disability_disclosure", "select-single", "Do you have a disability or specific learning difference?", {
          options: ["No", "Yes — happy to discuss", "Prefer not to say"],
        }),
        field("adjustments", "text-long", "Reasonable adjustments that would help"),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("truthful", "consent-gdpr", "All information is true and complete to the best of my knowledge.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for admissions and (if I enrol) for student records.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("conduct_check", "consent-gdpr", "I confirm I have no pending criminal proceedings I should disclose under university policy.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default UNIVERSITY_COURSE_APPLICATION;
