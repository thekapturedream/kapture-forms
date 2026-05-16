/**
 * Massage appointment.
 *
 * Massage therapist intake — sports, deep tissue, Swedish, pregnancy,
 * remedial. Captures the relevant medical history a therapist must
 * screen for before treatment.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const MASSAGE_APPOINTMENT: PackSchema = toPackSchema({
  productId: "massage-appointment",
  title: "Massage appointment",
  pathways: [
    { id: "sports", name: "Sports / deep tissue" },
    { id: "relaxation", name: "Relaxation / Swedish" },
    { id: "remedial", name: "Remedial / clinical" },
    { id: "pregnancy", name: "Pregnancy massage" },
  ],
  sections: [
    {
      id: "client",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address"),
        field("emergency_contact", "text-short", "Emergency contact name & phone", { required: true }),
      ],
    },
    {
      id: "today",
      name: "Reason for today's session",
      fields: [
        field("primary_reason", "select-single", "Primary reason", {
          required: true,
          options: [
            "General relaxation",
            "Specific pain or tension",
            "Sports recovery",
            "Stress management",
            "Post-surgery rehab",
            "Pregnancy support",
            "Other",
          ],
        }),
        field("pain_areas", "text-long", "Where is the pain / tension?", {
          placeholder: "Be specific — neck, lower back, right shoulder blade, etc.",
        }),
        field("pain_level", "rating-numeric", "Current pain level (0 = none, 10 = severe)"),
        field("pain_duration", "select-single", "How long has it been a problem?", {
          options: ["Today", "Less than a week", "1–4 weeks", "1–6 months", "Over 6 months"],
        }),
      ],
    },
    {
      id: "medical",
      name: "Medical history",
      intro: "Some conditions need extra care or a GP sign-off before massage.",
      fields: [
        field("conditions", "checkbox-group", "Tick anything that applies", {
          options: [
            "High blood pressure",
            "Heart condition",
            "Diabetes",
            "Cancer (current or recent)",
            "Recent surgery (last 6 months)",
            "Recent injury or fracture",
            "Blood-clotting disorder / on blood thinners",
            "Skin condition (eczema, psoriasis, etc.)",
            "Pregnant",
            "Recent COVID infection",
            "None of the above",
          ],
        }),
        field("medications", "text-long", "Current medications"),
        field("allergies", "text-short", "Allergies (oils, latex, etc.)"),
        field("gp_consent", "select-single", "Have you been advised by a GP to avoid massage?", {
          required: true,
          options: ["No", "Yes — please discuss before treatment"],
        }),
      ],
    },
    {
      id: "pregnancy",
      name: "Pregnancy details",
      intro: "Required for pregnancy massage. Skip otherwise.",
      fields: [
        field("weeks_pregnant", "number", "How many weeks pregnant?", { validation: { min: 0, max: 45 } }),
        field("pregnancy_complications", "text-long", "Any pregnancy complications we should know about?"),
        field("midwife_aware", "select-single", "Is your midwife aware you're having massage?", {
          options: ["Yes", "No", "N/A"],
        }),
      ],
    },
    {
      id: "preferences",
      name: "Session preferences",
      fields: [
        field("pressure", "select-single", "Preferred pressure", {
          required: true,
          options: ["Light", "Medium", "Firm", "Deep — go hard", "Therapist to adjust"],
        }),
        field("avoid_areas", "text-short", "Areas to avoid"),
        field("oils_ok", "select-single", "Are you happy with massage oils?", {
          required: true,
          options: ["Yes — any", "Yes — unscented only", "No — please use lotion or none"],
        }),
        field("music_pref", "select-single", "Background music", {
          options: ["Calming instrumental", "Nature sounds", "Silence", "Therapist's choice"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("understanding", "consent-gdpr", "I understand the nature of massage and have disclosed any conditions that may affect treatment.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being processed for treatment records.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("cancellation", "consent-gdpr", "I understand the cancellation policy (24 hours notice).", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default MASSAGE_APPOINTMENT;
