/**
 * Notice to quit · Section 21.
 *
 * The Form 6A "no-fault" possession notice under s.21 Housing Act 1988.
 * Two-month minimum notice. Cannot be served in the first 4 months of
 * the original tenancy. The runner checks the pre-conditions are met
 * and refuses to render a notice that won't stand up.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const NOTICE_S21: PackSchema = toPackSchema({
  productId: "notice-to-quit-section-21",
  title: "Notice to quit · Section 21",
  pathways: [
    { id: "fixed-term", name: "Within fixed term" },
    { id: "periodic", name: "Statutory periodic" },
  ],
  sections: [
    {
      id: "landlord",
      name: "Landlord",
      fields: [
        field("landlord_name", "name-full", "Landlord name", { required: true }),
        field("landlord_address", "address-uk", "Landlord service address", { required: true }),
        field("agent_acting", "select-single", "Are you serving as the landlord or agent?", {
          required: true,
          options: ["Landlord in person", "Acting as letting agent"],
        }),
      ],
    },
    {
      id: "tenant",
      name: "Tenant",
      fields: [
        field("tenant_1_name", "name-full", "Tenant 1 name", { required: true }),
        field("tenant_2_name", "name-full", "Tenant 2 name (if joint)"),
        field("property_address", "address-uk", "Property address", { required: true }),
      ],
    },
    {
      id: "tenancy",
      name: "Tenancy details",
      fields: [
        field("start_date", "date", "Tenancy start date", { required: true }),
        field("fixed_term_end", "date", "Fixed term end date"),
        field("most_recent_renewal", "date", "Most recent renewal date (if any)"),
      ],
    },
    {
      id: "preconditions",
      name: "Section 21 pre-conditions",
      intro: "All of these must be ticked. If any are missing, the s.21 cannot be served validly.",
      fields: [
        field("deposit_protected", "consent-gdpr", "Deposit is protected in an authorised scheme and prescribed information was served within 30 days.", {
          validation: { required: true },
          regulator: "Housing Act 2004",
        }),
        field("how_to_rent", "consent-gdpr", "How to Rent booklet served on the tenant.", {
          validation: { required: true },
          regulator: "Deregulation Act 2015",
        }),
        field("epc_served", "consent-gdpr", "Current EPC certificate served (rated E or above).", {
          validation: { required: true },
          regulator: "MEES",
        }),
        field("gas_safe", "consent-gdpr", "Current Gas Safety certificate served (or no gas).", {
          validation: { required: true },
          regulator: "Gas Safety Regs 1998",
        }),
        field("not_first_4_months", "consent-gdpr", "More than 4 months have passed since the start of the original tenancy.", {
          validation: { required: true },
          regulator: "Housing Act 1988 s.21",
        }),
        field("no_retaliatory", "consent-gdpr", "This notice is not in response to a complaint about disrepair within the last 6 months.", {
          validation: { required: true },
          regulator: "Deregulation Act 2015 s.33",
        }),
        field("hmo_licence_in_order", "consent-gdpr", "If an HMO, the property is properly licensed.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "notice",
      name: "Notice details",
      fields: [
        field("notice_date", "date", "Date of notice", { required: true }),
        field("possession_date", "date", "Date possession required after (min 2 months from notice date)", { required: true }),
        field("service_method", "select-single", "Method of service", {
          required: true,
          options: ["In person", "Sent by first-class post", "Email (only if contract permits)", "Process server"],
        }),
        field("service_date", "date", "Date served on tenant", { required: true }),
      ],
    },
    {
      id: "execution",
      name: "Execution",
      fields: [
        field("landlord_signature", "signature", "Landlord / agent signature", { required: true }),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default NOTICE_S21;
