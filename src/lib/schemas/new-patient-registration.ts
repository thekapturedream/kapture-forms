/**
 * New patient registration.
 *
 * GP registration pack mapped to GMS1 + supplementary questionnaire that
 * surgeries collect day one (medical history, lifestyle, carer status).
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const NEW_PATIENT_REGISTRATION: PackSchema = toPackSchema({
  productId: "new-patient-registration",
  title: "New patient registration",
  pathways: [
    { id: "permanent", name: "Permanent registration" },
    { id: "temporary", name: "Temporary patient (up to 3 months)" },
    { id: "immediately-necessary", name: "Immediately necessary treatment" },
  ],
  sections: [
    {
      id: "identity",
      name: "Identity",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true, regulator: "GMS1" }),
        field("previous_names", "text-short", "Previous name (if changed)"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("sex_birth", "select-single", "Sex registered at birth", {
          required: true,
          options: ["Female", "Male"],
        }),
        field("gender_identity", "text-short", "Gender identity (if different)"),
        field("title", "select-single", "Title", {
          options: ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Other"],
        }),
        field("nhs_number", "text-short", "NHS number (if known)"),
        field("place_of_birth", "text-short", "Town & country of birth"),
        field("ethnicity", "select-single", "Ethnicity", {
          options: [
            "White — British",
            "White — Irish",
            "White — Other",
            "Mixed",
            "Asian — Indian",
            "Asian — Pakistani",
            "Asian — Bangladeshi",
            "Asian — Chinese",
            "Asian — Other",
            "Black — African",
            "Black — Caribbean",
            "Black — Other",
            "Arab",
            "Other",
            "Prefer not to say",
          ],
        }),
        field("first_language", "text-short", "First language"),
        field("interpreter", "select-single", "Need interpreter?", {
          options: ["No", "Yes — BSL", "Yes — spoken language"],
        }),
      ],
    },
    {
      id: "address",
      name: "Address & contact",
      fields: [
        field("address", "address-uk", "Current address", { required: true }),
        field("moved_in", "date", "Date moved in"),
        field("previous_address", "text-long", "Previous address (if at current under 12 months)"),
        field("phone_home", "phone-uk", "Home phone"),
        field("phone_mobile", "phone-uk", "Mobile", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("preferred_contact", "select-single", "Preferred contact method", {
          required: true,
          options: ["Phone", "Text", "Email", "Post"],
        }),
      ],
    },
    {
      id: "previous-gp",
      name: "Previous GP",
      fields: [
        field("previous_gp_name", "text-short", "Previous GP name"),
        field("previous_practice", "text-long", "Previous practice address"),
        field("registered_since", "date", "Approximately when did you register there?"),
        field("ever_registered_uk", "select-single", "Have you ever been registered with a UK GP before?", {
          required: true,
          options: ["Yes", "No"],
        }),
      ],
    },
    {
      id: "overseas",
      name: "Overseas / new to UK",
      intro: "Only complete if you've been outside the UK in the last 6 months.",
      fields: [
        field("country_last_6m", "text-short", "Country lived in for most of the last 6 months"),
        field("uk_arrival_date", "date", "Date arrived in UK (if recent)"),
        field("visa_status", "select-single", "Visa / immigration status", {
          options: ["British / Irish citizen", "Settled / pre-settled", "Skilled Worker visa", "Student visa", "Family / spouse visa", "Refugee / asylum", "Visitor", "Other"],
        }),
        field("hospital_treatment_abroad", "text-long", "Any hospital treatment abroad in last 5 years?"),
      ],
    },
    {
      id: "medical",
      name: "Medical history",
      fields: [
        field("conditions", "text-long", "Current and past medical conditions", {
          required: true,
          placeholder: "Include approximate year of diagnosis.",
        }),
        field("current_medication", "text-long", "Current medication (name, dose, frequency)", { required: true }),
        field("allergies", "text-long", "Allergies (medications, foods)", { required: true }),
        field("hospital_admissions", "text-long", "Hospital admissions / surgeries (date + reason)"),
        field("immunisations", "text-long", "Immunisations received (if known) — particularly childhood + travel"),
        field("family_history", "text-long", "Family history (parents, siblings — relevant conditions)"),
      ],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      fields: [
        field("smoking", "select-single", "Smoking", {
          required: true,
          options: ["Never smoked", "Ex-smoker", "Current smoker"],
        }),
        field("cigarettes_per_day", "number", "Cigarettes per day (if smoker)"),
        field("alcohol_units", "number", "Alcohol — units per week"),
        field("exercise", "select-single", "Exercise level", {
          options: ["Inactive", "Light (under 30 min/week)", "Moderate (30–150 min/week)", "Active (150+ min/week)"],
        }),
        field("diet", "text-short", "Diet type (vegetarian, vegan, halal, kosher, other)"),
        field("recreational_drugs", "select-single", "Recreational drug use", {
          options: ["Never", "Past", "Current — happy to discuss", "Prefer not to say"],
        }),
      ],
    },
    {
      id: "carer-vulnerability",
      name: "Carer & vulnerability",
      fields: [
        field("is_carer", "select-single", "Are you a carer for someone else?", {
          options: ["No", "Yes — unpaid family carer", "Yes — paid carer"],
        }),
        field("has_carer", "select-single", "Do you have a carer?", {
          options: ["No", "Yes — family / friend", "Yes — paid carer"],
        }),
        field("lpa_health", "select-single", "Is there an LPA for health & welfare in place?", {
          options: ["No", "Yes — registered", "Not sure"],
        }),
        field("safeguarding_concerns", "text-long", "Anything we should know to keep you safe? (domestic concerns, vulnerable adult flag)"),
      ],
    },
    {
      id: "consent-record",
      name: "Record sharing & consent",
      fields: [
        field("scr_consent", "select-single", "Summary Care Record (SCR)", {
          required: true,
          options: ["Standard SCR — allow", "Enhanced SCR (with additional info) — allow", "Opt out — don't create SCR"],
          regulator: "NHS Digital",
        }),
        field("organ_donor", "select-single", "Organ donor preference", {
          options: ["Yes — I wish to donate", "No — I do not wish to donate", "Already registered", "Not sure"],
        }),
        field("data_research", "consent-marketing", "I'm happy for my anonymised data to be used for research and service improvement."),
        field("data_processing", "consent-gdpr", "I consent to my data being processed by the GP practice for direct care.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default NEW_PATIENT_REGISTRATION;
