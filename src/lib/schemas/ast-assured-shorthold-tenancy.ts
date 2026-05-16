/**
 * AST · assured shorthold tenancy.
 *
 * Standard UK AST drafting form for landlords and letting agents.
 * Captures parties, property, rent, deposit (TDS-required fields),
 * term, and the prescribed clauses required by the Tenant Fees Act 2019
 * and Housing Act 1988.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const AST: PackSchema = toPackSchema({
  productId: "ast-assured-shorthold-tenancy",
  title: "AST · assured shorthold tenancy",
  pathways: [
    { id: "fixed-term", name: "Fixed-term tenancy" },
    { id: "periodic", name: "Statutory periodic" },
    { id: "joint", name: "Joint tenancy (multiple tenants)" },
  ],
  sections: [
    {
      id: "parties",
      name: "Parties",
      fields: [
        field("landlord_name", "name-full", "Landlord · name", { required: true }),
        field("landlord_address", "address-uk", "Landlord · service address (s.48 Notice)", {
          required: true,
          regulator: "Housing Act 1988 s.48",
        }),
        field("landlord_email", "email", "Landlord · email", { required: true }),
        field("agent_name", "text-short", "Letting agent (if any)"),
        field("agent_address", "address-uk", "Agent · address"),
        field("tenant_1_name", "name-full", "Tenant 1 · name", { required: true }),
        field("tenant_1_dob", "dob", "Tenant 1 · date of birth", { required: true }),
        field("tenant_2_name", "name-full", "Tenant 2 · name (if joint)"),
        field("tenant_2_dob", "dob", "Tenant 2 · date of birth"),
        field("tenant_extras", "text-long", "Additional tenants (name + DOB per line)"),
      ],
    },
    {
      id: "property",
      name: "The property",
      fields: [
        field("property_address", "address-uk", "Property address", { required: true }),
        field("property_type", "select-single", "Property type", {
          required: true,
          options: ["Studio", "1-bed flat", "2-bed flat", "3-bed flat", "Terraced house", "Semi-detached", "Detached", "HMO"],
        }),
        field("furnished", "select-single", "Furnishing", {
          required: true,
          options: ["Unfurnished", "Part-furnished", "Fully furnished"],
        }),
        field("hmo", "select-single", "Is this an HMO?", {
          required: true,
          options: ["No", "Yes — licensed", "Yes — mandatory licence pending"],
        }),
      ],
    },
    {
      id: "term",
      name: "Term & rent",
      fields: [
        field("start_date", "date", "Tenancy start date", { required: true }),
        field("term_months", "number", "Fixed term · months", {
          required: true,
          validation: { min: 1, max: 84 },
        }),
        field("end_date", "date", "Fixed term end date", { required: true }),
        field("rent_pcm", "currency", "Rent · per calendar month (GBP)", { required: true }),
        field("rent_payment_day", "number", "Rent due day of month", {
          required: true,
          validation: { min: 1, max: 31 },
        }),
        field("payment_method", "select-single", "Payment method", {
          required: true,
          options: ["Standing order", "Direct debit", "Bank transfer", "Other"],
        }),
        field("rent_arrears_grace", "number", "Grace period before late-rent default (days)", {
          validation: { min: 0, max: 30 },
        }),
      ],
    },
    {
      id: "deposit",
      name: "Deposit",
      fields: [
        field("deposit_amount", "currency", "Deposit amount (GBP)", { required: true, regulator: "Tenant Fees Act 2019" }),
        field("deposit_cap_check", "consent-gdpr", "Deposit is no more than 5 weeks' rent (under £50k annual) or 6 weeks' (£50k+).", {
          validation: { required: true },
          regulator: "Tenant Fees Act 2019",
        }),
        field("deposit_scheme", "select-single", "Tenancy deposit scheme", {
          required: true,
          options: ["TDS (Tenancy Deposit Scheme)", "DPS (Deposit Protection Service)", "mydeposits"],
          regulator: "Housing Act 2004",
        }),
        field("prescribed_info_date", "date", "Prescribed information served on", {
          required: true,
          regulator: "Housing Act 2004",
        }),
      ],
    },
    {
      id: "permitted",
      name: "Use & restrictions",
      fields: [
        field("use", "select-single", "Permitted use", {
          required: true,
          options: ["Residential — sole or principal home", "Holiday let", "Other"],
        }),
        field("pets", "select-single", "Pets", {
          required: true,
          options: ["No pets allowed", "Negotiable with landlord consent", "Permitted (specify below)"],
        }),
        field("smoking", "select-single", "Smoking", {
          required: true,
          options: ["No smoking inside the property", "Smoking permitted (specify rooms)"],
        }),
        field("guests", "text-long", "Guest / overnight visitor policy"),
        field("alterations", "text-short", "Alterations allowed without consent?", {
          placeholder: "e.g. minor decoration with prior written consent",
        }),
      ],
    },
    {
      id: "execution",
      name: "Execution",
      intro:
        "The landlord must serve How to Rent, EPC, and Gas Safety certificate before the tenant moves in.",
      fields: [
        field("how_to_rent_served", "consent-gdpr", "How to Rent booklet served.", {
          validation: { required: true },
          regulator: "Deregulation Act 2015",
        }),
        field("epc_served", "consent-gdpr", "EPC certificate served (rating below).", {
          validation: { required: true },
          regulator: "MEES",
        }),
        field("epc_rating", "select-single", "EPC rating", {
          required: true,
          options: ["A", "B", "C", "D", "E", "F (NOT lettable)", "G (NOT lettable)"],
        }),
        field("gas_safe_served", "consent-gdpr", "Gas Safety certificate served (within last 12 months).", {
          regulator: "Gas Safety Regs 1998",
        }),
        field("electrical_eicr_served", "consent-gdpr", "EICR served (within last 5 years).", {
          regulator: "Electrical Safety Standards 2020",
        }),
        field("landlord_signature", "signature", "Landlord signature", { required: true }),
        field("landlord_date", "date", "Landlord date", { required: true }),
        field("tenant_1_signature", "signature", "Tenant 1 signature", { required: true }),
        field("tenant_1_date", "date", "Tenant 1 date", { required: true }),
        field("tenant_2_signature", "signature", "Tenant 2 signature (if joint)"),
        field("tenant_2_date", "date", "Tenant 2 date"),
      ],
    },
  ],
});

export default AST;
