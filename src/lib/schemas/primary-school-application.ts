/**
 * Primary school application.
 *
 * Reception / Year 1+ admission form for England, Wales, Scotland, NI.
 * Captures child, parents, sibling priority, faith / catchment, SEND,
 * and the priority statements LAs and academies use to rank.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const PRIMARY_SCHOOL_APPLICATION: PackSchema = toPackSchema({
  productId: "primary-school-application",
  title: "Primary school application",
  pathways: [
    { id: "reception", name: "Reception (September entry)" },
    { id: "in-year", name: "In-year application" },
    { id: "year-3", name: "Junior school (Year 3)" },
  ],
  sections: [
    {
      id: "child",
      name: "About the child",
      fields: [
        field("child_name", "name-full", "Child's full legal name", { required: true }),
        field("child_dob", "dob", "Date of birth", { required: true }),
        field("child_sex", "select-single", "Sex registered at birth", {
          required: true,
          options: ["Female", "Male"],
        }),
        field("home_address", "address-uk", "Home address (the child's permanent address)", {
          required: true,
          regulator: "DfE",
        }),
        field("moved_in", "date", "Date the child moved into this address", { required: true }),
        field("current_setting", "text-short", "Current school / nursery"),
        field("nationality", "text-short", "Nationality"),
        field("first_language", "text-short", "First language (if not English)"),
      ],
    },
    {
      id: "parent",
      name: "Parent / guardian",
      fields: [
        field("parent_1_name", "name-full", "Parent 1 · name", { required: true }),
        field("parent_1_relationship", "select-single", "Relationship", {
          required: true,
          options: ["Mother", "Father", "Step-parent", "Legal guardian", "Foster carer", "Local authority"],
        }),
        field("parent_1_address", "address-uk", "Parent 1 address (if different from child's)"),
        field("parent_1_phone", "phone-uk", "Phone", { required: true }),
        field("parent_1_email", "email", "Email", { required: true }),
        field("parent_2_name", "name-full", "Parent 2 · name"),
        field("parent_2_phone", "phone-uk", "Parent 2 phone"),
        field("parent_2_email", "email", "Parent 2 email"),
        field("residence_arrangement", "select-single", "Child's residence arrangement", {
          required: true,
          options: ["Lives with both parents", "Lives mainly with this parent", "Shared residency 50/50", "Other"],
        }),
        field("court_orders", "text-long", "Any court orders (Child Arrangements Order, etc.)"),
      ],
    },
    {
      id: "preferences",
      name: "School preferences",
      intro: "List your preferences in order. Most LAs accept 3–6 preferences.",
      fields: [
        field("preference_1", "text-short", "1st preference school", { required: true }),
        field("preference_2", "text-short", "2nd preference school"),
        field("preference_3", "text-short", "3rd preference school"),
        field("preference_4", "text-short", "4th preference school"),
        field("preference_5", "text-short", "5th preference school"),
        field("preference_6", "text-short", "6th preference school"),
      ],
    },
    {
      id: "priority",
      name: "Priority criteria",
      intro: "Tick anything that applies — these affect ranking by oversubscription criteria.",
      fields: [
        field("looked_after", "select-single", "Is the child looked after (in care) or previously looked after?", {
          required: true,
          options: ["No", "Yes — currently looked after", "Yes — adopted from care", "Yes — under SGO from care"],
          regulator: "DfE School Admissions Code",
        }),
        field("sibling_link", "select-single", "Sibling already attending one of your preferences?", {
          required: true,
          options: ["No", "Yes — at preference 1", "Yes — at preference 2", "Yes — at preference 3+", "Yes — at multiple"],
        }),
        field("sibling_name", "text-short", "Sibling's full name (if yes)"),
        field("sibling_school", "text-short", "Sibling's school"),
        field("sibling_year_group", "text-short", "Sibling's year group at September entry"),
        field("staff_child", "select-single", "Parent works at one of your preferred schools?", {
          options: ["No", "Yes — provide name below"],
        }),
        field("faith_link", "text-long", "Faith / religious affiliation (if applying to a faith school)"),
        field("medical_social", "text-long", "Exceptional medical or social reason for a particular school", {
          help: "Must be backed by a professional letter to count.",
        }),
        field("supporting_docs", "file-multi", "Upload supporting evidence (clergy letter, social worker letter, medical letter)"),
      ],
    },
    {
      id: "send",
      name: "SEND & inclusion",
      fields: [
        field("ehcp", "select-single", "Does the child have an EHCP (Education Health Care Plan)?", {
          required: true,
          options: ["No", "Yes — in place", "Being assessed"],
          regulator: "SEND Code of Practice 2015",
        }),
        field("ehcp_la", "text-short", "Issuing LA (if EHCP)"),
        field("send_needs", "text-long", "Any special educational, medical, or sensory needs we should know about"),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      fields: [
        field("address_truthful", "consent-gdpr", "The address given is the child's permanent home address. Providing false address info can lead to offer being withdrawn.", {
          validation: { required: true },
          regulator: "DfE School Admissions Code",
        }),
        field("parental_responsibility", "consent-gdpr", "I have parental responsibility for the child OR the other parent has consented to this application.", {
          validation: { required: true },
          regulator: "Children Act 1989",
        }),
        field("data", "consent-gdpr", "I consent to my data being shared with the LA and named schools for admissions.", {
          validation: { required: true },
          regulator: "UK GDPR · Art. 6(1)(e)",
        }),
        field("signature", "signature", "Parent / guardian signature", { required: true }),
        field("signed_date", "date", "Date submitted", { required: true }),
      ],
    },
  ],
});

export default PRIMARY_SCHOOL_APPLICATION;
