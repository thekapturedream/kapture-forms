/**
 * Hair salon booking.
 *
 * For salons and barbers. Captures client, requested service, stylist
 * preference, time preference, patch-test consent (for colour), and
 * cancellation policy acknowledgement.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const HAIR_SALON_BOOKING: PackSchema = toPackSchema({
  productId: "hair-salon-booking",
  title: "Hair salon booking",
  pathways: [
    { id: "new-client", name: "New client" },
    { id: "returning", name: "Returning client" },
    { id: "colour-corrective", name: "Colour correction / restoration" },
  ],
  sections: [
    {
      id: "client",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("dob", "dob", "Date of birth (we send a birthday treat)"),
      ],
    },
    {
      id: "service",
      name: "Service",
      fields: [
        field("service_type", "select-single", "Service type", {
          required: true,
          options: [
            "Cut & blowdry",
            "Cut only",
            "Blowdry only",
            "Highlights / lowlights",
            "Full colour",
            "Root touch-up",
            "Toner / gloss",
            "Balayage / ombre",
            "Keratin / smoothing",
            "Wedding / occasion hair",
            "Other (describe below)",
          ],
        }),
        field("hair_length", "select-single", "Current hair length", {
          required: true,
          options: ["Pixie / very short", "Short above shoulder", "Shoulder length", "Mid-back", "Long below mid-back"],
        }),
        field("hair_condition", "select-single", "Current condition", {
          options: ["Healthy", "Some damage", "Significant damage", "Recently bleached", "Recently dyed"],
        }),
        field("desired_outcome", "text-long", "What would you like to leave with?", {
          placeholder: "Bring reference photos to the appointment if helpful.",
        }),
        field("inspiration", "file-multi", "Upload inspiration images"),
      ],
    },
    {
      id: "preferences",
      name: "Stylist & time",
      fields: [
        field("stylist_pref", "text-short", "Preferred stylist (if any)"),
        field("preferred_dates", "text-short", "Preferred dates", {
          required: true,
          placeholder: "e.g. Next Thursday or Friday after 5pm",
        }),
        field("preferred_time", "checkbox-group", "Time of day", {
          required: true,
          options: ["Morning", "Lunchtime", "Afternoon", "Early evening", "Late evening"],
        }),
      ],
    },
    {
      id: "patch-test",
      name: "Patch test & sensitivities",
      intro: "Required for any colour service. A patch test must happen at least 48 hours before the appointment.",
      fields: [
        field("had_colour_before", "select-single", "Have you had colour at this salon before?", {
          options: ["Yes — within the last 6 months", "Yes — over 6 months ago", "No"],
        }),
        field("allergies", "text-long", "Known allergies or skin sensitivities"),
        field("patch_test_consent", "consent-gdpr", "I will arrange a patch test at least 48 hours before any colour service.", {
          help: "Required by professional indemnity insurance.",
        }),
      ],
    },
    {
      id: "policy",
      name: "Booking policy",
      fields: [
        field("deposit_ok", "consent-gdpr", "I understand a deposit may be required for longer appointments.", {
          validation: { required: true },
        }),
        field("cancellation", "consent-gdpr", "I understand the 24-hour cancellation policy — late cancellations may be charged 50% of the service.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me appointment reminders and special offers."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default HAIR_SALON_BOOKING;
