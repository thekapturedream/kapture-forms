/**
 * Volunteer application.
 *
 * For charities, festivals, sports clubs, museums, community projects.
 * Captures motivation, availability, skills, and the safeguarding fields
 * needed when volunteering involves children or vulnerable adults.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const VOLUNTEER_APPLICATION: PackSchema = toPackSchema({
  productId: "volunteer-application",
  title: "Volunteer application",
  pathways: [
    { id: "general", name: "General volunteering" },
    { id: "regulated", name: "Working with children / vulnerable adults" },
    { id: "event", name: "One-off event / festival" },
  ],
  sections: [
    {
      id: "personal",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address", { required: true }),
      ],
    },
    {
      id: "motivation",
      name: "Why volunteer",
      fields: [
        field("motivation", "text-long", "Why do you want to volunteer with us?", {
          required: true,
          placeholder: "What draws you to our cause, and what do you hope to give and gain?",
          validation: { maxLength: 1000 },
        }),
        field("skills", "checkbox-group", "Skills you'd like to contribute", {
          options: [
            "Event support",
            "Admin & office",
            "Mentoring / coaching",
            "Marketing / social media",
            "Fundraising",
            "Photography / video",
            "IT / web",
            "Languages",
            "Driving",
            "Manual / physical",
          ],
        }),
        field("languages", "text-short", "Languages spoken (other than English)"),
      ],
    },
    {
      id: "availability",
      name: "Availability",
      fields: [
        field("days", "checkbox-group", "Days available", {
          required: true,
          options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        }),
        field("hours_per_week", "select-single", "Hours per week", {
          required: true,
          options: ["Up to 2", "2–5", "5–10", "10–20", "20+"],
        }),
        field("start_date", "date", "Earliest start date", { required: true }),
        field("commitment", "select-single", "Commitment", {
          options: ["One-off", "Short-term (under 3 months)", "Ongoing"],
        }),
      ],
    },
    {
      id: "safeguarding",
      name: "Safeguarding",
      intro:
        "Required when the volunteer role brings you into contact with children or vulnerable adults. DBS may be required before you start.",
      fields: [
        field("dbs_required", "select-single", "Do you understand a DBS check may be needed?", {
          required: true,
          options: ["Yes", "No"],
          regulator: "DBS",
        }),
        field("dbs_held", "select-single", "Do you currently hold a DBS certificate?", {
          options: ["Yes — enhanced", "Yes — standard", "Yes — basic", "No"],
          regulator: "DBS",
        }),
        field("dbs_number", "text-short", "DBS certificate number (if held)"),
        field("convictions", "text-long", "Unspent convictions (Rehabilitation of Offenders Act 1974)", {
          help: "Spent convictions don't have to be disclosed unless the role is exempt.",
        }),
      ],
    },
    {
      id: "emergency",
      name: "Emergency contact",
      fields: [
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_relation", "text-short", "Relationship to you", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
        field("medical_info", "text-long", "Any medical info we should know (allergies, conditions)?"),
      ],
    },
    {
      id: "consent",
      name: "Consents",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to my data being processed for volunteer coordination.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("consent_photo", "consent-marketing", "Photographs of me may be used in promoting the cause."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default VOLUNTEER_APPLICATION;
