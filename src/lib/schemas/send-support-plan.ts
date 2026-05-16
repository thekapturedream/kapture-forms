/**
 * SEND support plan.
 *
 * In-school support plan for pupils with special educational needs and
 * disabilities under the SEND Code of Practice 2015. Sits below EHCP
 * but above one-off classroom adjustments — covers the assess–plan–
 * do–review cycle.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const SEND_SUPPORT_PLAN: PackSchema = toPackSchema({
  productId: "send-support-plan",
  title: "SEND support plan",
  pathways: [
    { id: "initial", name: "Initial plan (first cycle)" },
    { id: "review", name: "Termly review" },
    { id: "annual", name: "Annual / phase transition review" },
  ],
  sections: [
    {
      id: "pupil",
      name: "Pupil",
      fields: [
        field("pupil_name", "name-full", "Pupil name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("year_group", "text-short", "Year group", { required: true }),
        field("class_teacher", "name-full", "Class / form teacher", { required: true }),
        field("senco", "name-full", "SENCO", { required: true }),
        field("plan_start_date", "date", "Plan start date", { required: true }),
        field("plan_review_date", "date", "Plan review date", { required: true }),
      ],
    },
    {
      id: "assess",
      name: "Assess — needs identified",
      intro:
        "Under the SEND Code of Practice, identify primary and secondary need from the four broad areas.",
      fields: [
        field("primary_need", "select-single", "Primary area of need", {
          required: true,
          options: [
            "Communication and interaction",
            "Cognition and learning",
            "Social, emotional and mental health",
            "Sensory and / or physical",
          ],
          regulator: "SEND Code of Practice 2015",
        }),
        field("secondary_need", "select-single", "Secondary area of need (if any)", {
          options: [
            "None",
            "Communication and interaction",
            "Cognition and learning",
            "Social, emotional and mental health",
            "Sensory and / or physical",
          ],
        }),
        field("diagnoses", "text-long", "Diagnoses (where formally given) + date"),
        field("evidence", "text-long", "Evidence supporting need (assessments, observations, attainment data)", {
          required: true,
          validation: { maxLength: 2000 },
        }),
        field("pupil_voice", "text-long", "Pupil voice — what does the pupil say helps them learn?", {
          required: true,
        }),
        field("parent_voice", "text-long", "Parent / carer voice — what do they want their child to achieve?", {
          required: true,
        }),
      ],
    },
    {
      id: "plan",
      name: "Plan — outcomes & provision",
      fields: [
        field("outcomes", "text-long", "SMART outcomes for this cycle (one per line)", {
          required: true,
          placeholder:
            "e.g. By the end of Spring term, Alex will read and discuss 4 fiction books at age-appropriate level with 80% comprehension.",
          validation: { maxLength: 2500 },
        }),
        field("classroom_adjustments", "text-long", "Quality-first teaching adjustments", {
          required: true,
        }),
        field("additional_provision", "text-long", "Additional provision (interventions, small group, 1:1)", {
          required: true,
        }),
        field("provision_frequency", "text-short", "Frequency", {
          placeholder: "e.g. 3 × 20-minute Reading Recovery sessions per week",
        }),
        field("staff_responsible", "text-long", "Staff responsible for delivery"),
        field("resources", "text-long", "Resources required (equipment, software, training)"),
        field("external_agencies", "text-long", "External professionals involved (EP, SALT, OT, CAMHS)"),
      ],
    },
    {
      id: "do",
      name: "Do — implementation log",
      fields: [
        field("log_summary", "text-long", "Summary of what's been delivered this cycle"),
        field("attendance", "text-short", "Attendance for the cycle (%)"),
        field("engagement", "select-single", "Engagement in support", {
          options: ["Excellent", "Good", "Some difficulty", "Significant difficulty", "Refused / disengaged"],
        }),
      ],
    },
    {
      id: "review",
      name: "Review — outcomes & next steps",
      fields: [
        field("outcome_progress", "text-long", "Progress against each outcome", {
          placeholder: "Met / partially met / not yet — with evidence.",
          required: true,
          validation: { maxLength: 2500 },
        }),
        field("attainment_data", "text-long", "Attainment data points (reading age, scores, assessments)"),
        field("pupil_reflection", "text-long", "Pupil's reflection on the cycle"),
        field("parent_reflection", "text-long", "Parent / carer reflection"),
        field("next_action", "select-single", "Next action", {
          required: true,
          options: [
            "Continue current plan",
            "Adjust plan — escalate provision",
            "Adjust plan — reduce provision",
            "Move to EHCP request",
            "Exit SEND support — needs met",
          ],
          regulator: "SEND Code of Practice 2015",
        }),
        field("next_action_detail", "text-long", "Detail / rationale for next action"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("senco_signature", "signature", "SENCO signature", { required: true }),
        field("teacher_signature", "signature", "Class teacher signature", { required: true }),
        field("parent_signature", "signature", "Parent / carer signature", { required: true }),
        field("pupil_signature", "signature", "Pupil signature (where age-appropriate)"),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default SEND_SUPPORT_PLAN;
