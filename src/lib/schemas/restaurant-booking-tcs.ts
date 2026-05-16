/**
 * Restaurant booking T&Cs.
 *
 * Captures the booking + the acknowledgements restaurants need under
 * Natasha's Law (allergens) and standard deposit / cancellation terms.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const RESTAURANT_BOOKING_TCS: PackSchema = toPackSchema({
  productId: "restaurant-booking-t-cs",
  title: "Restaurant booking T&Cs",
  pathways: [
    { id: "small", name: "Small party (1–6)" },
    { id: "medium", name: "Medium party (7–14)" },
    { id: "large", name: "Large party / private hire (15+)" },
  ],
  sections: [
    {
      id: "booker",
      name: "Booking made by",
      fields: [
        field("full_name", "name-full", "Booking name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
      ],
    },
    {
      id: "booking",
      name: "Booking",
      fields: [
        field("date", "date", "Date", { required: true }),
        field("time", "time", "Time", { required: true }),
        field("party_size", "number", "Party size", {
          required: true,
          validation: { min: 1, max: 200 },
        }),
        field("children", "number", "Of which children (under 12)"),
        field("highchairs", "number", "Highchairs required"),
        field("occasion", "select-single", "Special occasion?", {
          options: ["None — just a meal", "Birthday", "Anniversary", "Engagement", "Business", "Other"],
        }),
        field("seating_pref", "select-single", "Seating preference", {
          options: ["Indoor", "Outdoor / terrace", "Bar area", "Quiet corner", "Window", "No preference"],
        }),
      ],
    },
    {
      id: "allergens",
      name: "Allergens & dietary",
      intro: "Under Natasha's Law we ask about the 14 listed allergens. Please disclose anything we should know.",
      fields: [
        field("allergens_present", "select-single", "Anyone in the party with a food allergy or intolerance?", {
          required: true,
          options: ["No", "Yes — please tell us below"],
          regulator: "Natasha's Law",
        }),
        field("allergens_list", "checkbox-group", "Tick all that apply", {
          options: [
            "Celery",
            "Cereals containing gluten",
            "Crustaceans",
            "Eggs",
            "Fish",
            "Lupin",
            "Milk / dairy",
            "Molluscs",
            "Mustard",
            "Peanuts",
            "Sesame",
            "Soybeans",
            "Sulphur dioxide / sulphites",
            "Tree nuts",
          ],
          regulator: "Natasha's Law",
        }),
        field("severity", "select-single", "Severity of allergy", {
          options: ["Mild intolerance", "Moderate — uncomfortable", "Severe — including risk of anaphylaxis"],
        }),
        field("dietary", "text-long", "Other dietary needs (vegan, vegetarian, halal, kosher, low-FODMAP)"),
      ],
    },
    {
      id: "terms",
      name: "Booking terms",
      fields: [
        field("deposit_required", "select-single", "Deposit", {
          options: ["None required", "Card guarantee only", "Pre-paid deposit per head"],
        }),
        field("cancellation_terms", "consent-gdpr", "I understand cancellations within 24 hours of the booking time may be charged at the deposit / per-head amount stated.", {
          validation: { required: true },
        }),
        field("no_show_terms", "consent-gdpr", "I understand no-shows for tables of 6+ will be charged at the per-head rate.", {
          validation: { required: true },
        }),
        field("photo_consent", "consent-marketing", "I consent to atmospheric photos of the restaurant including my party being used for marketing."),
        field("marketing", "consent-marketing", "Send me restaurant updates and special menus."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default RESTAURANT_BOOKING_TCS;
