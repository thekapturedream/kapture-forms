/**
 * Inventory · check-in.
 *
 * Move-in inventory and schedule of condition for letting agents and
 * landlords. The runner timestamps + audit-hashes the submission so the
 * inventory can be used as evidence in deposit-dispute resolution.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const INVENTORY_CHECK_IN: PackSchema = toPackSchema({
  productId: "inventory-check-in",
  title: "Inventory · check-in",
  pathways: [
    { id: "unfurnished", name: "Unfurnished" },
    { id: "part-furnished", name: "Part-furnished" },
    { id: "fully-furnished", name: "Fully furnished" },
  ],
  sections: [
    {
      id: "header",
      name: "Header",
      fields: [
        field("property_address", "address-uk", "Property address", { required: true }),
        field("inspection_date", "date", "Date of inspection", { required: true }),
        field("inspector_name", "name-full", "Inventory clerk", { required: true }),
        field("tenant_name", "name-full", "Tenant", { required: true }),
        field("landlord_name", "name-full", "Landlord / agent"),
        field("keys_handed_over", "number", "Number of keys handed over", { required: true }),
        field("meter_electricity", "text-short", "Electricity meter reading", { required: true }),
        field("meter_gas", "text-short", "Gas meter reading"),
        field("meter_water", "text-short", "Water meter reading"),
        field("smoke_alarms", "consent-gdpr", "Smoke alarms tested and working.", {
          validation: { required: true },
          regulator: "Smoke and CO Alarm Regs 2022",
        }),
        field("co_alarms", "consent-gdpr", "Carbon monoxide alarms tested in all rooms with solid-fuel appliances.", {
          regulator: "Smoke and CO Alarm Regs 2022",
        }),
      ],
    },
    {
      id: "kitchen",
      name: "Kitchen",
      fields: [
        field("kitchen_walls", "text-long", "Walls — condition & defects"),
        field("kitchen_floor", "text-long", "Floor — condition"),
        field("kitchen_units", "text-long", "Units & worktops"),
        field("kitchen_appliances", "text-long", "Appliances (cooker, hob, fridge, washer) — make, model, condition"),
        field("kitchen_photos", "file-multi", "Kitchen photos", { required: true }),
      ],
    },
    {
      id: "living",
      name: "Living areas",
      fields: [
        field("living_rooms_count", "number", "Number of living rooms"),
        field("living_walls", "text-long", "Walls — condition"),
        field("living_floor", "text-long", "Floor / carpet — condition"),
        field("living_furniture", "text-long", "Furniture items (if furnished)"),
        field("living_photos", "file-multi", "Photos", { required: true }),
      ],
    },
    {
      id: "bedrooms",
      name: "Bedrooms",
      fields: [
        field("bedrooms_count", "number", "Number of bedrooms", { required: true }),
        field("bedroom_walls", "text-long", "Walls — condition per room"),
        field("bedroom_floors", "text-long", "Floors / carpets"),
        field("bedroom_furniture", "text-long", "Bed frames, wardrobes, mattresses (if furnished)"),
        field("bedroom_photos", "file-multi", "Photos", { required: true }),
      ],
    },
    {
      id: "bathrooms",
      name: "Bathrooms",
      fields: [
        field("bathrooms_count", "number", "Number of bathrooms", { required: true }),
        field("bathroom_walls", "text-long", "Walls & tiles — condition"),
        field("bathroom_fittings", "text-long", "Bath, shower, basin, WC — condition"),
        field("bathroom_sealant", "text-long", "Sealant condition (any black mould?)"),
        field("bathroom_photos", "file-multi", "Photos", { required: true }),
      ],
    },
    {
      id: "outside",
      name: "Outside",
      fields: [
        field("garden", "text-long", "Garden — condition"),
        field("outbuildings", "text-long", "Sheds / outbuildings"),
        field("parking", "text-long", "Parking / driveway / bin store"),
        field("outside_photos", "file-multi", "Photos"),
      ],
    },
    {
      id: "general-notes",
      name: "General notes",
      fields: [
        field("smoke_smell", "text-short", "Any smell (smoke, damp, pets)?"),
        field("cleanliness", "select-single", "Overall cleanliness", {
          required: true,
          options: ["Professionally cleaned", "Good — clean", "Fair", "Poor", "Not cleaned"],
        }),
        field("defects_summary", "text-long", "Summary of pre-existing defects (one per line)"),
        field("agreed_remedies", "text-long", "Remedies agreed before check-in"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      intro: "Both parties acknowledge the inventory is a true reflection of the property at check-in.",
      fields: [
        field("inspector_signature", "signature", "Inspector signature", { required: true }),
        field("tenant_signature", "signature", "Tenant signature", { required: true }),
        field("tenant_date", "date", "Tenant date", { required: true }),
        field("landlord_signature", "signature", "Landlord / agent signature"),
      ],
    },
  ],
});

export default INVENTORY_CHECK_IN;
