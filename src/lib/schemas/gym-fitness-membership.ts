/**
 * Gym & fitness membership.
 *
 * Universal sign-up for gyms, studios, leisure centres, CrossFit boxes,
 * climbing centres, pool memberships. Captures member, payment plan,
 * PAR-Q health screen, and gym-floor consents.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const GYM_FITNESS_MEMBERSHIP: PackSchema = toPackSchema({
  productId: "gym-fitness-membership",
  title: "Gym & fitness membership",
  pathways: [
    { id: "monthly", name: "Monthly rolling" },
    { id: "annual", name: "12-month contract" },
    { id: "pay-as-you-go", name: "Pay-as-you-go / class pass" },
    { id: "corporate", name: "Corporate / employer benefit" },
    { id: "concession", name: "Student / senior / NHS concession" },
  ],
  sections: [
    {
      id: "member",
      name: "Member details",
      fields: [
        field("full_name", "name-full", "Full name", { required: true }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone", { required: true }),
        field("address", "address-uk", "Address", { required: true }),
        field("profile_photo", "file-upload", "Upload photo for member card (optional)"),
        field("emergency_name", "name-full", "Emergency contact · name", { required: true }),
        field("emergency_phone", "phone-uk", "Emergency contact · phone", { required: true }),
      ],
    },
    {
      id: "membership",
      name: "Membership",
      fields: [
        field("plan", "text-short", "Plan name", { required: true }),
        field("price_pcm", "currency", "Monthly fee (GBP)"),
        field("start_date", "date", "Start date", { required: true }),
        field("contract_length", "select-single", "Contract length", {
          required: true,
          options: ["No commitment", "3 months", "6 months", "12 months", "Annual paid up-front"],
        }),
        field("concession_type", "select-single", "Concession", {
          options: ["None", "Student (16+, with ID)", "Senior (60+)", "NHS / Blue Light Card", "Disability", "Employer corporate scheme"],
        }),
        field("concession_evidence_upload", "file-upload", "Upload concession evidence (if applicable)"),
      ],
    },
    {
      id: "par-q",
      name: "Health screening (PAR-Q+)",
      intro:
        "These help us spot anyone who should check with their GP before increasing activity. Answer Yes / No honestly.",
      fields: [
        field("parq_heart", "select-single", "Has a doctor ever said you have a heart condition?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_chest_pain", "select-single", "Do you feel chest pain during physical activity?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_chest_pain_no_activity", "select-single", "Have you had chest pain when not active in the past month?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_balance", "select-single", "Do you lose balance or consciousness?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_joint", "select-single", "Bone or joint problem that could worsen with activity?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_medication_bp", "select-single", "Doctor-prescribed medication for blood pressure or heart condition?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_other_reason", "select-single", "Do you know any other reason you should not do physical activity?", {
          required: true,
          options: ["No", "Yes"],
        }),
        field("parq_explain", "text-long", "If you answered Yes to anything above, please explain"),
        field("pregnancy", "select-single", "Are you pregnant?", {
          options: ["No", "Yes — please flag to your instructor"],
        }),
        field("medical_clearance", "consent-gdpr", "I confirm that — based on my answers — I have either consulted my GP or I am medically cleared to exercise."),
      ],
    },
    {
      id: "preferences",
      name: "Preferences & goals",
      fields: [
        field("goals", "checkbox-group", "Primary goals", {
          options: ["General fitness", "Lose weight", "Build muscle", "Sport performance", "Mental wellbeing", "Recover from injury", "Train for an event"],
        }),
        field("event_target", "text-short", "Event / target (if applicable)"),
        field("session_pref", "checkbox-group", "Times you'll likely train", {
          options: ["Early morning", "Mid-morning", "Lunchtime", "After work", "Late evening", "Weekends"],
        }),
        field("induction", "select-single", "Would you like a free induction?", {
          options: ["Yes — please book me in", "No — I've trained at a gym before"],
        }),
      ],
    },
    {
      id: "payment",
      name: "Payment",
      fields: [
        field("payment_method", "select-single", "Payment method", {
          required: true,
          options: ["Direct Debit", "Card (recurring)", "Paid annually up-front", "Corporate scheme — payroll deduction"],
        }),
        field("dd_authorise", "consent-gdpr", "If Direct Debit, I authorise the gym to collect monthly payments under the Direct Debit Guarantee.", {
          regulator: "Bacs",
        }),
      ],
    },
    {
      id: "consent",
      name: "Consent & gym rules",
      fields: [
        field("rules", "consent-gdpr", "I have read and agree to the gym rules and code of conduct.", {
          validation: { required: true },
        }),
        field("risk_acceptance", "consent-gdpr", "I take part at my own risk; I'll inform staff of anything affecting my training.", {
          validation: { required: true },
        }),
        field("photo_video", "consent-marketing", "Photographs / video of me in the gym may be used for promotion."),
        field("marketing", "consent-marketing", "Send me class updates and offers."),
        field("data", "consent-gdpr", "I consent to my data being processed to manage my membership.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(b)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default GYM_FITNESS_MEMBERSHIP;
