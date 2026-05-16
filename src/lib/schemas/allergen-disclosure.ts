/**
 * Allergen disclosure (Natasha's Law).
 *
 * Per-dish allergen ingredients label for any food business pre-packing
 * food for direct sale (PPDS). Captures the 14 listed allergens, full
 * ingredients list, cross-contamination risk, and producer details.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const ALLERGEN_DISCLOSURE: PackSchema = toPackSchema({
  productId: "allergen-disclosure-natasha-s-law",
  title: "Allergen disclosure (Natasha's Law)",
  pathways: [
    { id: "ppds", name: "PPDS — Pre-Packed for Direct Sale" },
    { id: "loose", name: "Loose / sold to order" },
    { id: "delivery", name: "Delivery / click-and-collect" },
  ],
  sections: [
    {
      id: "business",
      name: "Business details",
      fields: [
        field("business_name", "text-short", "Business name", { required: true, regulator: "FSA" }),
        field("trading_address", "address-uk", "Trading address", { required: true }),
        field("fsa_id", "text-short", "FSA / EHO premises reference (if known)"),
        field("contact_email", "email", "Contact email", { required: true }),
      ],
    },
    {
      id: "product",
      name: "Product",
      fields: [
        field("product_name", "text-short", "Product name", { required: true, regulator: "FSA" }),
        field("product_description", "text-long", "Short description (one line)", {
          required: true,
          placeholder: "e.g. Pulled-pork brioche bun with slaw",
        }),
        field("ingredients_full", "text-long", "Full ingredients list (with allergens emphasised)", {
          required: true,
          help: "List in descending order of weight. Emphasise allergens in BOLD or ALL CAPS.",
          validation: { maxLength: 4000 },
          regulator: "Natasha's Law",
        }),
        field("net_weight", "text-short", "Net weight / volume"),
        field("storage", "text-short", "Storage instructions", {
          placeholder: "e.g. Keep refrigerated below 5°C",
        }),
        field("use_by_window", "text-short", "Use-by / best-before window", {
          placeholder: "e.g. 3 days from production",
        }),
      ],
    },
    {
      id: "allergens",
      name: "14 listed allergens",
      intro: "Tick all that are intentional ingredients. We add cross-contamination separately below.",
      fields: [
        field("allergens_present", "checkbox-group", "Allergens present", {
          required: true,
          options: [
            "Celery",
            "Cereals containing gluten (wheat, rye, barley, oats, spelt, kamut)",
            "Crustaceans",
            "Eggs",
            "Fish",
            "Lupin",
            "Milk",
            "Molluscs",
            "Mustard",
            "Peanuts",
            "Sesame",
            "Soybeans",
            "Sulphur dioxide / sulphites (>10 mg/kg)",
            "Tree nuts (almonds, hazelnuts, walnuts, cashews, pecans, brazils, pistachios, macadamia)",
          ],
          regulator: "Natasha's Law",
        }),
        field("contains_detail", "text-long", "Specifics on each allergen present", {
          placeholder: "e.g. Cereals containing gluten — WHEAT FLOUR in the bun.",
        }),
      ],
    },
    {
      id: "may-contain",
      name: "Cross-contamination risk",
      fields: [
        field("may_contain", "checkbox-group", "May contain (handled in the same kitchen)", {
          options: [
            "Celery",
            "Cereals containing gluten",
            "Crustaceans",
            "Eggs",
            "Fish",
            "Lupin",
            "Milk",
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
        field("kitchen_controls", "text-long", "Cross-contamination controls in place", {
          placeholder: "e.g. dedicated nut-free prep zone, daily-cleaned utensils, gloves changed between recipes.",
        }),
      ],
    },
    {
      id: "lifecycle",
      name: "Recipe lifecycle",
      fields: [
        field("first_issued", "date", "First issued", { required: true }),
        field("last_reviewed", "date", "Last reviewed", { required: true }),
        field("next_review_due", "date", "Next review due", { required: true }),
        field("authoriser_name", "name-full", "Authorised by (name)", { required: true }),
        field("authoriser_role", "text-short", "Role", { required: true }),
        field("authoriser_signature", "signature", "Signature", { required: true }),
      ],
    },
  ],
});

export default ALLERGEN_DISCLOSURE;
