/**
 * Hotel booking T&Cs.
 *
 * Reservation pack covering guest, stay details, room preferences,
 * deposit / cancellation acknowledgements, and the GDPR / marketing
 * consents.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const HOTEL_BOOKING_TCS: PackSchema = toPackSchema({
  productId: "hotel-booking-t-cs",
  title: "Hotel booking T&Cs",
  pathways: [
    { id: "leisure", name: "Leisure stay" },
    { id: "business", name: "Business / corporate" },
    { id: "wedding-group", name: "Wedding / group block" },
  ],
  sections: [
    {
      id: "lead-guest",
      name: "Lead guest",
      fields: [
        field("full_name", "name-full", "Lead guest name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Billing address", { required: true }),
        field("country_of_residence", "text-short", "Country of residence", { required: true }),
      ],
    },
    {
      id: "stay",
      name: "Stay",
      fields: [
        field("check_in", "date", "Check-in date", { required: true }),
        field("check_out", "date", "Check-out date", { required: true }),
        field("adults", "number", "Adults", { required: true, validation: { min: 1, max: 10 } }),
        field("children", "number", "Children (under 12)", { validation: { min: 0, max: 10 } }),
        field("infants", "number", "Infants (under 2)", { validation: { min: 0, max: 5 } }),
        field("rooms_required", "number", "Rooms required", { required: true, validation: { min: 1, max: 30 } }),
        field("room_type", "select-single", "Room type", {
          required: true,
          options: ["Standard double", "Standard twin", "Superior double", "Deluxe", "Suite", "Family room", "Accessible"],
        }),
        field("rate_plan", "select-single", "Rate plan", {
          required: true,
          options: ["Room only", "Bed & breakfast", "Half board", "Full board", "All inclusive"],
        }),
      ],
    },
    {
      id: "preferences",
      name: "Preferences",
      fields: [
        field("bed_pref", "select-single", "Bed configuration", {
          options: ["Double / king", "Twin beds", "Either is fine"],
        }),
        field("smoking", "select-single", "Smoking", {
          options: ["Non-smoking room (default)", "Smoking room — if available"],
        }),
        field("floor_pref", "select-single", "Floor preference", {
          options: ["Ground floor / accessible", "Mid floor", "High floor", "No preference"],
        }),
        field("arrival_time", "time", "Estimated arrival time"),
        field("notes", "text-long", "Special requests (cot, accessibility, dietary, occasion)"),
      ],
    },
    {
      id: "payment",
      name: "Payment",
      fields: [
        field("card_guarantee", "consent-gdpr", "I authorise the hotel to take a card guarantee at the time of booking.", {
          validation: { required: true },
        }),
        field("incidental_card", "consent-gdpr", "I will provide a card at check-in for incidental charges.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "terms",
      name: "Cancellation & house rules",
      fields: [
        field("cancellation_terms", "consent-gdpr", "I understand the cancellation policy: free cancellation up to the cutoff date stated on confirmation; the first night is charged if cancelled later or no-show.", {
          validation: { required: true },
        }),
        field("damage_policy", "consent-gdpr", "I accept responsibility for any damage caused during the stay.", {
          validation: { required: true },
        }),
        field("smoking_fine", "consent-gdpr", "I understand smoking in non-smoking rooms incurs a deep-clean fee.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being used to manage this reservation.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("marketing", "consent-marketing", "Send me offers and seasonal updates."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default HOTEL_BOOKING_TCS;
