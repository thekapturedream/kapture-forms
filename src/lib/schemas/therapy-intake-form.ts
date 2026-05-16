/**
 * Therapy intake form.
 *
 * For counsellors, psychotherapists, CBT practitioners, and clinical
 * psychologists. Identity, presenting concerns, history, risk screen,
 * goals, and consent. Risk screen flagged to the practitioner — the
 * runner stores it audit-hashed for clinical record-keeping.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const THERAPY_INTAKE_FORM: PackSchema = toPackSchema({
  productId: "therapy-intake-form",
  title: "Therapy intake form",
  pathways: [
    { id: "individual", name: "Individual therapy (18+)" },
    { id: "young-person", name: "Young person (under 18)" },
    { id: "couples", name: "Couples therapy" },
  ],
  sections: [
    {
      id: "client",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("pronouns", "select-single", "Pronouns", {
          options: ["She/her", "He/him", "They/them", "Other / prefer to tell you", "Prefer not to say"],
        }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address", { required: true }),
      ],
    },
    {
      id: "gp",
      name: "GP details",
      intro: "We don't contact your GP without consent.",
      fields: [
        field("gp_name", "text-short", "GP name"),
        field("gp_surgery", "text-short", "GP surgery"),
        field("gp_consent", "consent-marketing", "I consent to my therapist contacting my GP if clinically necessary."),
      ],
    },
    {
      id: "concerns",
      name: "What brings you here",
      fields: [
        field("main_concerns", "text-long", "Briefly, what's the main thing you'd like help with?", {
          required: true,
          validation: { maxLength: 1500 },
        }),
        field("duration", "select-single", "How long have you been experiencing this?", {
          required: true,
          options: ["Less than a month", "1–6 months", "6–12 months", "1–3 years", "Over 3 years", "Lifelong"],
        }),
        field("prev_therapy", "select-single", "Have you had therapy before?", {
          required: true,
          options: ["No", "Yes — briefly", "Yes — long-term", "Currently in therapy elsewhere"],
        }),
        field("prev_therapy_details", "text-long", "If yes, what helped and what didn't?"),
        field("diagnoses", "text-long", "Any current mental-health diagnoses?"),
        field("medication", "text-long", "Current psychiatric medication (name & dose)"),
      ],
    },
    {
      id: "risk",
      name: "Risk screen",
      intro:
        "These questions help your therapist support you safely. Your answers stay confidential within the limits of professional duty of care.",
      fields: [
        field("self_harm_now", "select-single", "Are you having thoughts of harming yourself right now?", {
          required: true,
          options: ["No", "Occasional thoughts, no intent", "Yes — please contact me before the session"],
        }),
        field("self_harm_history", "select-single", "Have you self-harmed in the past?", {
          options: ["No", "Yes — over a year ago", "Yes — in the past year", "Yes — in the past month"],
        }),
        field("substance_use", "text-long", "Alcohol or substance use (please be honest — no judgement)"),
        field("supports", "text-long", "People or services that currently support you"),
      ],
    },
    {
      id: "goals",
      name: "Your goals",
      fields: [
        field("goals", "text-long", "What would feel like a good outcome from therapy?", {
          required: true,
          validation: { maxLength: 1000 },
        }),
        field("session_pref", "select-single", "Session preference", {
          required: true,
          options: ["Weekly in-person", "Weekly online", "Fortnightly in-person", "Fortnightly online", "Flexible"],
        }),
        field("session_time", "checkbox-group", "Times that work", {
          required: true,
          options: ["Mornings", "Lunchtime", "Afternoons", "Early evenings", "Weekends"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent & boundaries",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to my data being processed for therapeutic care.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("consent_record", "consent-gdpr", "I understand sessions are noted in clinical records held securely.", {
          validation: { required: true },
        }),
        field("emergency_contact_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_contact_phone", "phone-uk", "Emergency contact · phone", { required: true }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default THERAPY_INTAKE_FORM;
