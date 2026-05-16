/**
 * Membership application · club.
 *
 * Universal sign-up for sports clubs, societies, professional bodies,
 * networking groups. Captures eligibility, payment preference, code-of-
 * conduct consent, and a slot for under-18 parental consent.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const MEMBERSHIP_APPLICATION_CLUB: PackSchema = toPackSchema({
  productId: "membership-application-club",
  title: "Membership application · club",
  pathways: [
    { id: "adult", name: "Adult member (18+)" },
    { id: "junior", name: "Junior member (under 18)" },
    { id: "family", name: "Family membership" },
  ],
  sections: [
    {
      id: "applicant",
      name: "Applicant details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address", { required: true }),
      ],
    },
    {
      id: "parent",
      name: "Parent or guardian",
      intro: "Required for junior members. Adult members skip this section.",
      fields: [
        field("guardian_name", "name-full", "Parent / guardian name"),
        field("guardian_relationship", "select-single", "Relationship", {
          options: ["Mother", "Father", "Legal guardian", "Other"],
        }),
        field("guardian_email", "email", "Email"),
        field("guardian_phone", "phone-uk", "Phone"),
        field("guardian_authority", "consent-gdpr", "I confirm I have authority to enrol this junior member."),
      ],
    },
    {
      id: "membership",
      name: "Membership choice",
      fields: [
        field("membership_type", "select-single", "Membership type", {
          required: true,
          options: ["Full annual", "Half year", "Monthly rolling", "Pay as you go"],
        }),
        field("start_date", "date", "Membership start date", { required: true }),
        field("how_heard", "select-single", "How did you hear about us?", {
          options: ["Friend", "Social media", "Search", "Local press", "Event", "Other"],
        }),
        field("referral_name", "text-short", "Referred by (if applicable)"),
      ],
    },
    {
      id: "emergency",
      name: "Emergency contact",
      fields: [
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
        field("medical", "text-long", "Medical conditions or allergies we should know about"),
      ],
    },
    {
      id: "consent",
      name: "Consents & code of conduct",
      fields: [
        field("conduct", "consent-gdpr", "I have read and agree to the club's code of conduct.", {
          validation: { required: true },
        }),
        field("data", "consent-gdpr", "I consent to my data being used to manage my membership.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("marketing", "consent-marketing", "Send me updates and event invitations."),
        field("photo", "consent-marketing", "I consent to photographs being used in club promotion."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default MEMBERSHIP_APPLICATION_CLUB;
