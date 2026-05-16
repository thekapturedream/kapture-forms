/**
 * Tradesperson site visit.
 *
 * For builders, electricians, plumbers, decorators, locksmiths, roofers,
 * gardeners. Captures the customer, the property, the job, urgency, and
 * access details so the trade can prepare an accurate quote.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const TRADESPERSON_SITE_VISIT: PackSchema = toPackSchema({
  productId: "tradesperson-site-visit",
  title: "Tradesperson site visit",
  pathways: [
    { id: "emergency", name: "Emergency / urgent" },
    { id: "quote", name: "Site visit & quote" },
    { id: "scheduled", name: "Scheduled job" },
  ],
  sections: [
    {
      id: "customer",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Your name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("preferred_contact", "select-single", "Preferred contact method", {
          required: true,
          options: ["Phone", "Text / WhatsApp", "Email"],
        }),
      ],
    },
    {
      id: "property",
      name: "The property",
      fields: [
        field("address", "address-uk", "Property address", { required: true }),
        field("property_type", "select-single", "Property type", {
          required: true,
          options: ["House — detached", "House — semi-detached", "House — terraced", "Flat / apartment", "Bungalow", "Commercial unit", "Outbuilding / garage"],
        }),
        field("ownership", "select-single", "Ownership status", {
          required: true,
          options: ["I own and live there", "I own and rent it out (landlord)", "I rent (tenant — landlord aware)", "I rent (tenant — emergency)", "Other"],
        }),
        field("parking", "select-single", "Parking on or near the property?", {
          options: ["On driveway", "Free street parking", "Paid street parking", "Difficult — please advise"],
        }),
      ],
    },
    {
      id: "job",
      name: "The job",
      fields: [
        field("trade_needed", "select-single", "What trade do you need?", {
          required: true,
          options: [
            "Plumbing",
            "Electrical",
            "Heating / gas",
            "Roofing",
            "Building / extension",
            "Decorating",
            "Carpentry / joinery",
            "Tiling",
            "Plastering",
            "Locksmith",
            "Gardening / landscaping",
            "Cleaning",
            "Other (describe below)",
          ],
        }),
        field("job_summary", "text-long", "Describe the job", {
          required: true,
          placeholder: "What needs doing? Include any details that help us scope (sizes, room count, current state).",
          validation: { maxLength: 1500 },
        }),
        field("photos", "file-multi", "Photos of the issue (helpful for accurate quotes)"),
        field("ideal_completion", "date", "Ideal completion date"),
        field("urgency", "select-single", "Urgency", {
          required: true,
          options: [
            "Emergency — same day",
            "Urgent — within 48 hours",
            "Within a week",
            "Within a month",
            "Flexible",
          ],
        }),
      ],
    },
    {
      id: "access",
      name: "Site access",
      fields: [
        field("access_arrangements", "select-single", "How will the tradesperson get in?", {
          required: true,
          options: [
            "I'll be there",
            "Someone else will be there",
            "Key safe — I'll share the code",
            "Letting agent / property manager",
            "Needs to be arranged",
          ],
        }),
        field("access_notes", "text-long", "Access notes (gate codes, parking permits, narrow lanes, dogs on site, etc.)"),
        field("water_off", "select-single", "Is the water / power currently isolated?", {
          options: ["No — everything on", "Water off", "Power off at the affected circuit", "Power off completely", "Not applicable"],
        }),
      ],
    },
    {
      id: "budget",
      name: "Budget & insurance",
      fields: [
        field("budget", "currency", "Approximate budget (GBP, optional)"),
        field("insurance_claim", "select-single", "Is this an insurance claim?", {
          required: true,
          options: ["No", "Yes — claim approved", "Yes — gathering quotes for the claim"],
        }),
        field("vat_invoice", "select-single", "Do you need a VAT invoice?", {
          options: ["No", "Yes — for personal records", "Yes — business account"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Submit request",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being used to handle this job.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me reminders about regular maintenance."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default TRADESPERSON_SITE_VISIT;
