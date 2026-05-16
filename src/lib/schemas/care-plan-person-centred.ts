/**
 * Care plan · person-centred.
 *
 * CQC SAF-aligned person-centred care plan. Covers needs and goals
 * across personal care, mobility, nutrition, communication, medication,
 * mental wellbeing, social, and end-of-life — with the resident's own
 * voice driving each section.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const CARE_PLAN_PERSON_CENTRED: PackSchema = toPackSchema({
  productId: "care-plan-person-centred",
  title: "Care plan · person-centred",
  pathways: [
    { id: "initial", name: "Initial 6-week plan" },
    { id: "review-quarterly", name: "Quarterly review" },
    { id: "review-annual", name: "Annual review" },
    { id: "change-of-need", name: "Change of need" },
  ],
  sections: [
    {
      id: "header",
      name: "Plan header",
      fields: [
        field("resident_name", "name-full", "Resident name", { required: true }),
        field("preferred_name", "text-short", "Preferred name"),
        field("plan_start", "date", "Plan start date", { required: true }),
        field("review_due", "date", "Review due date", { required: true }),
        field("key_worker", "name-full", "Named key worker", { required: true }),
        field("nurse_in_charge", "name-full", "Nurse in charge / care coordinator"),
      ],
    },
    {
      id: "voice",
      name: "Resident voice",
      intro: "Use the resident's own words wherever possible.",
      fields: [
        field("about_me", "text-long", "About me — who I am, what matters to me", {
          required: true,
          validation: { maxLength: 2000 },
        }),
        field("what_helps", "text-long", "What helps me feel safe & well"),
        field("what_unsettles", "text-long", "What unsettles me / how I show it"),
        field("goals", "text-long", "My goals for the next 3–6 months", {
          required: true,
          validation: { maxLength: 1500 },
        }),
      ],
    },
    {
      id: "personal-care",
      name: "Personal care & hygiene",
      fields: [
        field("washing_pref", "select-single", "Washing preference", {
          required: true,
          options: ["Independent", "Stand-by support", "Assistance with parts", "Full assistance"],
        }),
        field("bathing_routine", "text-long", "Bathing routine & preferences (time of day, products, music)"),
        field("dressing_pref", "select-single", "Dressing", {
          required: true,
          options: ["Independent", "Stand-by support", "Assistance needed", "Full assistance"],
        }),
        field("oral_care", "text-long", "Oral care notes (dentures, denture cleaner)"),
        field("skin_care", "text-long", "Skin care (cream, sun, sensitive areas)"),
      ],
    },
    {
      id: "mobility",
      name: "Mobility & falls prevention",
      fields: [
        field("mobility_status", "select-single", "Mobility level", {
          required: true,
          options: ["Independent", "Walks with stick / frame", "Wheelchair part-time", "Wheelchair full-time", "Bed-bound"],
        }),
        field("transfers", "select-single", "Transfers", {
          required: true,
          options: ["Independent", "1 carer + verbal prompt", "1 carer + hands-on", "2 carers", "Hoist"],
          regulator: "Manual Handling Regs",
        }),
        field("equipment", "text-long", "Mobility equipment (frame, hoist, sling type, slide sheets)"),
        field("falls_prevention", "text-long", "Falls prevention measures in place", {
          regulator: "NICE CG161",
        }),
      ],
    },
    {
      id: "nutrition",
      name: "Nutrition & hydration",
      fields: [
        field("diet_type", "select-single", "Diet type", {
          required: true,
          options: ["Normal", "Soft / mashed", "Pureed (IDDSI level 4)", "Thickened fluids", "PEG / enteral feed"],
          regulator: "IDDSI",
        }),
        field("food_likes", "text-long", "Food likes & dislikes"),
        field("hydration_target", "text-short", "Daily fluid target", { placeholder: "e.g. 1.5 L" }),
        field("swallowing", "select-single", "Swallowing", {
          options: ["Normal", "Mild difficulty — observe", "SALT assessed — see plan"],
        }),
        field("weight_kg", "number", "Current weight (kg)"),
        field("must_score", "number", "MUST score", { validation: { min: 0, max: 6 } }),
      ],
    },
    {
      id: "medication",
      name: "Medication",
      fields: [
        field("medication_summary", "text-long", "Current medications (name, dose, route, frequency)", {
          required: true,
        }),
        field("administration", "select-single", "Administration", {
          required: true,
          options: ["Self-medicating", "Prompt only", "Carer to administer", "Nurse-administered"],
        }),
        field("covert_meds", "select-single", "Covert medication?", {
          options: ["No", "Yes — MDT-agreed under best interests"],
          regulator: "MCA 2005",
        }),
        field("prn_protocol", "text-long", "PRN protocol (when to give, max doses, escalation)"),
      ],
    },
    {
      id: "mental-wellbeing",
      name: "Mental wellbeing & cognition",
      fields: [
        field("cognition", "select-single", "Cognition", {
          options: ["No cognitive impairment", "Mild — episodic forgetfulness", "Moderate dementia", "Advanced dementia"],
        }),
        field("mood_low_signs", "text-long", "Signs of low mood / anxiety we should watch for"),
        field("coping_strategies", "text-long", "What helps when distressed"),
        field("dols_status", "select-single", "DoLS / LPS", {
          options: ["Not required", "Urgent in place", "Standard authorised", "Application pending"],
          regulator: "DoLS / MCA 2005",
        }),
      ],
    },
    {
      id: "social",
      name: "Social, spiritual, activities",
      fields: [
        field("hobbies", "text-long", "Hobbies & interests"),
        field("important_people", "text-long", "Important people — when they visit, how often"),
        field("faith", "text-long", "Faith & spiritual needs"),
        field("activities_engaged", "text-long", "Activities the resident enjoys"),
        field("preferences_outings", "text-long", "Outings / community engagement preferences"),
      ],
    },
    {
      id: "eol",
      name: "End-of-life wishes",
      intro: "Sensitive — complete only if appropriate and resident / family agree.",
      fields: [
        field("eol_discussed", "select-single", "Advance care plan discussed?", {
          options: ["Yes — documented", "Yes — declined", "Not yet — defer to next review"],
          regulator: "ReSPECT",
        }),
        field("preferred_place", "select-single", "Preferred place of care at end of life", {
          options: ["This care home", "Hospital", "Hospice", "Family home", "Not yet decided"],
        }),
        field("eol_wishes", "text-long", "Specific wishes (music, faith leader, who to be with)"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("resident_signature", "signature", "Resident signature (if able)"),
        field("nok_signature", "signature", "Next of kin / attorney signature"),
        field("nurse_signature", "signature", "Plan author signature", { required: true }),
        field("signed_date", "date", "Date completed", { required: true }),
      ],
    },
  ],
});

export default CARE_PLAN_PERSON_CENTRED;
