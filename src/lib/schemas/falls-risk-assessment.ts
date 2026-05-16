/**
 * Falls risk assessment.
 *
 * FRAT-style multifactorial falls risk assessment per NICE CG161.
 * Captures history, intrinsic factors, extrinsic factors, and the
 * action plan that follows from the score band.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const FALLS_RISK_ASSESSMENT: PackSchema = toPackSchema({
  productId: "falls-risk-assessment",
  title: "Falls risk assessment",
  pathways: [
    { id: "care-home", name: "Care home resident" },
    { id: "community", name: "Community-dwelling adult" },
    { id: "hospital", name: "Hospital inpatient" },
    { id: "post-fall", name: "Post-fall investigation" },
  ],
  sections: [
    {
      id: "person",
      name: "Person",
      fields: [
        field("name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number"),
        field("assessment_date", "date", "Date of assessment", { required: true }),
        field("location", "select-single", "Location of assessment", {
          required: true,
          options: ["Care home", "Patient's home", "Hospital ward", "Outpatient clinic", "Community day centre"],
        }),
        field("assessor_name", "name-full", "Assessor name", { required: true }),
        field("assessor_role", "text-short", "Assessor role", { required: true }),
      ],
    },
    {
      id: "history",
      name: "Falls history",
      fields: [
        field("falls_12m", "select-single", "Number of falls in last 12 months", {
          required: true,
          options: ["None", "1", "2", "3+"],
          regulator: "NICE CG161",
        }),
        field("falls_describe", "text-long", "Describe the falls (when, where, how, injury)"),
        field("near_misses", "select-single", "Near-misses in last 3 months", {
          options: ["None", "1", "2+", "Unknown"],
        }),
        field("fear_of_falling", "rating-numeric", "Fear of falling (0 = none, 10 = severe)"),
      ],
    },
    {
      id: "intrinsic",
      name: "Intrinsic factors",
      intro: "Score each yes = 1. Total contributes to the band.",
      fields: [
        field("muscle_weakness", "select-single", "Lower-limb muscle weakness", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("balance_problems", "select-single", "Balance / gait problems (observe walk + turn)", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("visual_impairment", "select-single", "Visual impairment (cataracts, low vision, recent change)", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("polypharmacy", "select-single", "On 4+ medications, or any sedating / hypotensive drug", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("postural_hypotension", "select-single", "Postural hypotension (BP drop ≥20/10 mmHg on standing)", {
          options: ["No", "Yes", "Not assessed"],
        }),
        field("cognitive_impairment", "select-single", "Cognitive impairment / delirium", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("urinary_urgency", "select-single", "Urinary urgency / incontinence", {
          options: ["No", "Yes"],
        }),
        field("foot_problems", "select-single", "Foot problems / ill-fitting footwear", {
          options: ["No", "Yes"],
        }),
        field("continence_status", "text-short", "Continence status detail"),
        field("conditions_relevant", "text-long", "Conditions affecting falls risk (Parkinson's, stroke, osteoporosis, neuropathy)"),
      ],
    },
    {
      id: "extrinsic",
      name: "Extrinsic factors (environment)",
      fields: [
        field("env_loose_rugs", "select-single", "Loose rugs / trip hazards", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("env_lighting", "select-single", "Poor lighting (especially stairs / bathroom at night)", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("env_stairs_handrails", "select-single", "Stairs without handrails on both sides", {
          options: ["No", "Yes", "N/A"],
        }),
        field("env_bathroom", "select-single", "Bathroom without grab rails", {
          options: ["No", "Yes"],
        }),
        field("env_clutter", "select-single", "Clutter on floors / walkways", {
          options: ["No", "Yes"],
        }),
        field("env_other", "text-long", "Other environmental concerns"),
      ],
    },
    {
      id: "score",
      name: "Score & band",
      fields: [
        field("score_total", "number", "Total intrinsic + extrinsic score", {
          required: true,
          help: "Count 'Yes' answers across both factor sections.",
          validation: { min: 0, max: 30 },
        }),
        field("risk_band", "select-single", "Risk band", {
          required: true,
          options: ["Low (0–4)", "Medium (5–9)", "High (10+)"],
        }),
      ],
    },
    {
      id: "action",
      name: "Action plan",
      fields: [
        field("interventions", "checkbox-group", "Interventions agreed", {
          required: true,
          options: [
            "Medication review by GP / pharmacist",
            "Refer to physiotherapy (strength / balance)",
            "Refer to occupational therapy (home assessment)",
            "Vision review (optician)",
            "Footwear assessment",
            "Vitamin D supplementation",
            "Bone-health review (DEXA / fracture risk)",
            "Continence assessment",
            "Falls prevention exercise (Otago)",
            "Environmental modifications (handrails, lighting, declutter)",
            "Pendant alarm / telecare",
            "Bed / chair sensor",
            "Hip protectors",
          ],
          regulator: "NICE CG161",
        }),
        field("action_owner", "text-long", "Who is responsible for each intervention?"),
        field("review_date", "date", "Review date", { required: true }),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("person_acknowledgement", "consent-gdpr", "The person (or NoK) has been informed of the risk band and action plan."),
        field("assessor_signature", "signature", "Assessor signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default FALLS_RISK_ASSESSMENT;
