/**
 * Cleaning service booking.
 *
 * Domestic + commercial cleaning intake. Captures property type, scope,
 * frequency, access, products / allergies, and pricing context.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const CLEANING_SERVICE: PackSchema = toPackSchema({
  productId: "cleaning-service-booking",
  title: "Cleaning service booking",
  pathways: [
    { id: "domestic-regular", name: "Domestic — regular" },
    { id: "domestic-one-off", name: "Domestic — one-off / deep clean" },
    { id: "end-of-tenancy", name: "End of tenancy" },
    { id: "commercial", name: "Commercial / office" },
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
          options: ["Flat / apartment", "House — terraced", "House — semi-detached", "House — detached", "Office / commercial", "Retail unit", "Holiday let / Airbnb"],
        }),
        field("bedrooms", "number", "Bedrooms", { validation: { min: 0, max: 20 } }),
        field("bathrooms", "number", "Bathrooms", { validation: { min: 0, max: 20 } }),
        field("size_sqft", "number", "Approximate floor area (sqft)"),
        field("pets", "select-single", "Pets in the property?", {
          required: true,
          options: ["No pets", "Dog(s)", "Cat(s)", "Multiple pets", "Other"],
        }),
      ],
    },
    {
      id: "scope",
      name: "What to clean",
      fields: [
        field("rooms", "checkbox-group", "Rooms / areas", {
          required: true,
          options: [
            "Kitchen",
            "Bathrooms",
            "Bedrooms",
            "Living rooms",
            "Hallways & stairs",
            "Home office",
            "Conservatory",
            "Garage",
            "Outdoor / patio",
          ],
        }),
        field("extras", "checkbox-group", "Add-ons", {
          options: [
            "Inside oven clean",
            "Inside fridge clean",
            "Window cleaning (interior)",
            "Window cleaning (exterior)",
            "Carpet shampoo",
            "Upholstery clean",
            "Ironing",
            "Bed linen change",
            "Cupboard interiors",
          ],
        }),
        field("priority_areas", "text-long", "Anything specific to focus on or skip?"),
      ],
    },
    {
      id: "frequency",
      name: "Frequency & timing",
      fields: [
        field("frequency", "select-single", "Frequency", {
          required: true,
          options: ["One-off", "Weekly", "Fortnightly", "Monthly", "Custom (note below)"],
        }),
        field("preferred_start", "date", "Preferred start date", { required: true }),
        field("preferred_time", "select-single", "Time of day", {
          required: true,
          options: ["Morning", "Lunchtime", "Afternoon", "Evening", "Flexible"],
        }),
        field("duration_expected", "select-single", "Expected duration per visit", {
          options: ["1 hour", "2 hours", "3 hours", "4 hours", "5+ hours"],
        }),
      ],
    },
    {
      id: "access",
      name: "Access & supplies",
      fields: [
        field("access_method", "select-single", "How will the cleaner get in?", {
          required: true,
          options: ["I'll be there", "Someone else will be there", "Key safe (I'll share the code)", "Spare key under arrangement", "Concierge / building access"],
        }),
        field("access_notes", "text-long", "Access notes (gate codes, parking, dogs to be aware of)"),
        field("supplies", "select-single", "Cleaning products & equipment", {
          required: true,
          options: ["Cleaner brings everything", "I provide products, cleaner brings equipment", "I provide everything"],
        }),
        field("product_prefs", "text-long", "Product preferences (eco-friendly, fragrance-free, allergies)"),
      ],
    },
    {
      id: "consent",
      name: "Submit",
      fields: [
        field("budget", "currency", "Budget per visit (GBP, optional)"),
        field("notes", "text-long", "Anything else we should know?"),
        field("data", "consent-gdpr", "I consent to my data being used to handle this booking.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me service reminders and tips."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default CLEANING_SERVICE;
