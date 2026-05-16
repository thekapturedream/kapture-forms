/**
 * IAPT self-referral.
 *
 * NHS Talking Therapies (formerly IAPT) self-referral pack. Captures
 * demographics, current presentation, PHQ-9 + GAD-7 baseline scores,
 * and risk indicators that determine triage priority.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const IAPT_SELF_REFERRAL: PackSchema = toPackSchema({
  productId: "iapt-self-referral",
  title: "IAPT self-referral",
  pathways: [
    { id: "self", name: "Self-referral (adult 18+)" },
    { id: "long-term-condition", name: "With a long-term physical condition" },
    { id: "perinatal", name: "Perinatal (pregnant or under 1 year post-birth)" },
  ],
  sections: [
    {
      id: "about-you",
      name: "About you",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number (if known)"),
        field("address", "address-uk", "Address", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("email", "email", "Email"),
        field("preferred_contact", "select-single", "Preferred contact method", {
          required: true,
          options: ["Phone", "Text — discreet", "Email", "Either phone or text"],
        }),
        field("safe_to_leave_message", "select-single", "Safe to leave a voicemail?", {
          required: true,
          options: ["Yes", "No — please don't leave details"],
        }),
        field("gp_practice", "text-short", "GP practice name", { required: true }),
      ],
    },
    {
      id: "presentation",
      name: "What's bringing you in",
      fields: [
        field("main_problem", "text-long", "In your own words — what's the main thing you'd like help with?", {
          required: true,
          validation: { maxLength: 2000 },
        }),
        field("duration", "select-single", "How long has this been going on?", {
          required: true,
          options: ["Under a month", "1–3 months", "3–6 months", "6–12 months", "Over a year"],
        }),
        field("impact_areas", "checkbox-group", "Areas of life affected", {
          options: [
            "Sleep",
            "Appetite",
            "Energy",
            "Concentration",
            "Work / studies",
            "Relationships",
            "Physical activity",
            "Self-care",
            "Social life",
          ],
        }),
        field("prev_therapy", "select-single", "Have you had talking therapy before?", {
          required: true,
          options: ["No", "Yes — once", "Yes — multiple courses", "Currently engaged elsewhere"],
        }),
      ],
    },
    {
      id: "phq9",
      name: "Mood — PHQ-9",
      intro:
        "Over the last 2 weeks, how often have you been bothered by any of the following? Score: 0 = not at all, 1 = several days, 2 = more than half the days, 3 = nearly every day.",
      fields: [
        field("phq_1", "rating-numeric", "Little interest or pleasure in doing things", { validation: { min: 0, max: 3 } }),
        field("phq_2", "rating-numeric", "Feeling down, depressed, or hopeless", { validation: { min: 0, max: 3 } }),
        field("phq_3", "rating-numeric", "Trouble falling or staying asleep, or sleeping too much", { validation: { min: 0, max: 3 } }),
        field("phq_4", "rating-numeric", "Feeling tired or having little energy", { validation: { min: 0, max: 3 } }),
        field("phq_5", "rating-numeric", "Poor appetite or overeating", { validation: { min: 0, max: 3 } }),
        field("phq_6", "rating-numeric", "Feeling bad about yourself, that you are a failure", { validation: { min: 0, max: 3 } }),
        field("phq_7", "rating-numeric", "Trouble concentrating on things", { validation: { min: 0, max: 3 } }),
        field("phq_8", "rating-numeric", "Moving / speaking so slowly others would notice — or the opposite", { validation: { min: 0, max: 3 } }),
        field("phq_9", "rating-numeric", "Thoughts you would be better off dead, or of hurting yourself", { validation: { min: 0, max: 3 } }),
      ],
    },
    {
      id: "gad7",
      name: "Anxiety — GAD-7",
      intro: "Over the last 2 weeks, same scoring as above.",
      fields: [
        field("gad_1", "rating-numeric", "Feeling nervous, anxious, or on edge", { validation: { min: 0, max: 3 } }),
        field("gad_2", "rating-numeric", "Not being able to stop or control worrying", { validation: { min: 0, max: 3 } }),
        field("gad_3", "rating-numeric", "Worrying too much about different things", { validation: { min: 0, max: 3 } }),
        field("gad_4", "rating-numeric", "Trouble relaxing", { validation: { min: 0, max: 3 } }),
        field("gad_5", "rating-numeric", "Being so restless it's hard to sit still", { validation: { min: 0, max: 3 } }),
        field("gad_6", "rating-numeric", "Becoming easily annoyed or irritable", { validation: { min: 0, max: 3 } }),
        field("gad_7", "rating-numeric", "Feeling afraid as if something awful might happen", { validation: { min: 0, max: 3 } }),
      ],
    },
    {
      id: "risk",
      name: "Risk screen",
      intro:
        "Honest answers help us prioritise care. If you're in immediate danger call 999 or Samaritans on 116 123.",
      fields: [
        field("suicidal_thoughts", "select-single", "Are you having thoughts of suicide?", {
          required: true,
          options: ["No", "Occasional fleeting thoughts", "Yes — frequent", "Yes — with a plan"],
        }),
        field("self_harm", "select-single", "Have you self-harmed in the last month?", {
          required: true,
          options: ["No", "Yes — once", "Yes — multiple times"],
        }),
        field("safety_now", "select-single", "Are you currently safe?", {
          required: true,
          options: ["Yes", "Unsure", "No — please contact me urgently"],
        }),
        field("substance_use", "text-long", "Alcohol or drug use that concerns you"),
        field("supports", "text-long", "People or services currently supporting you"),
      ],
    },
    {
      id: "preferences",
      name: "Therapy preferences",
      fields: [
        field("format", "checkbox-group", "Format you'd consider", {
          required: true,
          options: ["1:1 in-person", "1:1 online video", "Phone", "Group therapy", "Guided self-help (digital)"],
        }),
        field("time_pref", "checkbox-group", "When you can attend", {
          required: true,
          options: ["Weekday mornings", "Weekday lunchtime", "Weekday afternoons", "Weekday evenings", "Weekends"],
        }),
        field("language", "text-short", "Preferred language for therapy"),
        field("identity_preference", "text-short", "Therapist identity preference (if any)"),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("data_consent", "consent-gdpr", "I consent to NHS Talking Therapies processing my data to deliver care.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("gp_share", "consent-gdpr", "I'm happy for the service to share progress and risk updates with my GP.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default IAPT_SELF_REFERRAL;
