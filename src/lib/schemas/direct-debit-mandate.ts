/**
 * Direct debit mandate.
 *
 * Standard UK Direct Debit Instruction (DDI) compliant with Bacs Service
 * User Number requirements. Captures payer details, bank info, and the
 * mandatory Direct Debit Guarantee acknowledgement.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const DIRECT_DEBIT_MANDATE: PackSchema = toPackSchema({
  productId: "direct-debit-mandate",
  title: "Direct debit mandate",
  pathways: [
    { id: "personal", name: "Personal account" },
    { id: "business", name: "Business account" },
  ],
  sections: [
    {
      id: "payer",
      name: "Account holder",
      fields: [
        field("holder_name", "name-full", "Account holder name(s)", { required: true, regulator: "Bacs" }),
        field("billing_address", "address-uk", "Billing address", { required: true }),
        field("email", "email", "Email for confirmation", { required: true }),
        field("phone", "phone-uk", "Phone"),
        field("customer_ref", "text-short", "Customer reference (provided by the service)"),
      ],
    },
    {
      id: "bank",
      name: "Bank account",
      fields: [
        field("bank_name", "text-short", "Name of bank or building society", { required: true }),
        field("bank_address", "address-uk", "Bank branch address", { required: true }),
        field("sort_code", "text-short", "Sort code", {
          required: true,
          placeholder: "00-00-00",
          validation: { pattern: "^\\d{2}-?\\d{2}-?\\d{2}$" },
          regulator: "Bacs",
        }),
        field("account_number", "text-short", "Account number (8 digits)", {
          required: true,
          validation: { pattern: "^\\d{8}$" },
          regulator: "Bacs",
        }),
      ],
    },
    {
      id: "service",
      name: "About the Direct Debit",
      fields: [
        field("service_user_name", "text-short", "Service user name (your supplier)", { required: true }),
        field("service_user_number", "text-short", "Service user number (6 digits)", {
          required: true,
          validation: { pattern: "^\\d{6}$" },
        }),
        field("amount_type", "select-single", "Amount type", {
          required: true,
          options: ["Fixed amount each collection", "Variable amount (notified in advance)"],
        }),
        field("frequency", "select-single", "Collection frequency", {
          required: true,
          options: ["Monthly", "Quarterly", "Annually", "On invoice"],
        }),
        field("first_collection_date", "date", "First collection date"),
        field("amount", "currency", "Amount (if fixed) (GBP)"),
      ],
    },
    {
      id: "guarantee",
      name: "Direct Debit Guarantee",
      intro:
        "This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits.",
      fields: [
        field("guarantee_ack", "consent-gdpr", "I have read and understood the Direct Debit Guarantee: if the amount or date changes, the service user must notify me at least 10 working days in advance; if an error is made, I'm entitled to a full and immediate refund from my bank; I can cancel by writing to my bank.", {
          validation: { required: true },
          regulator: "Bacs",
        }),
        field("authority", "consent-gdpr", "I authorise the service user to instruct my bank / building society to take payments via Direct Debit, and I confirm I am the only person needed to authorise debits on this account (or that I have permission of all account holders).", {
          validation: { required: true },
          regulator: "Bacs",
        }),
        field("signature", "signature", "Signature", { required: true }),
        field("signed_date", "date", "Date", { required: true }),
      ],
    },
  ],
});

export default DIRECT_DEBIT_MANDATE;
