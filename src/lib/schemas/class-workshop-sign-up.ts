/**
 * Class / workshop sign-up.
 *
 * For yoga studios, dance schools, art workshops, music lessons, cooking
 * classes, language schools. Captures participant identity, experience
 * level, health flags, and payment preference.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const CLASS_WORKSHOP_SIGN_UP: PackSchema = toPackSchema({
  productId: "class-workshop-sign-up",
  title: "Class / workshop sign-up",
  pathways: [
    { id: "one-off", name: "Single class / workshop" },
    { id: "course", name: "Multi-week course" },
    { id: "membership", name: "Class pass / membership" },
  ],
  sections: [
    {
      id: "participant",
      name: "Participant details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("under_18", "select-single", "Are you under 18?", {
          required: true,
          options: ["Yes", "No"],
        }),
      ],
    },
    {
      id: "guardian",
      name: "Parent / guardian",
      intro: "Required for participants under 18.",
      fields: [
        field("guardian_name", "name-full", "Parent / guardian name"),
        field("guardian_phone", "phone-uk", "Phone"),
        field("guardian_email", "email", "Email"),
        field("guardian_consent", "consent-gdpr", "I consent to my child taking part."),
      ],
    },
    {
      id: "class",
      name: "Which class",
      fields: [
        field("class_name", "text-short", "Class or workshop name", { required: true }),
        field("class_date", "date", "Date of class", { required: true }),
        field("class_time", "time", "Start time"),
        field("experience", "select-single", "Your experience level", {
          required: true,
          options: ["Total beginner", "Some experience", "Intermediate", "Advanced", "Returning after a break"],
        }),
        field("what_to_gain", "text-long", "What do you hope to get from this?"),
      ],
    },
    {
      id: "health",
      name: "Health & safety",
      intro:
        "Please disclose anything the instructor needs to know to keep you safe.",
      fields: [
        field("injuries", "text-long", "Current injuries or recent surgery"),
        field("conditions", "checkbox-group", "Existing conditions?", {
          options: [
            "Pregnancy",
            "High blood pressure",
            "Heart condition",
            "Asthma",
            "Diabetes",
            "Back / spine issue",
            "Joint issue",
            "Anxiety / panic",
            "None of the above",
          ],
        }),
        field("medications", "text-short", "Medications we should know about"),
        field("allergies", "text-short", "Allergies"),
      ],
    },
    {
      id: "emergency",
      name: "Emergency contact",
      fields: [
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("liability", "consent-gdpr", "I take part at my own risk and agree to inform the instructor of anything that affects my participation.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being used to manage this booking.", {
          validation: { required: true },
        }),
        field("marketing", "consent-marketing", "Send me updates about future classes."),
        field("photo", "consent-marketing", "Photographs from this class may be used in promotion."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default CLASS_WORKSHOP_SIGN_UP;
