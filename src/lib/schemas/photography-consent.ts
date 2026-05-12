/**
 * Photography & media consent — UK schools, clubs, charities, events.
 *
 * Captures parental / guardian consent for photographs, video, and audio
 * recordings of children under 18. Designed for school photo days, sports
 * clubs, holiday camps, performing arts groups, and charity events.
 *
 * UK GDPR Article 6(1)(a) explicit consent for processing identifiable
 * images of minors. ICO age-appropriate design code compliance baked into
 * the granular per-use checkboxes.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const PHOTOGRAPHY_CONSENT: PackSchema = toPackSchema({
  productId: "photography-media-consent",
  title: "Photography & media consent",
  pathways: [
    { id: "minor", name: "Child / young person (under 18)" },
    { id: "adult", name: "Adult participant (18+)" },
    { id: "vulnerable-adult", name: "Vulnerable adult (with capacity safeguards)" },
  ],
  sections: [
    {
      id: "subject",
      name: "Subject details",
      intro:
        "The person whose image / voice will be captured. For minors, the parent or guardian completes this section.",
      fields: [
        field("subject_name", "name-full", "Full name of subject", { required: true }),
        field("subject_dob", "dob", "Subject · date of birth", { required: true }),
        field("group_name", "text-short", "Group / class / team", {
          help: "e.g. Year 7 Form B, Saturday football club, junior choir.",
        }),
        field("subject_address", "address-uk", "Subject's home address"),
      ],
    },
    {
      id: "guardian",
      name: "Parent / guardian",
      intro:
        "Required when the subject is under 18 or otherwise lacks capacity to consent. Adult subjects skip this section.",
      fields: [
        field("guardian_name", "name-full", "Parent / guardian name"),
        field("guardian_relationship", "select-single", "Relationship to subject", {
          options: ["Mother", "Father", "Legal guardian", "Local authority guardian", "Other"],
        }),
        field("guardian_email", "email", "Email"),
        field("guardian_phone", "phone-uk", "Mobile"),
        field("legal_authority", "consent-gdpr", "I confirm I have legal authority to give consent on behalf of the named subject.", {
          help: "Tick when completing for a minor or someone you legally represent.",
        }),
      ],
    },
    {
      id: "permissions",
      name: "Specific permissions",
      intro:
        "Tick only the uses you consent to. You can change your mind at any time by emailing the contact named in our privacy notice.",
      fields: [
        field("p_photos_internal", "consent-marketing", "Photographs for internal use (newsletter, displays, parent updates).", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_photos_website", "consent-marketing", "Photographs on our public website.", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_photos_social", "consent-marketing", "Photographs on our social media (Facebook, Instagram, X, LinkedIn).", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_photos_press", "consent-marketing", "Photographs released to local press for editorial coverage.", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_video_internal", "consent-marketing", "Video / audio recordings for internal review (e.g. coaching, rehearsals).", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_video_public", "consent-marketing", "Video / audio recordings on our public channels (website, YouTube, social).", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
        field("p_named_caption", "consent-marketing", "Subject may be named in captions and credits.", {
          regulator: "UK GDPR · Art. 6(1)(a)",
        }),
      ],
    },
    {
      id: "restrictions",
      name: "Restrictions you'd like us to know",
      intro:
        "Tell us about any safeguarding situation, court order, or personal reason that means we should NEVER publish this subject's image, even if you've ticked some boxes above.",
      fields: [
        field("restriction_flag", "select-single", "Is there a restriction we need to honour?", {
          required: true,
          options: ["No restrictions", "Yes — see notes below"],
        }),
        field("restriction_notes", "text-long", "Restriction notes", {
          placeholder: "e.g. court order, witness protection, safeguarding concern, simple preference.",
        }),
      ],
    },
    {
      id: "signature",
      name: "Sign & date",
      fields: [
        field("understanding", "consent-gdpr", "I have read and understood how images and recordings of the named subject will be used.", {
          validation: { required: true },
        }),
        field("withdrawal", "consent-gdpr", "I understand I can withdraw this consent at any time without affecting our ongoing relationship.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 7(3)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default PHOTOGRAPHY_CONSENT;
