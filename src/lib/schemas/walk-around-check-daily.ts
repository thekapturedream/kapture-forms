/**
 * Walk-around check · daily.
 *
 * The driver's daily first-use safety check required under DVSA Guide
 * to Maintaining Roadworthy Commercial Vehicles. Failed items create
 * a vehicle defect report automatically.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const WALK_AROUND_DAILY: PackSchema = toPackSchema({
  productId: "walk-around-check-daily",
  title: "Walk-around check · daily",
  pathways: [
    { id: "hgv", name: "HGV / LGV" },
    { id: "psv", name: "PSV / bus / coach" },
    { id: "lcv", name: "LCV / van" },
    { id: "trailer", name: "Trailer (separate)" },
  ],
  sections: [
    {
      id: "header",
      name: "Header",
      fields: [
        field("check_date", "date", "Date", { required: true }),
        field("check_time", "time", "Time of check", { required: true }),
        field("driver_name", "name-full", "Driver name", { required: true }),
        field("registration", "text-short", "Registration", { required: true }),
        field("trailer_registration", "text-short", "Trailer registration (if applicable)"),
        field("mileage", "number", "Mileage at check", { required: true }),
        field("operator", "text-short", "Operator / depot", { required: true }),
      ],
    },
    {
      id: "external",
      name: "External walk-around",
      intro: "Tick PASS for items that are roadworthy. Anything ticked FAIL must be logged in the notes below.",
      fields: [
        field("lights_indicators", "select-single", "Lights, indicators, reflectors", { required: true, options: ["Pass", "Fail"] }),
        field("number_plates", "select-single", "Number plates — clean & legible", { required: true, options: ["Pass", "Fail"] }),
        field("tyres_wheels", "select-single", "Tyres (tread + condition) & wheels", { required: true, options: ["Pass", "Fail"], regulator: "Road Vehicles Reg 2017" }),
        field("wheel_security", "select-single", "Wheel-nut indicators / torque marks aligned", { required: true, options: ["Pass", "Fail"] }),
        field("body_doors", "select-single", "Body, doors, bumpers", { required: true, options: ["Pass", "Fail"] }),
        field("mirrors_glass", "select-single", "Mirrors & glass — clean & undamaged", { required: true, options: ["Pass", "Fail"] }),
        field("load_security", "select-single", "Load secure & weight within limits", { required: true, options: ["Pass", "Fail"] }),
        field("trailer_coupling", "select-single", "Trailer coupling / king pin / 5th-wheel (if applicable)", { options: ["Pass", "Fail", "N/A"] }),
        field("spray_suppression", "select-single", "Spray suppression / mud flaps", { options: ["Pass", "Fail", "N/A"] }),
        field("fuel_oil_leaks", "select-single", "No visible fuel / oil / coolant leaks", { required: true, options: ["Pass", "Fail"] }),
      ],
    },
    {
      id: "internal",
      name: "In-cab checks",
      fields: [
        field("seat_belt", "select-single", "Driver seat & seatbelt", { required: true, options: ["Pass", "Fail"] }),
        field("brake_pedal", "select-single", "Brake pedal feel + handbrake", { required: true, options: ["Pass", "Fail"] }),
        field("steering", "select-single", "Steering free-play within tolerance", { required: true, options: ["Pass", "Fail"] }),
        field("horn", "select-single", "Horn", { required: true, options: ["Pass", "Fail"] }),
        field("windscreen", "select-single", "Windscreen — view clear (no crack in swept area)", { required: true, options: ["Pass", "Fail"] }),
        field("wipers_washers", "select-single", "Wipers & washers", { required: true, options: ["Pass", "Fail"] }),
        field("dash_warning_lights", "select-single", "Dashboard — no warning lights on", { required: true, options: ["Pass", "Fail"] }),
        field("tachograph", "select-single", "Tachograph — driver card in, mode set", { required: true, options: ["Pass", "Fail"], regulator: "EU/UK Drivers' Hours" }),
        field("speed_limiter", "select-single", "Speed limiter functioning (sticker visible)", { options: ["Pass", "Fail", "N/A"] }),
      ],
    },
    {
      id: "defects",
      name: "Defects found",
      fields: [
        field("defects_summary", "text-long", "List each FAIL with detail", {
          placeholder: "Item, location, severity. The system creates a VOR for prohibition-level defects automatically.",
          validation: { maxLength: 2000 },
        }),
        field("vor_required", "select-single", "Is the vehicle safe to drive?", {
          required: true,
          options: ["Yes — all checks pass", "Yes — minor defects logged", "No — VOR raised"],
          regulator: "DVSA",
        }),
        field("defect_photos", "file-multi", "Photos of any defects"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("driver_signature", "signature", "Driver signature", { required: true }),
        field("driver_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default WALK_AROUND_DAILY;
