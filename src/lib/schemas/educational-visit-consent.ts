/**
 * Educational visit consent.
 *
 * Trip-specific parental consent. Captures pupil, trip details, medical
 * info specific to the trip, transport, contact arrangements, and the
 * cost / payment authorisation.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const EDUCATIONAL_VISIT_CONSENT: PackSchema = toPackSchema({
  productId: "educational-visit-consent",
  title: "Educational visit consent",
  pathways: [
    { id: "day", name: "Day trip (UK)" },
    { id: "residential", name: "Residential trip (UK)" },
    { id: "overseas", name: "Overseas trip" },
    { id: "adventure", name: "Adventurous activity (LOtC standard)" },
  ],
  sections: [
    {
      id: "trip",
      name: "About the trip",
      fields: [
        field("trip_title", "text-short", "Trip title", { required: true }),
        field("destination", "text-short", "Destination", { required: true }),
        field("departure_date", "date", "Departure date", { required: true }),
        field("return_date", "date", "Return date", { required: true }),
        field("departure_time", "time", "Departure time"),
        field("return_time", "time", "Estimated return time"),
        field("departure_point", "text-short", "Departure point"),
        field("trip_lead", "name-full", "Trip lead / EVC", { required: true }),
        field("trip_lead_phone", "phone-uk", "Trip lead phone (on the day)", { required: true }),
        field("staff_pupil_ratio", "text-short", "Adult-to-pupil ratio", {
          placeholder: "e.g. 1:8",
        }),
      ],
    },
    {
      id: "pupil",
      name: "Pupil",
      fields: [
        field("pupil_name", "name-full", "Pupil name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("year_group", "text-short", "Year group", { required: true }),
      ],
    },
    {
      id: "parent",
      name: "Parent / guardian",
      fields: [
        field("parent_name", "name-full", "Parent / guardian name", { required: true }),
        field("relationship", "select-single", "Relationship", {
          required: true,
          options: ["Mother", "Father", "Step-parent", "Legal guardian", "Other"],
        }),
        field("contact_phone_day", "phone-uk", "Daytime phone", { required: true }),
        field("contact_phone_alt", "phone-uk", "Alternative phone"),
        field("email", "email", "Email", { required: true }),
        field("emergency_other_name", "name-full", "Alternative emergency contact · name"),
        field("emergency_other_phone", "phone-uk", "Alternative emergency contact · phone"),
      ],
    },
    {
      id: "medical",
      name: "Medical — trip specific",
      fields: [
        field("conditions", "text-long", "Medical conditions relevant to this trip"),
        field("medications", "text-long", "Medications to take on the trip (name, dose, timing)"),
        field("allergies", "text-long", "Allergies (food, insect, medication)"),
        field("dietary", "text-long", "Dietary needs"),
        field("travel_sickness", "select-single", "Travel sickness?", {
          options: ["No", "Yes — bringing own medication", "Yes — please be aware"],
        }),
        field("inhaler", "select-single", "Asthma inhaler?", {
          options: ["No", "Yes — pupil to carry", "Yes — staff to carry"],
        }),
        field("epi_pen", "select-single", "EpiPen / auto-injector required?", {
          options: ["No", "Yes — pupil to carry one + spare with staff"],
        }),
        field("nhs_treatment_consent", "consent-gdpr", "I consent to staff seeking emergency NHS treatment if I cannot be reached.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "swim-activities",
      name: "Activities",
      intro: "Tick consents specific to this trip.",
      fields: [
        field("swimming", "consent-marketing", "Participation in any swimming activity (open / closed water)."),
        field("can_swim", "select-single", "Can the pupil swim 25 m unaided?", {
          options: ["Yes", "No", "Not sure", "Not applicable to this trip"],
        }),
        field("adventurous", "consent-marketing", "Participation in adventurous activities (climbing, kayaking, hiking)."),
        field("free_time", "consent-marketing", "Supervised free-time activities (group exploration, market visit)."),
        field("residential_room", "consent-marketing", "Sharing a residential room with other pupils of the same gender."),
      ],
    },
    {
      id: "logistics-cost",
      name: "Logistics & cost",
      fields: [
        field("transport_type", "select-single", "Transport", {
          required: true,
          options: ["Coach", "Train", "Minibus", "Walking", "Mixed", "Flight"],
        }),
        field("cost", "currency", "Trip cost (GBP)", { required: true }),
        field("pocket_money", "currency", "Recommended pocket money"),
        field("payment_consent", "consent-gdpr", "I confirm I will pay the trip cost as instructed by the school.", {
          validation: { required: true },
        }),
        field("kit_list_read", "consent-gdpr", "I have read the kit list / packing requirements for this trip.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("parental_authority", "consent-gdpr", "I have parental responsibility for the pupil and consent to the trip.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to the school sharing relevant information with venues / external providers for safety.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(e)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default EDUCATIONAL_VISIT_CONSENT;
