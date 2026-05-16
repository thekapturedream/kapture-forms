/**
 * Consent & capacity · MCA / DoLS.
 *
 * Two-stage capacity assessment under MCA 2005 s.2/3, plus the
 * best-interests decision template under s.4 and the DoLS / LPS
 * authorisation route.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const MCA_DOLS: PackSchema = toPackSchema({
  productId: "consent-capacity-mca-dols",
  title: "Consent & capacity · MCA / DoLS",
  pathways: [
    { id: "capacity-decision", name: "Specific decision — capacity assessment" },
    { id: "best-interests", name: "Best interests — lacking capacity" },
    { id: "dols", name: "DoLS authorisation request" },
  ],
  sections: [
    {
      id: "header",
      name: "Person & decision",
      fields: [
        field("person_name", "name-full", "Person's full name", { required: true, regulator: "MCA 2005" }),
        field("dob", "dob", "Date of birth", { required: true }),
        field("nhs_number", "text-short", "NHS number"),
        field("setting", "select-single", "Setting", {
          required: true,
          options: ["Care home", "Hospital", "Own home", "Supported living", "Hospice"],
        }),
        field("assessor_name", "name-full", "Assessor name", { required: true }),
        field("assessor_role", "text-short", "Assessor role / profession", { required: true }),
        field("assessment_date", "date", "Date of assessment", { required: true }),
        field("decision_in_question", "text-long", "Specific decision being assessed", {
          required: true,
          placeholder:
            "Be specific — capacity is decision-specific. e.g. 'Decision to consent to surgery for fractured neck of femur'",
          regulator: "MCA 2005 s.2",
        }),
      ],
    },
    {
      id: "presumption",
      name: "Principles & presumption",
      intro: "MCA Principle 1 — assume capacity unless established otherwise.",
      fields: [
        field("trigger", "text-long", "What triggered the need to assess capacity?", {
          required: true,
        }),
        field("efforts_to_support", "text-long", "What has been done to help the person make the decision themselves?", {
          required: true,
          placeholder:
            "Plain language, decision aids, time of day, calmer environment, involving someone they trust, taking a break.",
          regulator: "MCA 2005 s.1(3)",
        }),
        field("communication_aids", "text-long", "Communication aids used (interpreter, Talking Mats, pictures)"),
      ],
    },
    {
      id: "diagnostic",
      name: "Diagnostic test — s.2",
      fields: [
        field("impairment_present", "select-single", "Is there an impairment of, or disturbance in, the functioning of the mind or brain?", {
          required: true,
          options: ["Yes", "No"],
          regulator: "MCA 2005 s.2(1)",
        }),
        field("impairment_nature", "text-long", "Nature of the impairment", {
          placeholder: "Dementia, learning disability, mental illness, brain injury, intoxication, etc.",
        }),
        field("temporary_or_permanent", "select-single", "Temporary or longer-term?", {
          options: ["Temporary — wait & retry if possible", "Fluctuating", "Longer-term"],
        }),
      ],
    },
    {
      id: "functional",
      name: "Functional test — s.3",
      intro: "Can the person do all four of these in relation to this specific decision?",
      fields: [
        field("can_understand", "select-single", "1. Understand the information relevant to the decision", {
          required: true,
          options: ["Yes", "No"],
          regulator: "MCA 2005 s.3(1)(a)",
        }),
        field("understand_evidence", "text-long", "Evidence — what they understood / didn't"),
        field("can_retain", "select-single", "2. Retain the information long enough to use it", {
          required: true,
          options: ["Yes", "No"],
          regulator: "MCA 2005 s.3(1)(b)",
        }),
        field("retain_evidence", "text-long", "Evidence"),
        field("can_use_weigh", "select-single", "3. Use or weigh the information as part of the decision", {
          required: true,
          options: ["Yes", "No"],
          regulator: "MCA 2005 s.3(1)(c)",
        }),
        field("weigh_evidence", "text-long", "Evidence"),
        field("can_communicate", "select-single", "4. Communicate the decision (any means)", {
          required: true,
          options: ["Yes", "No"],
          regulator: "MCA 2005 s.3(1)(d)",
        }),
        field("communicate_evidence", "text-long", "Evidence"),
        field("conclusion", "select-single", "Conclusion", {
          required: true,
          options: [
            "Has capacity for this decision",
            "Lacks capacity for this decision",
            "Capacity fluctuates — reassess",
          ],
          regulator: "MCA 2005",
        }),
      ],
    },
    {
      id: "best-interests",
      name: "Best interests — s.4",
      intro: "Complete only when capacity is lacking.",
      fields: [
        field("person_wishes", "text-long", "Person's past and present wishes, feelings, beliefs and values", {
          regulator: "MCA 2005 s.4(6)",
        }),
        field("consultation", "text-long", "Who has been consulted? (family, friends, attorney, deputy, IMCA, professionals)"),
        field("less_restrictive", "text-long", "Less restrictive options considered", {
          regulator: "MCA 2005 s.1(6)",
        }),
        field("balance_sheet", "text-long", "Benefits and risks weighed", {
          placeholder: "Use a structured benefits / risks list for the proposed and alternative options.",
        }),
        field("decision_in_best_interests", "text-long", "Decision reached in the person's best interests", {
          required: true,
        }),
      ],
    },
    {
      id: "dols",
      name: "DoLS / LPS",
      intro:
        "Required when someone in a care home or hospital who lacks capacity is being deprived of liberty under continuous supervision.",
      fields: [
        field("acid_test", "consent-gdpr", "The person is under continuous supervision and control AND not free to leave (acid test).", {
          regulator: "Cheshire West",
        }),
        field("authorisation_type", "select-single", "Authorisation route", {
          options: ["Standard DoLS", "Urgent DoLS (7 days)", "Community DoL — Court of Protection", "LPS (when in force)", "Not required"],
        }),
        field("authorisation_date", "date", "Authorisation date"),
        field("expiry_date", "date", "Expiry date"),
      ],
    },
    {
      id: "sign",
      name: "Sign-off",
      fields: [
        field("assessor_signature", "signature", "Assessor signature", { required: true }),
        field("decision_maker", "name-full", "Best-interests decision-maker (if different)"),
        field("decision_maker_signature", "signature", "Decision-maker signature"),
        field("signed_date", "date", "Date signed", { required: true }),
      ],
    },
  ],
});

export default MCA_DOLS;
