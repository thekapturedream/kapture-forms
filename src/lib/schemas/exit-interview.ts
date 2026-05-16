/**
 * Exit interview.
 *
 * Capture honest, structured feedback when an employee leaves. Used by
 * HR to spot patterns (manager, comp, culture, role fit) without making
 * the leaver feel ambushed.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const EXIT_INTERVIEW: PackSchema = toPackSchema({
  productId: "exit-interview",
  title: "Exit interview",
  pathways: [
    { id: "resignation", name: "Voluntary — resigned" },
    { id: "redundancy", name: "Redundancy" },
    { id: "end-of-contract", name: "End of fixed-term contract" },
    { id: "dismissal", name: "Dismissed" },
  ],
  sections: [
    {
      id: "leaver",
      name: "About your time here",
      fields: [
        field("full_name", "name-full", "Your name", { required: true }),
        field("role", "text-short", "Role on leaving", { required: true }),
        field("team", "text-short", "Team / department"),
        field("start_date", "date", "Start date"),
        field("end_date", "date", "Last working day", { required: true }),
        field("manager", "name-full", "Line manager"),
      ],
    },
    {
      id: "why-leaving",
      name: "Why are you leaving",
      fields: [
        field("primary_reason", "select-single", "Primary reason", {
          required: true,
          options: [
            "Better opportunity elsewhere",
            "Compensation",
            "Career growth",
            "Relationship with manager",
            "Relationship with team",
            "Workload / burnout",
            "Company direction or culture",
            "Personal / family",
            "Relocation",
            "Health",
            "Other",
          ],
        }),
        field("reason_detail", "text-long", "Tell us more — as much or as little as you want", {
          validation: { maxLength: 2000 },
        }),
        field("when_decided", "select-single", "When did you decide to leave?", {
          options: ["In the last month", "1–3 months ago", "3–6 months ago", "6–12 months ago", "Over a year ago"],
        }),
        field("could_we_have_kept_you", "text-long", "Could anything have changed your mind?"),
      ],
    },
    {
      id: "experience",
      name: "Your experience",
      fields: [
        field("rating_role", "rating-numeric", "Your role (0 = bad fit, 10 = great fit)"),
        field("rating_manager", "rating-numeric", "Relationship with your manager"),
        field("rating_team", "rating-numeric", "Relationship with your team"),
        field("rating_culture", "rating-numeric", "Company culture"),
        field("rating_comp", "rating-numeric", "Pay & benefits"),
        field("rating_growth", "rating-numeric", "Growth & development opportunities"),
        field("rating_workload", "rating-numeric", "Workload sustainability"),
        field("rating_leadership", "rating-numeric", "Senior leadership"),
      ],
    },
    {
      id: "qualitative",
      name: "Patterns",
      fields: [
        field("best_thing", "text-long", "Best thing about working here"),
        field("hardest_thing", "text-long", "Hardest thing about working here"),
        field("one_change", "text-long", "If you could change one thing, what would it be?"),
        field("would_recommend", "select-single", "Would you recommend us as an employer?", {
          required: true,
          options: ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"],
        }),
        field("recommend_reason", "text-long", "Why?"),
        field("would_return", "select-single", "Would you consider coming back?", {
          options: ["Yes", "Maybe — under different circumstances", "No"],
        }),
      ],
    },
    {
      id: "next",
      name: "What's next",
      fields: [
        field("next_role", "text-short", "Where are you going (if comfortable sharing)?"),
        field("references", "select-single", "Are you happy for us to be a reference?", {
          options: ["Yes — any role", "Yes — only if asked specifically", "No"],
        }),
        field("alumni_network", "consent-marketing", "Add me to your alumni network (occasional updates, alumni events)."),
      ],
    },
    {
      id: "consent",
      name: "Submit",
      fields: [
        field("share_with_manager", "select-single", "Can we share your feedback with your manager?", {
          required: true,
          options: ["Yes — share my name", "Share anonymously", "No — HR only, aggregated"],
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default EXIT_INTERVIEW;
