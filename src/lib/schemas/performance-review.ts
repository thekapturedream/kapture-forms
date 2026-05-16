/**
 * Performance review.
 *
 * Annual or quarterly review pack. Two pathways — self-review and
 * manager-review — collected separately, then merged into the final
 * record by the runner. Includes goals, ratings, development.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const PERFORMANCE_REVIEW: PackSchema = toPackSchema({
  productId: "performance-review",
  title: "Performance review",
  pathways: [
    { id: "self", name: "Self-review (employee)" },
    { id: "manager", name: "Manager review" },
    { id: "calibration", name: "Calibration / moderation" },
  ],
  sections: [
    {
      id: "context",
      name: "Review context",
      fields: [
        field("employee_name", "name-full", "Employee name", { required: true }),
        field("employee_role", "text-short", "Role", { required: true }),
        field("team", "text-short", "Team / department"),
        field("manager_name", "name-full", "Line manager", { required: true }),
        field("review_period", "text-short", "Review period", {
          required: true,
          placeholder: "e.g. Jan–Dec 2026",
        }),
        field("review_type", "select-single", "Review type", {
          required: true,
          options: ["Annual", "Mid-year", "Quarterly", "Project end", "Probation"],
        }),
      ],
    },
    {
      id: "achievements",
      name: "What went well",
      fields: [
        field("top_achievements", "text-long", "Top 3 achievements this period", {
          required: true,
          placeholder: "Quantify where possible. What did you ship, drive, or change?",
          validation: { maxLength: 2000 },
        }),
        field("impact", "text-long", "Impact — for the team, for the business, for customers"),
        field("collaboration", "text-long", "Where collaboration went well"),
      ],
    },
    {
      id: "challenges",
      name: "What didn't",
      fields: [
        field("challenges", "text-long", "Challenges or setbacks this period", {
          validation: { maxLength: 1500 },
        }),
        field("blockers", "text-long", "Blockers outside your control"),
        field("lessons", "text-long", "What you'd do differently"),
      ],
    },
    {
      id: "goals",
      name: "Goals review",
      fields: [
        field("prior_goals", "text-long", "Goals set at the last review — and how they went", {
          placeholder: "List each goal, then briefly: met / partially met / missed and why.",
          validation: { maxLength: 2500 },
        }),
        field("next_goals", "text-long", "Goals for the next review period", {
          required: true,
          placeholder: "Specific, measurable, time-bound.",
          validation: { maxLength: 2500 },
        }),
      ],
    },
    {
      id: "rating",
      name: "Overall rating",
      fields: [
        field("self_rating", "select-single", "Overall self-rating", {
          options: [
            "Significantly above expectations",
            "Above expectations",
            "Meets expectations",
            "Below expectations",
            "Significantly below expectations",
          ],
        }),
        field("manager_rating", "select-single", "Manager rating", {
          options: [
            "Significantly above expectations",
            "Above expectations",
            "Meets expectations",
            "Below expectations",
            "Significantly below expectations",
          ],
        }),
        field("rating_rationale", "text-long", "Rationale for the rating"),
      ],
    },
    {
      id: "development",
      name: "Development",
      fields: [
        field("strengths", "text-long", "Strengths to lean into"),
        field("growth_areas", "text-long", "Growth areas to focus on"),
        field("development_actions", "text-long", "Development actions for the next period", {
          placeholder: "Training, mentoring, projects, exposure.",
        }),
        field("career_aspirations", "text-long", "Career aspirations — 1, 3, 5 years"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("employee_signature", "signature", "Employee signature", { required: true }),
        field("employee_date", "date", "Date", { required: true }),
        field("manager_signature", "signature", "Manager signature"),
        field("manager_date", "date", "Manager date"),
      ],
    },
  ],
});

export default PERFORMANCE_REVIEW;
