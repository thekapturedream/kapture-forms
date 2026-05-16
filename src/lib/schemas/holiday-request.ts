/**
 * Holiday request.
 *
 * Universal annual-leave request for UK employers. Includes the cover
 * + handover prompts that make holidays painless for everyone.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const HOLIDAY_REQUEST: PackSchema = toPackSchema({
  productId: "holiday-request",
  title: "Holiday request",
  pathways: [
    { id: "annual", name: "Annual leave" },
    { id: "unpaid", name: "Unpaid leave" },
    { id: "tofl", name: "Time off in lieu (TOIL)" },
  ],
  sections: [
    {
      id: "employee",
      name: "Employee",
      fields: [
        field("employee_name", "name-full", "Your name", { required: true }),
        field("role", "text-short", "Role"),
        field("team", "text-short", "Team / department"),
        field("manager_name", "name-full", "Line manager", { required: true }),
        field("manager_email", "email", "Line manager · email", { required: true }),
      ],
    },
    {
      id: "dates",
      name: "Dates",
      fields: [
        field("first_day_off", "date", "First day off", { required: true }),
        field("return_to_work", "date", "First day back at work", { required: true }),
        field("days_requested", "number", "Working days requested", {
          required: true,
          help: "Don't include weekends or bank holidays.",
          validation: { min: 0.5, max: 60 },
        }),
        field("part_day", "select-single", "Part-day request?", {
          options: ["No — full days", "Morning of first day", "Afternoon of first day", "Morning of last day", "Afternoon of last day"],
        }),
      ],
    },
    {
      id: "cover",
      name: "Cover & handover",
      intro: "Tell us how things will run while you're away.",
      fields: [
        field("cover_name", "name-full", "Who's covering for you?"),
        field("cover_confirmed", "select-single", "Have they agreed?", {
          options: ["Yes", "Not yet — will confirm before approval", "No cover needed for this period"],
        }),
        field("urgent_matters", "text-long", "Anything urgent that may come up while you're away?"),
        field("contactable", "select-single", "Can you be contacted if essential?", {
          required: true,
          options: ["Yes — email only", "Yes — phone only", "Yes — either", "No — fully off"],
        }),
        field("handover_doc", "file-upload", "Upload handover doc (optional)"),
      ],
    },
    {
      id: "balance",
      name: "Leave balance",
      fields: [
        field("days_taken_ytd", "number", "Days taken so far this year"),
        field("days_remaining", "number", "Days remaining (your records)"),
        field("buy_sell", "select-single", "Buy or sell leave?", {
          options: ["No — standard request", "Buy extra leave", "Sell back leave"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Submit",
      fields: [
        field("acknowledgement", "consent-gdpr", "I understand approval is subject to operational needs and team cover.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date submitted", { required: true }),
      ],
    },
  ],
});

export default HOLIDAY_REQUEST;
