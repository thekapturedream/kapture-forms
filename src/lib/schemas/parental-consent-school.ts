/**
 * Parental consent · school.
 *
 * General-purpose parental consent for school activities — captures
 * pupil, parental responsibility, medical info, photo / media permissions,
 * and the trip- or activity-specific consents listed.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const PARENTAL_CONSENT_SCHOOL: PackSchema = toPackSchema({
  productId: "parental-consent-school",
  title: "Parental consent · school",
  pathways: [
    { id: "general", name: "General school activities (annual)" },
    { id: "trip", name: "Specific trip / visit" },
    { id: "extracurricular", name: "Extra-curricular club" },
  ],
  sections: [
    {
      id: "pupil",
      name: "Pupil",
      fields: [
        field("pupil_name", "name-full", "Pupil's full name", { required: true }),
        field("pupil_dob", "dob", "Date of birth", { required: true }),
        field("year_group", "text-short", "Year group / class", { required: true }),
        field("home_address", "address-uk", "Home address"),
      ],
    },
    {
      id: "parent",
      name: "Parent / guardian",
      fields: [
        field("parent_name", "name-full", "Parent / guardian name", { required: true }),
        field("relationship", "select-single", "Relationship", {
          required: true,
          options: ["Mother", "Father", "Step-parent", "Legal guardian", "Local authority guardian", "Other"],
        }),
        field("phone_day", "phone-uk", "Daytime phone", { required: true }),
        field("phone_evening", "phone-uk", "Evening phone"),
        field("email", "email", "Email", { required: true }),
        field("legal_authority", "consent-gdpr", "I have parental responsibility for the pupil above.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "emergency",
      name: "Emergency contacts",
      fields: [
        field("emergency_1_name", "name-full", "Contact 1 · name", { required: true }),
        field("emergency_1_relationship", "text-short", "Contact 1 · relationship"),
        field("emergency_1_phone", "phone-uk", "Contact 1 · phone", { required: true }),
        field("emergency_2_name", "name-full", "Contact 2 · name"),
        field("emergency_2_phone", "phone-uk", "Contact 2 · phone"),
      ],
    },
    {
      id: "medical",
      name: "Medical & health",
      fields: [
        field("doctor_name", "text-short", "GP name", { required: true }),
        field("doctor_surgery", "text-short", "GP surgery", { required: true }),
        field("conditions", "text-long", "Medical conditions we should know about (asthma, allergies, epilepsy, diabetes)"),
        field("medications", "text-long", "Regular medications (name, dose, when given)"),
        field("dietary", "text-long", "Dietary needs"),
        field("admin_meds_consent", "consent-gdpr", "I consent to school staff administering prescribed medication as required.", {
          regulator: "Children Act 1989",
        }),
        field("emergency_care_consent", "consent-gdpr", "I authorise school staff to seek emergency medical treatment if I cannot be contacted in time.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "media",
      name: "Photo & media",
      intro: "Granular consents under UK GDPR Article 6(1)(a). Tick what you allow.",
      fields: [
        field("photo_school_use", "consent-marketing", "Photos for internal school use (newsletter, displays).", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("photo_website", "consent-marketing", "Photos on the school website.", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("photo_social", "consent-marketing", "Photos on school social media (Facebook, Instagram, X)."),
        field("photo_press", "consent-marketing", "Photos released to local press."),
        field("video_lessons", "consent-marketing", "Video of lessons for teaching / training purposes."),
      ],
    },
    {
      id: "activities",
      name: "Activity-specific consents",
      fields: [
        field("school_transport", "consent-marketing", "Transport in school-arranged minibus / coach.", {
          regulator: "School Transport Regulations",
        }),
        field("staff_car", "consent-marketing", "Transport in a staff member's car (emergencies / off-site)."),
        field("walking_off_site", "consent-marketing", "Walking off-site for local trips and PE."),
        field("internet_use", "consent-marketing", "Internet use as per the school's Acceptable Use Policy."),
        field("swimming", "consent-marketing", "Participation in swimming lessons / events."),
        field("can_swim", "select-single", "Can the pupil swim 25 m unaided?", {
          options: ["Yes", "No", "Not sure"],
        }),
        field("religious_collective_worship", "consent-marketing", "Participation in collective worship and religious education."),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("information_accurate", "consent-gdpr", "I confirm the information above is accurate and I will inform the school of any changes.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to the school processing this data to deliver education and safeguard the pupil.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(e)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default PARENTAL_CONSENT_SCHOOL;
