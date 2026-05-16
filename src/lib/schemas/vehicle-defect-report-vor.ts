/**
 * Vehicle defect report (VOR).
 *
 * Driver-reported defect record per DVSA Guide to Maintaining Roadworthy
 * Commercial Vehicles. Captures the vehicle, the defect, the action,
 * and the operator sign-off needed to return-to-service.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const VEHICLE_DEFECT_VOR: PackSchema = toPackSchema({
  productId: "vehicle-defect-report-vor",
  title: "Vehicle defect report (VOR)",
  pathways: [
    { id: "minor", name: "Minor — vehicle still serviceable" },
    { id: "vor", name: "VOR — vehicle off road" },
    { id: "roadside", name: "Roadside / breakdown" },
  ],
  sections: [
    {
      id: "report",
      name: "Report header",
      fields: [
        field("report_date", "date", "Report date", { required: true }),
        field("report_time", "time", "Report time", { required: true }),
        field("driver_name", "name-full", "Driver / reporter name", { required: true }),
        field("operator_licence", "text-short", "Operator licence (O-licence) number", {
          required: true,
          regulator: "DVSA",
        }),
      ],
    },
    {
      id: "vehicle",
      name: "Vehicle",
      fields: [
        field("registration", "text-short", "Registration number", { required: true }),
        field("fleet_number", "text-short", "Fleet number"),
        field("make_model", "text-short", "Make & model", { required: true }),
        field("vehicle_type", "select-single", "Vehicle type", {
          required: true,
          options: ["HGV — rigid", "HGV — artic", "PSV", "LCV", "Trailer", "Car", "Plant"],
        }),
        field("current_mileage", "number", "Current mileage / hours", { required: true }),
        field("last_inspection_date", "date", "Date of last 6-week inspection", { regulator: "DVSA" }),
      ],
    },
    {
      id: "defect",
      name: "The defect",
      fields: [
        field("noticed_when", "select-single", "When was the defect noticed?", {
          required: true,
          options: ["Pre-use walk-around check", "During the journey", "End of shift", "Roadside event", "Workshop spot-check"],
        }),
        field("defect_category", "select-single", "Defect category (urgency)", {
          required: true,
          options: ["Prohibition-level (immediate VOR)", "Major (rectify before next use)", "Minor (rectify when next workshop visit)"],
          regulator: "DVSA",
        }),
        field("system_affected", "checkbox-group", "System affected", {
          required: true,
          options: [
            "Brakes",
            "Steering",
            "Tyres / wheels",
            "Suspension",
            "Lights / indicators",
            "Mirrors / view",
            "Bodywork",
            "Coupling",
            "Tachograph",
            "Speed limiter",
            "Load security",
            "Emissions",
            "Driver controls",
            "Other",
          ],
        }),
        field("description", "text-long", "Full description of the defect", {
          required: true,
          placeholder: "What's wrong? How does it present? Any noise, vibration, warning light?",
          validation: { maxLength: 2000 },
        }),
        field("photos", "file-multi", "Photos of the defect"),
      ],
    },
    {
      id: "action",
      name: "Immediate action",
      fields: [
        field("driver_action", "select-single", "Action taken by driver", {
          required: true,
          options: [
            "Continued journey — vehicle still safe",
            "Returned to depot",
            "Parked safely — vehicle off road",
            "Called recovery / roadside assistance",
            "Stopped immediately — police informed",
          ],
        }),
        field("vehicle_status", "select-single", "Vehicle status now", {
          required: true,
          options: ["In service", "VOR — awaiting rectification", "VOR — under repair", "VOR — awaiting parts"],
        }),
        field("vor_location", "text-short", "Current vehicle location (if VOR)"),
      ],
    },
    {
      id: "rectification",
      name: "Rectification & return-to-service",
      intro: "Completed by the mechanic / workshop after repair.",
      fields: [
        field("mechanic_name", "name-full", "Mechanic / fitter name"),
        field("rectification_date", "date", "Rectification date"),
        field("work_done", "text-long", "Work carried out"),
        field("parts_used", "text-long", "Parts used"),
        field("returned_to_service", "select-single", "Returned to service?", {
          options: ["Yes", "No — further work required", "Vehicle withdrawn"],
        }),
        field("mechanic_signature", "signature", "Mechanic signature"),
      ],
    },
    {
      id: "transport-manager",
      name: "Transport manager sign-off",
      fields: [
        field("tm_name", "name-full", "Transport manager name", { required: true, regulator: "DVSA" }),
        field("tm_signature", "signature", "TM signature", { required: true }),
        field("tm_date", "date", "TM date", { required: true }),
      ],
    },
  ],
});

export default VEHICLE_DEFECT_VOR;
