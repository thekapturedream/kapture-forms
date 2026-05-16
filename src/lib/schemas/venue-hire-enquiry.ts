/**
 * Venue hire enquiry.
 *
 * For halls, studios, meeting rooms, sports facilities, community
 * spaces. Captures the booking type, date, AV / catering needs, and
 * liability fields the operator needs before issuing a quote.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const VENUE_HIRE_ENQUIRY: PackSchema = toPackSchema({
  productId: "venue-hire-enquiry",
  title: "Venue hire enquiry",
  pathways: [
    { id: "one-off", name: "One-off booking" },
    { id: "recurring", name: "Recurring booking" },
    { id: "private-event", name: "Private event (party / wedding)" },
  ],
  sections: [
    {
      id: "contact",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Your name", { required: true }),
        field("org_name", "text-short", "Organisation (if any)"),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Billing address"),
      ],
    },
    {
      id: "event",
      name: "About the event",
      fields: [
        field("event_type", "select-single", "Event type", {
          required: true,
          options: [
            "Meeting / workshop",
            "Conference",
            "Training session",
            "Performance / show",
            "Wedding / reception",
            "Birthday / private party",
            "Funeral / memorial",
            "Sports / fitness",
            "Class / course",
            "Other",
          ],
        }),
        field("event_title", "text-short", "Event title", { required: true }),
        field("event_description", "text-long", "Describe the event (one paragraph)", {
          required: true,
          validation: { maxLength: 800 },
        }),
        field("attendee_count", "number", "Expected attendees", {
          required: true,
          validation: { min: 1, max: 5000 },
        }),
        field("public_or_private", "select-single", "Public or private?", {
          required: true,
          options: ["Public — tickets sold", "Public — free entry", "Private — invite only"],
        }),
      ],
    },
    {
      id: "dates",
      name: "When",
      fields: [
        field("preferred_date", "date", "Preferred date", { required: true }),
        field("alt_date", "date", "Alternative date"),
        field("start_time", "time", "Start time", { required: true }),
        field("end_time", "time", "End time", { required: true }),
        field("setup_needed", "select-single", "How much setup time do you need?", {
          required: true,
          options: ["None — straight in", "30 minutes", "1 hour", "2 hours", "Half a day", "Full day"],
        }),
        field("recurring_pattern", "text-short", "Recurring pattern (if applicable)", {
          placeholder: "e.g. every Tuesday for 8 weeks",
        }),
      ],
    },
    {
      id: "requirements",
      name: "Requirements",
      fields: [
        field("rooms", "checkbox-group", "Spaces required", {
          options: [
            "Main hall",
            "Smaller meeting room",
            "Kitchen access",
            "Bar / lounge",
            "Outdoor space",
            "Stage",
            "Changing rooms",
          ],
        }),
        field("av", "checkbox-group", "AV / equipment", {
          options: [
            "Projector & screen",
            "Microphones",
            "PA system",
            "Stage lighting",
            "Wi-Fi for attendees",
            "Live-stream support",
            "Whiteboards / flipcharts",
            "Tables & chairs",
          ],
        }),
        field("catering", "select-single", "Catering", {
          required: true,
          options: ["None needed", "Tea & coffee only", "Light refreshments", "Lunch", "Three-course dinner", "External caterer bringing own"],
        }),
        field("dietary", "text-long", "Dietary requirements"),
        field("accessibility", "text-long", "Accessibility requirements"),
      ],
    },
    {
      id: "liability",
      name: "Liability & licences",
      fields: [
        field("alcohol", "select-single", "Will alcohol be served?", {
          required: true,
          options: ["No", "Yes — provided by venue", "Yes — bringing own (BYO permit needed)"],
        }),
        field("music_perf", "select-single", "Live music or DJ?", {
          required: true,
          options: ["No music", "Recorded music only", "Live music / DJ"],
        }),
        field("public_liability", "select-single", "Do you have public liability insurance?", {
          required: true,
          options: ["Yes — will provide certificate", "No — please advise", "N/A — small private event"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Confirm & submit",
      fields: [
        field("budget", "currency", "Budget for the booking (GBP, optional)"),
        field("notes", "text-long", "Anything else we should know?"),
        field("consent_data", "consent-gdpr", "I consent to my data being used to handle this enquiry.", {
          validation: { required: true },
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default VENUE_HIRE_ENQUIRY;
