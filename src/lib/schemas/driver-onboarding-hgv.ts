/**
 * Driver onboarding · HGV.
 *
 * Onboarding pack for HGV / LGV drivers joining a UK O-licence holder.
 * Captures identity, licence + CPC, tachograph card, medical, references,
 * drug & alcohol policy sign-off.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const DRIVER_ONBOARDING_HGV: PackSchema = toPackSchema({
  productId: "driver-onboarding-hgv",
  title: "Driver onboarding · HGV",
  pathways: [
    { id: "permanent", name: "Permanent employee" },
    { id: "agency", name: "Agency driver" },
    { id: "owner-operator", name: "Owner-operator / sub-contractor" },
  ],
  sections: [
    {
      id: "personal",
      name: "Personal details",
      fields: [
        field("full_name", "name-full", "Full legal name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("ni_number", "text-short", "National Insurance number", { required: true, regulator: "HMRC" }),
        field("address", "address-uk", "Home address", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Mobile", { required: true }),
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
      ],
    },
    {
      id: "licence",
      name: "Driving licence",
      fields: [
        field("licence_number", "text-short", "DVLA licence number", { required: true, regulator: "DVLA" }),
        field("licence_categories", "checkbox-group", "Categories held", {
          required: true,
          options: ["B (car)", "C1 (medium)", "C (HGV rigid)", "C+E (HGV artic)", "D1 (minibus)", "D (bus)"],
        }),
        field("licence_expiry", "date", "Photocard expiry", { required: true }),
        field("licence_endorsements", "text-long", "Endorsements / convictions in last 5 years"),
        field("licence_photo", "file-upload", "Upload photo of licence (both sides)", { required: true }),
        field("check_code", "text-short", "DVLA Share Driving Licence code (valid 21 days)", {
          required: true,
          regulator: "DVLA",
        }),
      ],
    },
    {
      id: "cpc-tacho",
      name: "Driver CPC & tachograph",
      fields: [
        field("dqc_number", "text-short", "Driver Qualification Card (DQC) number", { required: true, regulator: "DVSA" }),
        field("dqc_expiry", "date", "DQC expiry", { required: true }),
        field("cpc_hours_completed", "number", "CPC training hours completed this period", { validation: { min: 0, max: 35 } }),
        field("dqc_photo", "file-upload", "Upload DQC", { required: true }),
        field("tacho_card_number", "text-short", "Tachograph driver card number", { required: true }),
        field("tacho_card_expiry", "date", "Tacho card expiry", { required: true }),
        field("tacho_card_photo", "file-upload", "Upload tacho card", { required: true }),
      ],
    },
    {
      id: "medical-eyesight",
      name: "Medical & eyesight",
      fields: [
        field("medical_self_dec", "consent-gdpr", "I declare I meet the Group 2 medical standards and have notified DVLA of any relevant condition.", {
          validation: { required: true },
          regulator: "DVLA Group 2",
        }),
        field("eyesight_self_dec", "consent-gdpr", "My eyesight meets the Group 2 standard (with corrective lenses if applicable).", {
          validation: { required: true },
          regulator: "DVLA Group 2",
        }),
        field("conditions", "text-long", "Any condition that may affect driving (epilepsy, sleep apnoea, diabetes, cardiac)"),
        field("medical_evidence", "file-upload", "Upload most recent D4 medical certificate (if held)"),
      ],
    },
    {
      id: "history",
      name: "Driving history",
      fields: [
        field("years_held_c", "number", "Years held HGV C / C+E entitlement", { validation: { min: 0, max: 60 } }),
        field("accidents_5y", "select-single", "Any reportable accidents in last 5 years?", {
          required: true,
          options: ["No", "Yes — single", "Yes — multiple"],
        }),
        field("accidents_detail", "text-long", "If yes, details and outcomes"),
        field("traffic_offences", "text-long", "Traffic offences / fixed penalties in last 5 years"),
        field("previous_operators", "text-long", "Last 2 operators (name, role, dates, reason for leaving)"),
        field("references", "text-long", "Two referee contacts (name, role, email, phone)", { required: true }),
      ],
    },
    {
      id: "policies",
      name: "Policy sign-off",
      fields: [
        field("drug_alcohol", "consent-gdpr", "I have read and accept the drug & alcohol policy — random and for-cause testing applies.", {
          validation: { required: true },
        }),
        field("mobile_phone", "consent-gdpr", "I will not use a hand-held mobile phone while driving.", {
          validation: { required: true },
          regulator: "Road Vehicles Construction & Use 1986",
        }),
        field("drivers_hours", "consent-gdpr", "I will comply with UK/EU drivers' hours rules and accurate tachograph records.", {
          validation: { required: true },
          regulator: "EU/UK Drivers' Hours",
        }),
        field("incident_reporting", "consent-gdpr", "I will report incidents, near-misses, and roadside checks within 24 hours.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to the operator processing my data and conducting periodic DVLA licence checks.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default DRIVER_ONBOARDING_HGV;
