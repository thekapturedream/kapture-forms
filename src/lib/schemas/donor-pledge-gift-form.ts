/**
 * Donor pledge & gift form.
 *
 * For charities, foundations, schools, religious orgs. Captures a
 * donor's pledge — one-off / regular / legacy — with Gift Aid status,
 * payment method, and recognition / anonymity preferences.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const DONOR_PLEDGE_GIFT_FORM: PackSchema = toPackSchema({
  productId: "donor-pledge-gift-form",
  title: "Donor pledge & gift form",
  pathways: [
    { id: "one-off", name: "One-off gift" },
    { id: "regular", name: "Regular monthly gift" },
    { id: "legacy", name: "Legacy / gift in will" },
    { id: "corporate", name: "Corporate / matched giving" },
    { id: "in-kind", name: "In-kind donation" },
  ],
  sections: [
    {
      id: "donor",
      name: "About you",
      fields: [
        field("donor_name", "name-full", "Full name", { required: true }),
        field("title", "select-single", "Title", {
          options: ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Rev", "Other"],
        }),
        field("email", "email", "Email", { required: true }),
        field("phone", "phone-uk", "Phone"),
        field("address", "address-uk", "Address", { required: true, regulator: "Gift Aid" }),
        field("dob", "dob", "Date of birth (optional — helps us with legacy planning)"),
        field("how_heard", "select-single", "How did you hear about us?", {
          options: ["Friend / family", "Event", "Social media", "Press / TV", "Search", "Existing donor", "Other"],
        }),
      ],
    },
    {
      id: "gift",
      name: "Your gift",
      fields: [
        field("amount", "currency", "Gift amount (GBP)", { required: true }),
        field("frequency", "select-single", "Frequency", {
          required: true,
          options: ["One-off today", "Monthly", "Quarterly", "Annually", "Legacy / future gift"],
        }),
        field("first_payment", "date", "First / only payment date", { required: true }),
        field("payment_method", "select-single", "Payment method", {
          required: true,
          options: ["Direct Debit", "Card (today)", "Card (recurring)", "Bank transfer", "Cheque", "Standing order I'll set up", "Payroll Giving"],
        }),
        field("designation", "select-single", "Designate your gift", {
          options: ["Where the need is greatest", "Specific programme / appeal (below)", "Building / endowment fund"],
        }),
        field("designation_detail", "text-short", "If designated, which programme?"),
      ],
    },
    {
      id: "gift-aid",
      name: "Gift Aid",
      intro:
        "If you're a UK taxpayer, Gift Aid adds 25p to every £1 you give — at no cost to you. You must have paid enough Income or Capital Gains Tax to cover what all charities will reclaim.",
      fields: [
        field("gift_aid_status", "select-single", "Gift Aid", {
          required: true,
          options: [
            "Yes — claim Gift Aid on this gift and all gifts in the last 4 years and future gifts",
            "Yes — only this gift",
            "No — I am not a UK taxpayer",
            "No — I do not pay enough tax",
            "No — for personal reasons",
          ],
          regulator: "HMRC Gift Aid",
        }),
        field("understanding", "consent-gdpr", "I understand if I pay less Income / Capital Gains Tax in the current year than the amount of Gift Aid claimed on all my donations, it is my responsibility to pay any difference.", {
          regulator: "HMRC Gift Aid",
        }),
      ],
    },
    {
      id: "in-kind",
      name: "In-kind donation",
      intro: "Only complete for in-kind donations.",
      fields: [
        field("item_description", "text-long", "Description of items donated"),
        field("estimated_value", "currency", "Estimated value (GBP)"),
        field("delivery_method", "select-single", "Delivery", {
          options: ["I will drop off", "Please collect", "Already delivered"],
        }),
        field("preferred_delivery_date", "date", "Preferred delivery / collection date"),
      ],
    },
    {
      id: "legacy",
      name: "Legacy intent",
      intro: "Only complete for legacy / gift-in-will pledges.",
      fields: [
        field("legacy_type", "select-single", "Type of legacy", {
          options: ["Pecuniary (fixed sum)", "Residuary (% of estate)", "Specific (named item)", "Reversionary"],
        }),
        field("solicitor_aware", "select-single", "Has your solicitor been informed?", {
          options: ["Yes — included in current will", "Not yet — will be updated", "Considering"],
        }),
        field("legacy_notes", "text-long", "Notes on your intention"),
      ],
    },
    {
      id: "recognition",
      name: "Recognition & preferences",
      fields: [
        field("anonymity", "select-single", "Recognition preference", {
          required: true,
          options: [
            "Recognise me by name",
            "Anonymous (no public mention)",
            "Family / company name (specify)",
            "In memory of someone (specify)",
          ],
        }),
        field("recognition_name", "text-short", "Recognition name (if different from donor name)"),
        field("in_memory_of", "text-short", "In memory of (if applicable)"),
        field("marketing", "consent-marketing", "Send me appeal updates and impact reports."),
        field("event_invites", "consent-marketing", "Invite me to donor events."),
      ],
    },
    {
      id: "consent",
      name: "Declaration",
      fields: [
        field("data", "consent-gdpr", "I consent to my data being processed for managing my donation and Gift Aid claim.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(c)",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default DONOR_PLEDGE_GIFT_FORM;
