/**
 * Wedding enquiry.
 *
 * For venues, photographers, planners, florists, caterers. Captures the
 * couple, the date, guest count, style preferences, and budget signal.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const WEDDING_ENQUIRY: PackSchema = toPackSchema({
  productId: "wedding-enquiry",
  title: "Wedding enquiry",
  pathways: [
    { id: "venue", name: "Venue enquiry" },
    { id: "photographer", name: "Photographer / videographer" },
    { id: "planner", name: "Wedding planner / coordinator" },
    { id: "supplier", name: "Other supplier (florist, caterer, etc.)" },
  ],
  sections: [
    {
      id: "couple",
      name: "The couple",
      fields: [
        field("partner_1_name", "name-full", "Partner 1 · name", { required: true }),
        field("partner_2_name", "name-full", "Partner 2 · name", { required: true }),
        field("primary_contact", "select-single", "Primary contact for this enquiry", {
          required: true,
          options: ["Partner 1", "Partner 2", "Both"],
        }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address"),
      ],
    },
    {
      id: "date",
      name: "When & where",
      fields: [
        field("preferred_date", "date", "Preferred wedding date"),
        field("alt_date", "date", "Alternative date"),
        field("flexibility", "select-single", "How flexible are you on date?", {
          options: ["Locked in", "Within the same month", "Within the same season", "Open — best date wins"],
        }),
        field("ceremony_type", "select-single", "Ceremony type", {
          required: true,
          options: ["Civil — registry office", "Civil — at venue", "Religious", "Humanist / non-religious celebrant", "Symbolic — already legally married"],
        }),
        field("location", "text-short", "Location / area you're considering"),
      ],
    },
    {
      id: "scale",
      name: "Scale & style",
      fields: [
        field("guest_count", "number", "Estimated guest count", {
          required: true,
          validation: { min: 2, max: 1000 },
        }),
        field("style_words", "text-short", "Three words to describe your wedding style", {
          placeholder: "e.g. relaxed, rustic, candlelit",
        }),
        field("inspirations", "text-long", "Tell us about your vision (Pinterest links welcome)"),
        field("dietary", "text-long", "Any dietary / accessibility considerations for the guests?"),
      ],
    },
    {
      id: "budget",
      name: "Budget signal",
      intro: "We use this to suggest packages that suit. No commitment.",
      fields: [
        field("total_budget", "select-single", "Overall wedding budget", {
          options: [
            "Under £5k",
            "£5–10k",
            "£10–20k",
            "£20–35k",
            "£35–60k",
            "£60k+",
            "Prefer not to say",
          ],
        }),
        field("specific_budget", "currency", "Budget for our specific service (GBP)"),
        field("priorities", "checkbox-group", "Top priorities", {
          options: [
            "Venue & atmosphere",
            "Food & drink",
            "Photography / video",
            "Music / entertainment",
            "Flowers & decor",
            "Dress / suit",
            "Honeymoon",
          ],
        }),
      ],
    },
    {
      id: "logistics",
      name: "Logistics",
      fields: [
        field("how_you_heard", "select-single", "How did you find us?", {
          options: ["Google", "Instagram", "Pinterest", "Friend referral", "Supplier referral", "Wedding directory", "Other"],
        }),
        field("supplier_referral", "text-short", "Who referred you (if applicable)?"),
        field("notes", "text-long", "Anything else you'd like us to know?"),
      ],
    },
    {
      id: "consent",
      name: "Submit enquiry",
      fields: [
        field("consent_data", "consent-gdpr", "I consent to being contacted about this enquiry.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me supplier newsletters and inspiration."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default WEDDING_ENQUIRY;
