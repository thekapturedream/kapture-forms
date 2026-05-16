/**
 * Resident admission.
 *
 * Care-home admission pack. CQC SAF aligned. Captures identity, GP &
 * next of kin, funding status, capacity, preferences, and the day-one
 * risk screens (falls, pressure, nutrition) that the care plan builds on.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const RESIDENT_ADMISSION: PackSchema = toPackSchema({
  productId: "resident-admission",
  title: "Resident admission",
  pathways: [
    { id: "permanent", name: "Permanent placement" },
    { id: "respite", name: "Respite / short-stay" },
    { id: "intermediate", name: "Intermediate / re-ablement" },
  ],
  sections: [
    {
      id: "resident",
      name: "Resident details",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true, regulator: "CQC SAF" }),
        field("preferred_name", "text-short", "Preferred name"),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number", { required: true, regulator: "NHS" }),
        field("address_previous", "address-uk", "Previous home address", { required: true }),
        field("admission_date", "date", "Date of admission", { required: true }),
        field("admission_source", "select-single", "Admitted from", {
          required: true,
          options: ["Own home", "Hospital", "Another care home", "Hospice", "Family member's home"],
        }),
        field("preferred_pronoun", "select-single", "Preferred pronoun", {
          options: ["She/her", "He/him", "They/them", "Other"],
        }),
        field("religion", "text-short", "Religion / faith"),
        field("ethnicity", "text-short", "Ethnicity"),
        field("first_language", "text-short", "First language"),
        field("interpreter_needed", "select-single", "Interpreter required?", {
          options: ["No", "Yes — BSL", "Yes — spoken language"],
        }),
      ],
    },
    {
      id: "contacts",
      name: "Key contacts",
      fields: [
        field("nok_name", "name-full", "Next of kin · name", { required: true }),
        field("nok_relationship", "text-short", "Relationship", { required: true }),
        field("nok_phone", "phone-uk", "Phone", { required: true }),
        field("nok_email", "email", "Email"),
        field("nok_address", "address-uk", "Address"),
        field("gp_name", "text-short", "GP name", { required: true }),
        field("gp_surgery", "text-short", "GP surgery", { required: true }),
        field("gp_phone", "phone-uk", "GP surgery phone"),
        field("lpa_health", "select-single", "Is there an LPA for health & welfare?", {
          required: true,
          options: ["No", "Yes — registered", "Yes — applied for"],
          regulator: "OPG",
        }),
        field("lpa_finance", "select-single", "Is there an LPA for property & financial affairs?", {
          required: true,
          options: ["No", "Yes — registered", "Yes — applied for"],
          regulator: "OPG",
        }),
        field("attorney_name", "name-full", "Attorney name (if LPA in place)"),
      ],
    },
    {
      id: "funding",
      name: "Funding & contract",
      fields: [
        field("funding_source", "select-single", "Primary funding source", {
          required: true,
          options: ["Self-funded", "Local authority", "NHS CHC (Continuing Healthcare)", "NHS-funded nursing care", "Mixed"],
        }),
        field("weekly_rate", "currency", "Agreed weekly fee (GBP)", { required: true }),
        field("la_assessor", "text-short", "LA care manager / NHS assessor name"),
        field("contract_signed", "consent-gdpr", "Resident agreement / contract has been signed.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "medical",
      name: "Medical & medication",
      fields: [
        field("diagnoses", "text-long", "Current diagnoses (include date)", { required: true }),
        field("allergies", "text-long", "Allergies (medications, foods, materials)", { required: true }),
        field("medication_list", "text-long", "Current medication (name, dose, frequency)", {
          required: true,
          validation: { maxLength: 3000 },
        }),
        field("medication_chart_upload", "file-upload", "Upload current MAR chart / medication list"),
        field("dnacpr", "select-single", "DNACPR / ReSPECT in place?", {
          required: true,
          options: ["No", "Yes — DNACPR", "Yes — ReSPECT plan", "Under discussion"],
          regulator: "CQC SAF",
        }),
        field("dnacpr_upload", "file-upload", "Upload DNACPR / ReSPECT (if held)"),
      ],
    },
    {
      id: "capacity",
      name: "Mental capacity & DoLS",
      fields: [
        field("capacity_screen", "select-single", "Does the resident have capacity to consent to admission?", {
          required: true,
          options: ["Yes — capacity present", "Fluctuating capacity", "Lacks capacity for this decision"],
          regulator: "MCA 2005",
        }),
        field("dols_status", "select-single", "DoLS authorisation status", {
          required: true,
          options: ["Not required — capacity present", "Required — application submitted", "Required — urgent in place", "Authorised — standard"],
          regulator: "DoLS / MCA 2005",
        }),
        field("best_interests", "text-long", "If lacking capacity, summary of best-interests decision"),
      ],
    },
    {
      id: "preferences",
      name: "Preferences & life history",
      fields: [
        field("daily_routine", "text-long", "Preferred daily routine (sleep, meals, baths)"),
        field("food_preferences", "text-long", "Food likes / dislikes / dietary needs"),
        field("hobbies", "text-long", "Hobbies, interests, what brings joy"),
        field("life_story", "text-long", "Brief life story / things to talk about", {
          validation: { maxLength: 2000 },
        }),
        field("important_people", "text-long", "Important people in the resident's life"),
        field("communication_needs", "text-long", "Communication needs (hearing aid, glasses, low-tech aids)"),
      ],
    },
    {
      id: "risk-screen",
      name: "Initial risk screens",
      fields: [
        field("falls_history", "select-single", "Falls in the last 12 months", {
          required: true,
          options: ["None", "1 fall", "2 falls", "3+ falls"],
          regulator: "NICE CG161",
        }),
        field("pressure_risk", "select-single", "Pressure ulcer risk — current skin integrity", {
          required: true,
          options: ["Intact", "Red / blanching", "Existing pressure ulcer (specify stage below)"],
          regulator: "EPUAP / NPIAP",
        }),
        field("malnutrition_risk", "select-single", "Malnutrition risk (MUST screen)", {
          required: true,
          options: ["Low (0)", "Medium (1)", "High (2+)"],
          regulator: "BAPEN MUST",
        }),
        field("continence_status", "select-single", "Continence", {
          options: ["Continent", "Occasional incontinence", "Frequent incontinence", "Catheter / stoma"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Consents & sign-off",
      fields: [
        field("data_consent", "consent-gdpr", "Consent for data processing under UK GDPR for care delivery.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 9(2)(h)",
        }),
        field("photo_consent", "consent-marketing", "Photographs of the resident may be used in care records and home displays."),
        field("information_sharing", "consent-gdpr", "Information may be shared with GP, hospital, pharmacist, NoK as needed.", {
          validation: { required: true },
        }),
        field("resident_signature", "signature", "Resident signature (if able)"),
        field("nok_signature", "signature", "Next of kin / attorney signature"),
        field("admitting_nurse_name", "name-full", "Admitting nurse / manager name", { required: true }),
        field("admitting_nurse_signature", "signature", "Admitting nurse signature", { required: true }),
        field("admission_signed_date", "date", "Date completed", { required: true }),
      ],
    },
  ],
});

export default RESIDENT_ADMISSION;
