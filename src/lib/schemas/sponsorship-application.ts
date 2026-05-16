/**
 * Sponsorship application.
 *
 * For brands / corporates receiving sponsorship asks from events, sports
 * teams, charities, creators, festivals, individual athletes. Captures
 * the property, audience, ask, deliverables, and previous track record.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const SPONSORSHIP_APPLICATION: PackSchema = toPackSchema({
  productId: "sponsorship-application",
  title: "Sponsorship application",
  pathways: [
    { id: "event", name: "Event or festival" },
    { id: "team", name: "Sports team / club" },
    { id: "individual", name: "Individual (athlete, artist, creator)" },
    { id: "cause", name: "Charity / cause" },
  ],
  sections: [
    {
      id: "applicant",
      name: "About you",
      fields: [
        field("org_name", "text-short", "Organisation / individual name", { required: true }),
        field("contact_name", "name-full", "Primary contact name", { required: true }),
        field("contact_role", "text-short", "Their role"),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("website", "url", "Website"),
        field("socials", "text-long", "Social handles (one per line, with platform)"),
      ],
    },
    {
      id: "property",
      name: "What you're proposing",
      fields: [
        field("property_name", "text-short", "Event / property name", { required: true }),
        field("summary", "text-long", "One-paragraph summary", {
          required: true,
          validation: { maxLength: 800 },
        }),
        field("date_or_window", "text-short", "Date / window", {
          required: true,
          placeholder: "e.g. 12 June 2027, or 'July–September 2027 season'",
        }),
        field("location", "text-short", "Location"),
        field("history", "text-long", "Previous editions / track record", {
          placeholder: "How long has this run? Notable achievements?",
        }),
      ],
    },
    {
      id: "audience",
      name: "Audience reach",
      fields: [
        field("attendees", "number", "Live audience size (attendees / participants)"),
        field("digital_reach", "number", "Digital reach (followers + monthly views)"),
        field("audience_age", "checkbox-group", "Audience age bands", {
          options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"],
        }),
        field("audience_split", "select-single", "Gender split", {
          options: ["Mostly female", "Mostly male", "Roughly even", "Mixed / non-binary inclusive"],
        }),
        field("audience_demo", "text-long", "Audience demographic / psychographic notes"),
      ],
    },
    {
      id: "ask",
      name: "The ask",
      fields: [
        field("amount", "currency", "Cash sponsorship requested (GBP)", { required: true }),
        field("in_kind", "text-long", "In-kind support requested"),
        field("tiers_offered", "text-long", "Sponsorship tiers offered", {
          placeholder: "e.g. Headline £25k, Major £10k, Supporter £2.5k — describe each.",
          required: true,
        }),
        field("exclusivity", "select-single", "Exclusivity offered", {
          options: ["Full category exclusivity", "Sector exclusivity at top tier", "Non-exclusive"],
        }),
      ],
    },
    {
      id: "deliverables",
      name: "Deliverables",
      fields: [
        field("brand_presence", "checkbox-group", "Brand presence offered", {
          options: [
            "Logo on event marketing",
            "Logo on participant gear",
            "On-stage / venue signage",
            "Social posts (specify cadence)",
            "Press release inclusion",
            "Hospitality / tickets",
            "Speaking slot",
            "Product placement",
            "Email database access (opt-in)",
            "Sampling on site",
          ],
        }),
        field("data_capture", "text-long", "What data capture and reporting is offered to the sponsor?"),
        field("activation_ideas", "text-long", "Ideas for sponsor activation"),
      ],
    },
    {
      id: "fit",
      name: "Brand fit",
      fields: [
        field("why_this_brand", "text-long", "Why this brand specifically?", {
          required: true,
          validation: { maxLength: 1200 },
        }),
        field("previous_sponsors", "text-long", "Previous sponsors and testimonials"),
        field("attachments", "file-multi", "Upload deck / sponsorship pack / case studies"),
      ],
    },
    {
      id: "consent",
      name: "Submit",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being used to evaluate this proposal.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default SPONSORSHIP_APPLICATION;
