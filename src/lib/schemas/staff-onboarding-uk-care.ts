import { PackSchema } from "./types";

/**
 * Staff onboarding · UK care providers.
 *
 * Field set reverse-engineered from CQC SAF (Single Assessment Framework),
 * NMC professional registration rules, HCPC standards of practice, the DBS
 * eligibility check, and DSPT data security mandate.
 *
 * Every field is tagged with the regulator citation it satisfies. That tag
 * appears in the PDF audit footer and the CSV `regulator` column.
 */

export const STAFF_ONBOARDING_UK_CARE: PackSchema = {
  productId: "staff-onboarding-uk-care",
  title: "Staff onboarding · UK care providers",
  pathways: [
    { id: "permanent-clinical", name: "Permanent · clinical" },
    { id: "permanent-non-clinical", name: "Permanent · non-clinical" },
    { id: "agency-bank", name: "Agency / bank" },
    { id: "volunteer-student", name: "Volunteer / student" },
  ],
  sections: [
    {
      id: "personal",
      name: "Personal details",
      intro:
        "Identity verification — these fields are matched against the DBS check, NMC / HCPC register, and the right-to-work document.",
      fields: [
        { id: "full_name", label: "Full legal name", type: "text", required: true, regulator: "DBS" },
        { id: "preferred_name", label: "Preferred name", type: "text" },
        { id: "previous_names", label: "Previous names (last 5 years)", type: "text", regulator: "DBS" },
        { id: "date_of_birth", label: "Date of birth", type: "date", required: true, regulator: "DBS" },
        { id: "ni_number", label: "National Insurance number", type: "text", regulator: "HMRC" },
        { id: "email", label: "Email", type: "email", required: true },
        { id: "mobile", label: "Mobile", type: "tel", required: true },
        { id: "address_line_1", label: "Address line 1", type: "text", required: true, regulator: "DBS" },
        { id: "address_line_2", label: "Address line 2", type: "text" },
        { id: "address_city", label: "City", type: "text", required: true, regulator: "DBS" },
        { id: "address_postcode", label: "Postcode", type: "text", required: true, regulator: "DBS" },
        { id: "emergency_contact_name", label: "Emergency contact · name", type: "text", required: true },
        { id: "emergency_contact_relation", label: "Emergency contact · relation", type: "text" },
        { id: "emergency_contact_phone", label: "Emergency contact · phone", type: "tel", required: true },
      ],
    },
    {
      id: "right-to-work",
      name: "Right to work",
      intro:
        "Original document checked in person. Photocopy retained on file. Share code verified against the Home Office service.",
      fields: [
        {
          id: "rtw_doc_type",
          label: "Document type",
          type: "select",
          required: true,
          options: ["UK passport", "EEA passport", "BRP", "Share code", "Birth certificate + NI", "Other"],
          regulator: "Home Office",
        },
        { id: "rtw_doc_number", label: "Document number", type: "text", required: true, regulator: "Home Office" },
        { id: "rtw_issue_date", label: "Issue date", type: "date" },
        { id: "rtw_expiry_date", label: "Expiry date", type: "date" },
        { id: "rtw_share_code", label: "Share code (if applicable)", type: "text" },
        { id: "rtw_checked_by", label: "Checked by · name + role", type: "text", required: true, regulator: "Home Office" },
        { id: "rtw_checked_date", label: "Checked on", type: "date", required: true, regulator: "Home Office" },
      ],
    },
    {
      id: "dbs",
      name: "DBS · barred lists",
      intro:
        "Enhanced disclosure for adult workforce. Barred list checked for adult and child where applicable. Update service preferred.",
      fields: [
        { id: "dbs_certificate_number", label: "DBS certificate number", type: "text", required: true, regulator: "DBS" },
        { id: "dbs_issue_date", label: "DBS issue date", type: "date", required: true, regulator: "DBS" },
        {
          id: "dbs_level",
          label: "Disclosure level",
          type: "select",
          required: true,
          options: ["Basic", "Standard", "Enhanced", "Enhanced + barred (adult)", "Enhanced + barred (adult & child)"],
          regulator: "DBS",
        },
        {
          id: "dbs_update_service",
          label: "Update service member?",
          type: "select",
          required: true,
          options: ["Yes", "No"],
        },
        {
          id: "dbs_barred_adult",
          label: "Adult barred list checked?",
          type: "select",
          required: true,
          options: ["Yes", "No", "N/A"],
          regulator: "DBS",
        },
        {
          id: "dbs_barred_child",
          label: "Child barred list checked?",
          type: "select",
          options: ["Yes", "No", "N/A"],
        },
        { id: "dbs_disclosed_history", label: "Disclosed convictions / cautions", type: "textarea", regulator: "DBS" },
      ],
    },
    {
      id: "professional",
      name: "Professional registration",
      intro:
        "Registered clinicians only. PIN / registration number verified against the NMC, HCPC, or GMC register on the date below.",
      fields: [
        {
          id: "prof_body",
          label: "Regulatory body",
          type: "select",
          required: true,
          options: ["NMC", "HCPC", "GMC", "GPhC", "GDC", "Other"],
          pathways: ["permanent-clinical"],
          regulator: "NMC / HCPC",
        },
        { id: "prof_pin", label: "PIN / registration number", type: "text", required: true, pathways: ["permanent-clinical"], regulator: "NMC / HCPC" },
        { id: "prof_renewal", label: "Renewal date", type: "date", required: true, pathways: ["permanent-clinical"], regulator: "NMC / HCPC" },
        { id: "prof_restrictions", label: "Restrictions / conditions", type: "textarea", pathways: ["permanent-clinical"] },
        {
          id: "prof_revalidation_year",
          label: "Year of last revalidation",
          type: "number",
          pathways: ["permanent-clinical"],
          regulator: "NMC",
        },
      ],
    },
    {
      id: "references",
      name: "References",
      intro:
        "Two references required, at least one from the most recent employer. Personal references not accepted for clinical roles.",
      fields: [
        { id: "ref1_name", label: "Reference 1 · name", type: "text", required: true },
        { id: "ref1_role", label: "Reference 1 · role / relationship", type: "text", required: true },
        { id: "ref1_org", label: "Reference 1 · organisation", type: "text" },
        { id: "ref1_email", label: "Reference 1 · email", type: "email", required: true },
        { id: "ref1_phone", label: "Reference 1 · phone", type: "tel" },
        { id: "ref2_name", label: "Reference 2 · name", type: "text", required: true },
        { id: "ref2_role", label: "Reference 2 · role / relationship", type: "text", required: true },
        { id: "ref2_org", label: "Reference 2 · organisation", type: "text" },
        { id: "ref2_email", label: "Reference 2 · email", type: "email", required: true },
        { id: "ref2_phone", label: "Reference 2 · phone", type: "tel" },
      ],
    },
    {
      id: "health",
      name: "Occupational health",
      intro:
        "Self-declared health screening. Reasonable adjustments captured under Equality Act 2010. Vaccination status recorded for clinical roles.",
      fields: [
        {
          id: "health_screening",
          label: "Fit to undertake the role?",
          type: "select",
          required: true,
          options: ["Fit, no adjustments", "Fit with adjustments", "Awaiting OH assessment", "Unfit at this time"],
          regulator: "Equality Act 2010",
        },
        { id: "adjustments_required", label: "Reasonable adjustments required", type: "textarea", regulator: "Equality Act 2010" },
        {
          id: "vaccination_hep_b",
          label: "Hepatitis B status",
          type: "select",
          options: ["Vaccinated", "Declined", "In progress", "N/A"],
          pathways: ["permanent-clinical"],
        },
        {
          id: "vaccination_flu",
          label: "Seasonal flu",
          type: "select",
          options: ["This season", "Last season", "Declined", "N/A"],
          pathways: ["permanent-clinical", "permanent-non-clinical"],
        },
        {
          id: "vaccination_covid",
          label: "COVID-19 booster",
          type: "select",
          options: ["Up to date", "Out of date", "Declined", "N/A"],
        },
        {
          id: "tb_screening",
          label: "TB screening",
          type: "select",
          options: ["Cleared", "BCG only", "Awaiting", "N/A"],
          pathways: ["permanent-clinical"],
        },
      ],
    },
    {
      id: "training",
      name: "Mandatory training",
      intro:
        "Care Certificate & Skills for Care minimum. Each module dated. Refresh cycle attached in the regulator footer.",
      fields: [
        { id: "train_safeguarding_adults", label: "Safeguarding adults · date", type: "date", required: true, regulator: "Care Certificate Std 10" },
        { id: "train_safeguarding_children", label: "Safeguarding children · date", type: "date" },
        { id: "train_moving_handling", label: "Moving & handling · date", type: "date", required: true, regulator: "Care Certificate Std 13" },
        { id: "train_infection_control", label: "Infection prevention & control · date", type: "date", required: true, regulator: "Care Certificate Std 15" },
        { id: "train_fire_safety", label: "Fire safety · date", type: "date", required: true },
        { id: "train_mca", label: "Mental Capacity Act · date", type: "date", required: true, regulator: "MCA 2005" },
        { id: "train_first_aid", label: "First aid (basic) · date", type: "date", required: true },
        { id: "train_food_hygiene", label: "Food hygiene · date", type: "date", pathways: ["permanent-non-clinical"] },
        { id: "train_medication", label: "Medication awareness · date", type: "date", pathways: ["permanent-clinical", "permanent-non-clinical"] },
        { id: "train_dementia", label: "Dementia awareness · date", type: "date" },
        { id: "train_equality_diversity", label: "Equality & diversity · date", type: "date" },
        { id: "train_data_protection", label: "Data protection (DSPT) · date", type: "date", required: true, regulator: "DSPT" },
      ],
    },
    {
      id: "bank",
      name: "Bank · pension · tax",
      intro:
        "Salary banking + pension auto-enrolment. P45 / new starter checklist on file. Fields hidden for volunteers and student placements.",
      fields: [
        { id: "bank_holder", label: "Account holder name", type: "text", required: true, pathways: ["permanent-clinical", "permanent-non-clinical", "agency-bank"] },
        { id: "bank_sort", label: "Sort code", type: "text", required: true, pathways: ["permanent-clinical", "permanent-non-clinical", "agency-bank"] },
        { id: "bank_account_number", label: "Account number", type: "text", required: true, pathways: ["permanent-clinical", "permanent-non-clinical", "agency-bank"] },
        {
          id: "pension_status",
          label: "Pension status",
          type: "select",
          required: true,
          options: ["Auto-enrolled", "Opted out", "Already in scheme"],
          pathways: ["permanent-clinical", "permanent-non-clinical"],
          regulator: "Pensions Act 2008",
        },
        {
          id: "tax_starter_declaration",
          label: "Starter declaration",
          type: "select",
          required: true,
          options: ["Statement A", "Statement B", "Statement C", "P45 supplied"],
          pathways: ["permanent-clinical", "permanent-non-clinical", "agency-bank"],
          regulator: "HMRC",
        },
        { id: "student_loan", label: "Student loan plan", type: "select", options: ["Plan 1", "Plan 2", "Plan 4", "Postgrad", "None"], pathways: ["permanent-clinical", "permanent-non-clinical", "agency-bank"] },
      ],
    },
    {
      id: "consents",
      name: "Consents · acknowledgements",
      intro:
        "GDPR-compliant data-processing consent + role-specific acknowledgements. Each ticked box is timestamped and audit-hashed at submission.",
      fields: [
        { id: "consent_gdpr", label: "I consent to the processing of my personal data under UK GDPR for the purposes of employment.", type: "checkbox", required: true, regulator: "UK GDPR Art. 6" },
        { id: "consent_data_retention", label: "I understand my data is retained for 6 years post-employment.", type: "checkbox", required: true, regulator: "UK GDPR Art. 5(1)(e)" },
        { id: "consent_code_of_conduct", label: "I have read and agree to the Code of Conduct for healthcare support workers.", type: "checkbox", required: true, regulator: "Skills for Health" },
        { id: "consent_safeguarding", label: "I understand my safeguarding obligations and the routes for raising concerns.", type: "checkbox", required: true, regulator: "Care Act 2014" },
        { id: "consent_whistleblowing", label: "I have read the whistleblowing policy and know how to raise a concern.", type: "checkbox", required: true, regulator: "PIDA 1998" },
        { id: "consent_dignity", label: "I commit to upholding dignity, respect, and person-centred care.", type: "checkbox", required: true, regulator: "CQC Reg. 10" },
        { id: "consent_uniform", label: "I will follow the uniform and PPE policy.", type: "checkbox", required: true },
        { id: "consent_social_media", label: "I have read and will follow the social media policy.", type: "checkbox", required: true },
        { id: "consent_dna", label: "I declare I am not on any barred list and have not been disqualified from working with vulnerable adults.", type: "checkbox", required: true, regulator: "DBS" },
        { id: "consent_changes", label: "I will notify my employer within 7 days of any change to my DBS, professional registration, or right-to-work status.", type: "checkbox", required: true },
      ],
    },
  ],
};

export default STAFF_ONBOARDING_UK_CARE;
