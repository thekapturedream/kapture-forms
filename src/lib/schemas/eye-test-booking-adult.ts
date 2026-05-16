/**
 * Eye test booking · adult.
 *
 * Optician intake for adult eye exams. Includes the NHS-eligibility
 * checks (over-60, diabetic, family glaucoma, etc.) and DVLA vision
 * standards flag.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const EYE_TEST_BOOKING_ADULT: PackSchema = toPackSchema({
  productId: "eye-test-booking-adult",
  title: "Eye test booking · adult",
  pathways: [
    { id: "nhs", name: "NHS-funded eye test" },
    { id: "private", name: "Private eye test" },
    { id: "contacts", name: "Contact lens fitting / aftercare" },
  ],
  sections: [
    {
      id: "patient",
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
      id: "eligibility",
      name: "NHS eligibility",
      intro:
        "You may be entitled to a free NHS-funded eye test. Tick anything that applies.",
      fields: [
        field("nhs_reasons", "checkbox-group", "Eligibility reasons", {
          options: [
            "Aged 60 or over",
            "Diabetic",
            "Glaucoma sufferer or close family with glaucoma",
            "Aged 40+ with family history of glaucoma",
            "Receive certain benefits (JSA, ESA, Pension Credit, Universal Credit)",
            "Hold an HC2 / HC3 certificate",
            "Prisoner on leave",
            "None of the above",
          ],
        }),
      ],
    },
    {
      id: "history",
      name: "Vision history",
      fields: [
        field("last_test", "select-single", "When was your last eye test?", {
          required: true,
          options: ["Within 1 year", "1–2 years ago", "2–5 years ago", "Over 5 years", "Never"],
        }),
        field("wear_glasses", "select-single", "Do you currently wear glasses or contact lenses?", {
          required: true,
          options: ["Glasses only", "Contact lenses only", "Both", "Neither"],
        }),
        field("symptoms", "checkbox-group", "Any of these recent?", {
          options: [
            "Blurred vision",
            "Difficulty seeing at night",
            "Headaches when reading",
            "Eye strain on screens",
            "Floaters or flashes",
            "Dry / itchy eyes",
            "None of the above",
          ],
        }),
        field("medical", "text-long", "Relevant medical conditions or medications"),
      ],
    },
    {
      id: "driving",
      name: "Driving",
      fields: [
        field("drives", "select-single", "Do you drive?", {
          required: true,
          options: ["Yes — car", "Yes — HGV / PSV (Group 2)", "No"],
        }),
        field("dvla_concern", "consent-marketing", "Please flag to the optometrist if my vision doesn't meet DVLA standards.", {
          regulator: "DVLA",
        }),
      ],
    },
    {
      id: "preferences",
      name: "Appointment preferences",
      fields: [
        field("preferred_days", "checkbox-group", "Days that work", {
          required: true,
          options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        }),
        field("preferred_time", "select-single", "Time of day", {
          required: true,
          options: ["Morning", "Lunchtime", "Afternoon", "Early evening"],
        }),
        field("notes", "text-long", "Anything else we should know?"),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to my data being processed for eye care.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default EYE_TEST_BOOKING_ADULT;
