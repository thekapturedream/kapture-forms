/**
 * Society / association sign-up.
 *
 * Universal join form for student societies, professional associations,
 * historical societies, special-interest clubs, networks. Captures
 * member, areas of interest, contribution preference, governance
 * sign-off.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const SOCIETY_ASSOCIATION_SIGNUP: PackSchema = toPackSchema({
  productId: "society-association-signup",
  title: "Society / association sign-up",
  pathways: [
    { id: "student", name: "Student society" },
    { id: "professional", name: "Professional association" },
    { id: "special-interest", name: "Special-interest society" },
    { id: "alumni", name: "Alumni association" },
  ],
  sections: [
    {
      id: "applicant",
      name: "Your details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("pronouns", "select-single", "Pronouns", {
          options: ["She/her", "He/him", "They/them", "Other", "Prefer not to say"],
        }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone"),
        field("dob", "dob", "Date of birth"),
        field("address", "address-uk", "Address (optional — only collected if needed for postal updates)"),
      ],
    },
    {
      id: "context",
      name: "Your context",
      fields: [
        field("status", "select-single", "Current status (helps us tailor invitations)", {
          required: true,
          options: ["Student", "Recent graduate", "In employment", "Self-employed", "Retired", "Career break", "Other"],
        }),
        field("institution_or_employer", "text-short", "Institution / employer (optional)"),
        field("role_title", "text-short", "Role / course title"),
        field("country", "text-short", "Country of residence", { required: true }),
        field("city", "text-short", "City"),
      ],
    },
    {
      id: "membership-type",
      name: "Membership type",
      fields: [
        field("tier", "select-single", "Membership tier", {
          required: true,
          options: ["Free / standard", "Concession (student / unwaged)", "Full (waged)", "Honorary / lifetime", "Corporate"],
        }),
        field("annual_fee", "currency", "Annual fee (GBP)"),
        field("payment_frequency", "select-single", "Payment frequency", {
          options: ["Annual", "Monthly", "Lifetime (one-off)", "Free"],
        }),
        field("referrer", "text-short", "Who referred you (if anyone)?"),
      ],
    },
    {
      id: "interests",
      name: "Your interests",
      fields: [
        field("interest_areas", "text-long", "What aspects of the society interest you most?", {
          required: true,
          placeholder: "Talks, networking, special projects, mentoring, social events…",
          validation: { maxLength: 1500 },
        }),
        field("topics_of_interest", "text-long", "Topics you'd like to learn or talk about"),
        field("expertise_offered", "text-long", "Expertise you could contribute"),
        field("event_pref", "checkbox-group", "Events you'd attend", {
          options: ["Evening talks", "Daytime workshops", "Weekend retreats", "Online webinars", "AGM / business meetings", "Social / networking", "Professional development", "Mentoring"],
        }),
      ],
    },
    {
      id: "contribution",
      name: "Contribution",
      fields: [
        field("volunteer", "checkbox-group", "Would you volunteer in any of these ways?", {
          options: [
            "Committee role",
            "Mentor / buddy",
            "Event organiser",
            "Speaker",
            "Writer for newsletter / journal",
            "Social media / comms",
            "Outreach / recruitment",
            "Not at this stage",
          ],
        }),
        field("skills_to_share", "text-long", "Skills you'd be willing to share (if you ticked volunteer above)"),
        field("availability", "text-short", "Rough time availability per month"),
      ],
    },
    {
      id: "governance",
      name: "Governance & values",
      fields: [
        field("code_of_conduct", "consent-gdpr", "I have read and agree to the society's code of conduct.", {
          validation: { required: true },
        }),
        field("constitution", "consent-gdpr", "I agree to be bound by the society's constitution / rules.", {
          validation: { required: true },
        }),
        field("standing_as_member", "select-single", "Have you ever been removed from membership of a comparable body?", {
          required: true,
          options: ["No", "Yes — happy to discuss", "Prefer not to say"],
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being processed for membership management.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("member_directory", "consent-marketing", "List me in the member directory shared with other members."),
        field("newsletter", "consent-marketing", "Subscribe me to the society newsletter."),
        field("events", "consent-marketing", "Send me event invitations."),
        field("third_party", "consent-marketing", "Share my contact details with affiliated partner societies."),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default SOCIETY_ASSOCIATION_SIGNUP;
