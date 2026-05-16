/**
 * Party / function enquiry.
 *
 * For function rooms, pub function suites, restaurants with private
 * areas, marquee hires, and at-home catering. Captures occasion, guest
 * profile, food / drink, entertainment and special needs.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const PARTY_FUNCTION_ENQUIRY: PackSchema = toPackSchema({
  productId: "party-function-enquiry",
  title: "Party / function enquiry",
  pathways: [
    { id: "birthday", name: "Birthday" },
    { id: "anniversary", name: "Anniversary / engagement" },
    { id: "corporate", name: "Corporate / work do" },
    { id: "memorial", name: "Wake / memorial" },
    { id: "other", name: "Other celebration" },
  ],
  sections: [
    {
      id: "host",
      name: "About you",
      fields: [
        field("host_name", "name-full", "Your name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Billing address"),
      ],
    },
    {
      id: "event",
      name: "The event",
      fields: [
        field("occasion", "text-short", "Occasion", {
          required: true,
          placeholder: "e.g. 40th birthday, retirement do, baby shower",
        }),
        field("preferred_date", "date", "Preferred date", { required: true }),
        field("alt_date", "date", "Alternative date"),
        field("start_time", "time", "Start time", { required: true }),
        field("end_time", "time", "End time", { required: true }),
        field("guest_count", "number", "Expected guests", { required: true, validation: { min: 1, max: 1000 } }),
        field("guest_profile", "select-single", "Guest profile", {
          required: true,
          options: ["Adults only", "Mostly adults with some children", "Mixed family event", "Children's party"],
        }),
        field("dress_code", "text-short", "Dress code (if any)"),
      ],
    },
    {
      id: "food-drink",
      name: "Food & drink",
      fields: [
        field("food_type", "select-single", "Food", {
          required: true,
          options: ["No food needed", "Canapés / nibbles", "Buffet", "Sit-down meal", "BBQ / hog roast", "Pizza station", "Sharing platters"],
        }),
        field("dietary", "text-long", "Dietary requirements (allergies, vegan, halal, kosher, etc.)"),
        field("drinks", "select-single", "Drinks", {
          required: true,
          options: [
            "Cash bar — guests pay",
            "Welcome drink only",
            "Drinks package — beer & wine",
            "Drinks package — full bar",
            "Bring your own (corkage)",
          ],
        }),
        field("cake", "select-single", "Cake / dessert", {
          options: ["Bringing my own", "Need recommendation", "Not needed"],
        }),
      ],
    },
    {
      id: "entertainment",
      name: "Music & entertainment",
      fields: [
        field("entertainment", "checkbox-group", "Entertainment", {
          options: [
            "Background music (playlist)",
            "Live music / band",
            "DJ",
            "Karaoke",
            "Speeches / toasts",
            "Photo booth",
            "Cake-cutting moment",
            "Kids entertainment / face painting",
          ],
        }),
        field("playlist_link", "url", "Playlist link (Spotify, Apple Music)"),
        field("entertainment_notes", "text-long", "Anything specific about the entertainment"),
      ],
    },
    {
      id: "logistics",
      name: "Logistics",
      fields: [
        field("decor", "text-long", "Decor / theme preferences"),
        field("accessibility", "text-long", "Accessibility requirements"),
        field("photography", "select-single", "Photography", {
          options: ["Guest photos only", "Professional photographer attending", "Photographer recommendation needed"],
        }),
        field("transport", "select-single", "Transport / parking", {
          options: ["Guests making their own way", "Group transport needed", "Need parking advice"],
        }),
      ],
    },
    {
      id: "budget",
      name: "Budget & next steps",
      fields: [
        field("budget", "currency", "Total budget (GBP)"),
        field("how_heard", "select-single", "How did you find us?", {
          options: ["Google", "Social media", "Friend / family", "Wedding fair", "Previous customer", "Other"],
        }),
        field("notes", "text-long", "Anything else?"),
      ],
    },
    {
      id: "consent",
      name: "Submit",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being used to handle this enquiry.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me updates and special offers."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default PARTY_FUNCTION_ENQUIRY;
