/**
 * Counselling appointment request.
 *
 * Lightweight first-contact form for counsellors and therapists. Captures
 * essentials only — full clinical intake happens after the introductory
 * session, via the therapy-intake-form pack.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const COUNSELLING_APPOINTMENT: PackSchema = toPackSchema({
  productId: "counselling-appointment-request",
  title: "Counselling appointment request",
  pathways: [
    { id: "self", name: "For myself" },
    { id: "young-person", name: "For a young person (under 18)" },
    { id: "couples", name: "Couples / relationship" },
  ],
  sections: [
    {
      id: "client",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("preferred_contact", "select-single", "How would you like to be contacted?", {
          required: true,
          options: ["Email", "Phone call", "Text — discreet", "Either email or text"],
        }),
      ],
    },
    {
      id: "focus",
      name: "What you'd like help with",
      fields: [
        field("focus_areas", "checkbox-group", "Areas you'd like to explore (tick any)", {
          options: [
            "Anxiety",
            "Depression / low mood",
            "Stress / burnout",
            "Relationship difficulty",
            "Grief / loss",
            "Trauma",
            "Self-esteem",
            "Life transition",
            "Work / career",
            "Family",
            "Other",
          ],
        }),
        field("brief_summary", "text-long", "Briefly — what's bringing you here right now?", {
          placeholder: "A few sentences is enough. We'll talk in more depth at the first session.",
          validation: { maxLength: 800 },
        }),
        field("first_time", "select-single", "Have you had counselling before?", {
          options: ["No — first time", "Yes — once or twice", "Yes — longer term", "Currently in therapy elsewhere"],
        }),
      ],
    },
    {
      id: "logistics",
      name: "Session preferences",
      fields: [
        field("session_format", "select-single", "Session format", {
          required: true,
          options: ["In-person", "Online (video)", "Phone", "No preference"],
        }),
        field("availability", "checkbox-group", "When are you generally available?", {
          required: true,
          options: ["Weekday mornings", "Weekday lunchtime", "Weekday afternoons", "Weekday evenings", "Weekends"],
        }),
        field("funding", "select-single", "How will sessions be funded?", {
          options: ["Self-funded", "Employee Assistance Programme", "Health insurance", "GP referral", "Other"],
        }),
      ],
    },
    {
      id: "safety",
      name: "Right now",
      intro: "These help us know how to respond. If you're in crisis call 999 or contact Samaritans (116 123).",
      fields: [
        field("crisis", "select-single", "Are you in crisis right now?", {
          required: true,
          options: [
            "No",
            "Struggling but managing",
            "Yes — please contact me urgently",
          ],
        }),
        field("safety_notes", "text-long", "Anything you'd like the counsellor to know before the first call"),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being processed for arranging counselling.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default COUNSELLING_APPOINTMENT;
