/**
 * Dental check-up booking.
 *
 * General-practice dentistry intake. Identity, medical history, current
 * concerns, appointment preferences, NHS vs private routing.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const DENTAL_CHECK_UP_BOOKING: PackSchema = toPackSchema({
  productId: "dental-check-up-booking",
  title: "Dental check-up booking",
  pathways: [
    { id: "nhs", name: "NHS patient" },
    { id: "private", name: "Private patient" },
    { id: "new", name: "New patient registration" },
  ],
  sections: [
    {
      id: "patient",
      name: "Patient details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number (if registered)"),
        field("address", "address-uk", "Address", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("existing_patient", "select-single", "Are you an existing patient?", {
          required: true,
          options: ["Yes — existing", "No — new patient", "Returning after a long gap"],
        }),
      ],
    },
    {
      id: "history",
      name: "Medical history",
      fields: [
        field("conditions", "checkbox-group", "Any of these conditions?", {
          options: [
            "Diabetes",
            "Heart condition",
            "High blood pressure",
            "Bleeding disorder",
            "Pregnancy",
            "Allergy to anaesthetic or latex",
            "Osteoporosis (bisphosphonate medication)",
            "None of the above",
          ],
        }),
        field("medications", "text-long", "Current medications (name & dose)"),
        field("allergies", "text-short", "Known allergies"),
        field("last_visit", "select-single", "When was your last dental visit?", {
          required: true,
          options: ["Within 6 months", "6–12 months ago", "1–2 years ago", "2–5 years ago", "Over 5 years"],
        }),
      ],
    },
    {
      id: "concerns",
      name: "Reason for visit",
      fields: [
        field("reason", "select-single", "Primary reason today", {
          required: true,
          options: [
            "Routine check-up",
            "Cleaning / scale & polish",
            "Toothache or pain",
            "Cosmetic enquiry",
            "Broken tooth or filling",
            "Gum problem",
            "Wisdom teeth",
            "Other",
          ],
        }),
        field("notes", "text-long", "Tell us more (optional)", {
          placeholder: "Anything specific you want the dentist to look at?",
        }),
        field("anxiety", "rating-numeric", "How anxious do you feel about dental visits? (0 = relaxed, 10 = very anxious)"),
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
        field("preferred_dentist", "text-short", "Preferred dentist (if any)"),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to my data being processed for dental care.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("consent_reminders", "consent-marketing", "Send me text and email appointment reminders."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default DENTAL_CHECK_UP_BOOKING;
