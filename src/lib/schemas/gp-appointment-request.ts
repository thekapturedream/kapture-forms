/**
 * GP appointment request.
 *
 * NHS-style triage form for GP surgeries to receive appointment requests
 * online. Captures patient identity, the symptoms or reason, urgency
 * indicators, and consent to contact.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const GP_APPOINTMENT_REQUEST: PackSchema = toPackSchema({
  productId: "gp-appointment-request",
  title: "GP appointment request",
  pathways: [
    { id: "self", name: "Request for myself" },
    { id: "child", name: "Request for my child (under 16)" },
    { id: "carer", name: "Request as a carer for someone else" },
  ],
  sections: [
    {
      id: "patient",
      name: "Patient details",
      fields: [
        field("full_name", "name-full", "Patient full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number (if known)", {
          placeholder: "e.g. 485 777 3456",
        }),
        field("address", "address-uk", "Home address", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Mobile phone", { required: true }),
        field("preferred_contact", "select-single", "Preferred contact method", {
          required: true,
          options: ["Phone call", "Text message", "Email", "Video call"],
        }),
      ],
    },
    {
      id: "carer",
      name: "Carer details",
      intro: "Only for requests submitted on behalf of someone else.",
      fields: [
        field("carer_name", "name-full", "Your name (carer)"),
        field("carer_relationship", "text-short", "Relationship to the patient"),
        field("carer_phone", "phone-uk", "Your phone"),
        field("carer_authority", "consent-gdpr", "I confirm I have permission to act on behalf of the patient."),
      ],
    },
    {
      id: "symptoms",
      name: "Reason for appointment",
      fields: [
        field("main_concern", "text-long", "What's the main thing you'd like help with?", {
          required: true,
          placeholder: "Describe symptoms, when they started, and what makes them better or worse.",
          validation: { maxLength: 1200 },
        }),
        field("duration", "select-single", "How long has this been going on?", {
          required: true,
          options: ["Today", "Less than 1 week", "1–4 weeks", "1–3 months", "Over 3 months"],
        }),
        field("severity", "rating-numeric", "How severe is it today? (0 = mild, 10 = severe)", { required: true }),
        field("tried", "text-long", "What have you already tried? (rest, painkillers, etc.)"),
        field("medications", "text-long", "Current medications (name & dose)"),
        field("allergies", "text-short", "Known allergies"),
      ],
    },
    {
      id: "urgency",
      name: "Urgency",
      intro:
        "If you have severe chest pain, breathing difficulty, signs of stroke, or are bleeding heavily — call 999 instead of waiting for an appointment.",
      fields: [
        field("urgency_self", "select-single", "How quickly do you feel you need to be seen?", {
          required: true,
          options: ["Today", "Within 2 days", "Within a week", "Within 2 weeks", "Routine"],
        }),
        field("red_flags", "checkbox-group", "Any of these in the last 24 hours?", {
          options: [
            "Chest pain or pressure",
            "Difficulty breathing",
            "Sudden severe headache",
            "Confusion or weakness on one side",
            "Heavy bleeding",
            "Fever above 39 °C",
            "None of the above",
          ],
        }),
      ],
    },
    {
      id: "preferences",
      name: "Appointment preferences",
      fields: [
        field("preferred_time", "checkbox-group", "Times that work for you", {
          required: true,
          options: ["Morning", "Lunchtime", "Afternoon", "Late afternoon"],
        }),
        field("preferred_days", "checkbox-group", "Days that work for you", {
          required: true,
          options: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        }),
        field("clinician_pref", "text-short", "Preferred clinician (if any)"),
        field("interpreter", "select-single", "Do you need an interpreter?", {
          options: ["No", "Yes — BSL", "Yes — spoken language (state below)"],
        }),
        field("interpreter_language", "text-short", "Spoken language (if interpreter needed)"),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("consent_share", "consent-gdpr", "I consent to my GP practice processing this request and contacting me about it.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default GP_APPOINTMENT_REQUEST;
