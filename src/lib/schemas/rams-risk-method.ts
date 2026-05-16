/**
 * RAMS · risk + method.
 *
 * Risk Assessment + Method Statement for any UK construction or site
 * task. CDM 2015 + HSE-aligned. Captures the task, hazards, controls,
 * PPE, sequence, and sign-off.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const RAMS_RISK_METHOD: PackSchema = toPackSchema({
  productId: "rams-risk-method",
  title: "RAMS · risk + method",
  pathways: [
    { id: "general-build", name: "General building works" },
    { id: "demolition", name: "Demolition / strip-out" },
    { id: "electrical", name: "Electrical works" },
    { id: "working-at-height", name: "Working at height" },
    { id: "confined-space", name: "Confined space" },
  ],
  sections: [
    {
      id: "project",
      name: "Project & contractor",
      fields: [
        field("project_name", "text-short", "Project name", { required: true }),
        field("site_address", "address-uk", "Site address", { required: true }),
        field("principal_contractor", "text-short", "Principal contractor", { required: true, regulator: "CDM 2015" }),
        field("contractor_name", "text-short", "Contractor preparing this RAMS", { required: true }),
        field("supervisor_name", "name-full", "Site supervisor", { required: true }),
        field("supervisor_phone", "phone-uk", "Supervisor phone", { required: true }),
        field("ref_number", "text-short", "RAMS reference", { required: true }),
        field("date_prepared", "date", "Date prepared", { required: true }),
        field("review_date", "date", "Next review date", { required: true }),
      ],
    },
    {
      id: "task",
      name: "Task description",
      fields: [
        field("task_summary", "text-long", "Task summary", {
          required: true,
          placeholder: "What is being done, where, and over what duration?",
          validation: { maxLength: 1500 },
        }),
        field("personnel_count", "number", "Number of operatives on task", { required: true }),
        field("estimated_duration", "text-short", "Estimated duration", {
          required: true,
          placeholder: "e.g. 3 days, intermittent over 2 weeks",
        }),
        field("equipment", "text-long", "Plant / tools / equipment in use", { required: true }),
        field("materials", "text-long", "Materials in use (note any COSHH-relevant)"),
      ],
    },
    {
      id: "hazards",
      name: "Hazards & risk assessment",
      intro:
        "For each significant hazard, set Severity (1–5) × Likelihood (1–5) = Risk Rating, then re-score with controls applied.",
      fields: [
        field("hazards_list", "text-long", "Identified hazards (one per line)", {
          required: true,
          placeholder: "e.g. Working at height >2m — fall risk\nDust inhalation\nManual handling — back injury\nElectrical contact",
          validation: { maxLength: 3000 },
        }),
        field("persons_at_risk", "checkbox-group", "Persons at risk", {
          required: true,
          options: ["Operatives on task", "Other site workers", "Visitors", "Members of public", "Vulnerable persons (children, elderly)"],
        }),
        field("initial_rating", "text-long", "Initial risk rating (before controls)", {
          placeholder: "e.g. Fall: S=5 × L=3 = 15 (High)",
        }),
      ],
    },
    {
      id: "controls",
      name: "Control measures",
      fields: [
        field("hierarchy_controls", "text-long", "Controls applied (follow hierarchy: eliminate → substitute → engineering → admin → PPE)", {
          required: true,
          validation: { maxLength: 3000 },
        }),
        field("residual_rating", "text-long", "Residual risk rating (after controls)", {
          required: true,
        }),
        field("ppe_required", "checkbox-group", "PPE required", {
          required: true,
          options: [
            "Hard hat",
            "Safety boots",
            "Hi-vis vest / jacket",
            "Eye protection",
            "Ear protection",
            "Dust mask / RPE",
            "Gloves",
            "Harness (fall arrest)",
            "Cut-resistant gear",
            "Hot works PPE",
          ],
        }),
        field("permits_required", "checkbox-group", "Permits required", {
          options: ["None", "Hot works", "Confined space", "Working at height", "Excavation", "Lift plan (LOLER)", "Electrical isolation"],
        }),
      ],
    },
    {
      id: "method",
      name: "Method statement (sequence)",
      fields: [
        field("sequence", "text-long", "Step-by-step sequence of work", {
          required: true,
          placeholder:
            "1. Site arrival & sign-in\n2. Brief team & confirm permits\n3. Set up exclusion zone & signage\n4. …\n5. Final clean & sign-out",
          validation: { maxLength: 4000 },
        }),
        field("emergency_procedure", "text-long", "Emergency procedure (incident, injury, evacuation)", {
          required: true,
        }),
        field("first_aider", "name-full", "On-site first aider"),
        field("nearest_hospital", "text-short", "Nearest A&E"),
      ],
    },
    {
      id: "briefing",
      name: "Briefing & sign-off",
      intro: "All operatives must read and sign before starting.",
      fields: [
        field("briefing_date", "date", "Date briefed", { required: true }),
        field("operative_signatures", "text-long", "Operatives briefed (name + signature)", {
          required: true,
          placeholder: "Capture per operative — name, role, signature, date.",
        }),
        field("supervisor_signature", "signature", "Supervisor signature", { required: true }),
        field("supervisor_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default RAMS_RISK_METHOD;
