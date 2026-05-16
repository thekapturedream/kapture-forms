/**
 * Site induction.
 *
 * Mandatory induction record for every operative arriving on a UK
 * construction site under CDM 2015. Captures identity, qualifications,
 * site-specific briefing topics, and emergency awareness.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const SITE_INDUCTION: PackSchema = toPackSchema({
  productId: "site-induction",
  title: "Site induction",
  pathways: [
    { id: "operative", name: "Operative / tradesperson" },
    { id: "supervisor", name: "Supervisor / manager" },
    { id: "visitor", name: "Visitor / delivery" },
  ],
  sections: [
    {
      id: "personal",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true, regulator: "CDM 2015" }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("company", "text-short", "Employer / company", { required: true }),
        field("role", "text-short", "Role on site", { required: true }),
        field("phone", "phone-uk", "Mobile", { required: true }),
        field("emergency_contact_name", "name-full", "Emergency contact name", { required: true }),
        field("emergency_contact_phone", "phone-uk", "Emergency contact phone", { required: true }),
        field("medical_conditions", "text-long", "Any medical conditions we should know about?"),
      ],
    },
    {
      id: "qualifications",
      name: "Qualifications & competence",
      fields: [
        field("cscs_card", "text-short", "CSCS card number", { required: true }),
        field("cscs_type", "select-single", "CSCS card type", {
          required: true,
          options: ["Green — Labourer", "Blue — Skilled Worker", "Gold — Skilled Worker / Supervisor", "Black — Management", "Yellow — Visitor", "White — Trainee", "Other"],
        }),
        field("cscs_expiry", "date", "CSCS expiry", { required: true }),
        field("cscs_upload", "file-upload", "Upload CSCS card photo", { required: true }),
        field("other_quals", "text-long", "Other relevant qualifications (SMSTS, IPAF, PASMA, first aid, etc.)"),
        field("trade_specific", "text-long", "Trade-specific qualifications (gas safe number, NICEIC, etc.)"),
      ],
    },
    {
      id: "site-brief",
      name: "Site-specific brief",
      intro: "Tick to confirm you've been briefed on each.",
      fields: [
        field("brief_emergency", "consent-gdpr", "Emergency procedures, assembly points, fire alarm.", {
          validation: { required: true },
        }),
        field("brief_first_aid", "consent-gdpr", "First-aiders, first-aid kit locations.", {
          validation: { required: true },
        }),
        field("brief_welfare", "consent-gdpr", "Welfare facilities (toilets, drying room, break area).", {
          validation: { required: true },
        }),
        field("brief_traffic", "consent-gdpr", "Site traffic management and pedestrian routes.", {
          validation: { required: true },
        }),
        field("brief_ppe", "consent-gdpr", "PPE requirements — hard hat, boots, hi-vis, plus task-specific.", {
          validation: { required: true },
        }),
        field("brief_hazards", "consent-gdpr", "Current site-specific hazards (asbestos, working at height, deep excavations).", {
          validation: { required: true },
        }),
        field("brief_permits", "consent-gdpr", "Permits-to-work system and authorisation.", {
          validation: { required: true },
        }),
        field("brief_environmental", "consent-gdpr", "Environmental controls (noise, dust, spillage, waste).", {
          validation: { required: true },
        }),
        field("brief_drugs_alcohol", "consent-gdpr", "Drug & alcohol policy — zero tolerance, random testing may apply.", {
          validation: { required: true },
        }),
        field("brief_reporting", "consent-gdpr", "How to report near-misses, accidents and concerns.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "specific-risks",
      name: "Site-specific risks today",
      fields: [
        field("active_hazards", "text-long", "Active hazards on site today (briefer fills this)", {
          placeholder: "e.g. Crane lift in west zone 10:00–12:00; live electrics on floor 3; asbestos removal area cordoned off.",
        }),
        field("restricted_areas", "text-long", "Restricted / no-go areas"),
        field("worker_acknowledgement", "consent-gdpr", "I have been briefed on today's specific hazards and restricted areas.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("worker_signature", "signature", "Worker signature", { required: true }),
        field("worker_date", "date", "Date", { required: true }),
        field("inductor_name", "name-full", "Inductor name", { required: true }),
        field("inductor_role", "text-short", "Inductor role", { required: true }),
        field("inductor_signature", "signature", "Inductor signature", { required: true }),
        field("induction_valid_until", "date", "Induction valid until", { required: true }),
      ],
    },
  ],
});

export default SITE_INDUCTION;
