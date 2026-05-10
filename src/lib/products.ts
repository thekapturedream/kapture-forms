/**
 * Kapture Forms · product catalog (source of truth).
 *
 * Single canonical list — landing page, product page, Stripe Checkout
 * route, dashboard, and webhook all read from here. Edit a product here
 * and it propagates everywhere.
 */

export type ExportFormat = "pdf" | "docx" | "html" | "csv" | "gforms" | "web";
export type ProductStatus = "live" | "soon";
export type Industry =
  | "healthcare"
  | "hr"
  | "finance"
  | "legal"
  | "education"
  | "hospitality"
  | "realestate"
  | "construction"
  | "public"
  | "logistics";

export interface ProductPrice {
  /** Stripe Price ID (one-off £29 download) */
  oneOff?: string;
  /** Stripe Price ID (subscription £29/mo hosted) */
  subscription?: string;
  /** Display strings — kept here for marketing copy */
  oneOffDisplay: string;
  subscriptionDisplay: string;
}

export interface Product {
  id: string;
  /** URL slug — `/products/[slug]` */
  slug: string;
  /** Marketing initial — 2 letters on the product cover */
  initials: string;
  industry: Industry;
  status: ProductStatus;
  title: string;
  shortTitle: string;
  meta: string;
  description: string;
  longDescription: string;
  pathways: { id: string; name: string; description: string }[];
  sections: { id: string; name: string; fieldCount: number }[];
  exports: ExportFormat[];
  price: ProductPrice;
  /** Optional release window for `soon` products */
  release?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "staff-onboarding-uk-care",
    slug: "staff-onboarding-uk-care",
    initials: "SO",
    industry: "healthcare",
    status: "live",
    title: "Staff onboarding · UK care providers",
    shortTitle: "Staff onboarding · UK care",
    meta: "4 pathways · 19 sections · 12 templates",
    description:
      "Permanent clinical, permanent non-clinical, agency / bank, volunteer / student. DBS, NMC, HCPC, mandatory training, references, bank, pension. Conditional fields per role.",
    longDescription:
      "The staff onboarding pack the regulator wrote. Four pathways covering every onboarding case a UK care provider faces, each with conditional logic for role, setting, and risk band. Fields locked to CQC SAF, NMC, HCPC, and DSPT requirements. Every submission is signed, timestamped, and audit-hashed — defensible in front of an inspector on day one.",
    pathways: [
      {
        id: "permanent-clinical",
        name: "Permanent · clinical",
        description: "Registered nurses, allied health professionals, clinical leads.",
      },
      {
        id: "permanent-non-clinical",
        name: "Permanent · non-clinical",
        description: "Care assistants, kitchen, housekeeping, maintenance, admin.",
      },
      {
        id: "agency-bank",
        name: "Agency / bank",
        description: "Short-term, agency-supplied, bank-of-staff arrangements.",
      },
      {
        id: "volunteer-student",
        name: "Volunteer / student",
        description: "Placements, volunteers, work experience, student nurses.",
      },
    ],
    sections: [
      { id: "personal", name: "Personal details", fieldCount: 12 },
      { id: "right-to-work", name: "Right to work", fieldCount: 8 },
      { id: "dbs", name: "DBS / barred lists", fieldCount: 6 },
      { id: "professional", name: "Professional registration (NMC / HCPC)", fieldCount: 7 },
      { id: "references", name: "References", fieldCount: 5 },
      { id: "health", name: "Occupational health", fieldCount: 9 },
      { id: "training", name: "Mandatory training", fieldCount: 14 },
      { id: "bank", name: "Bank + pension", fieldCount: 8 },
      { id: "consents", name: "Consents + acknowledgements", fieldCount: 11 },
    ],
    exports: ["pdf", "docx", "html", "csv", "gforms", "web"],
    price: {
      oneOff: process.env.STRIPE_PRICE_STAFF_ONBOARDING_ONEOFF,
      subscription: process.env.STRIPE_PRICE_STAFF_ONBOARDING_SUB,
      oneOffDisplay: "£29",
      subscriptionDisplay: "£29 / mo",
    },
  },
  {
    id: "patient-intake-primary-care",
    slug: "patient-intake-primary-care",
    initials: "PI",
    industry: "healthcare",
    status: "soon",
    title: "Patient intake · primary care",
    shortTitle: "Patient intake · primary care",
    meta: "3 pathways · 12 sections",
    description:
      "New patient registration, GP transfer, NHS-funded continuing healthcare. Demographics, NHS number, allergies, meds, capacity flags.",
    longDescription: "",
    pathways: [],
    sections: [],
    exports: ["pdf", "csv", "html"],
    release: "Q3 2026",
    price: { oneOffDisplay: "£39", subscriptionDisplay: "£39 / mo" },
  },
  {
    id: "incident-report-adverse-event",
    slug: "incident-report-adverse-event",
    initials: "IR",
    industry: "healthcare",
    status: "soon",
    title: "Incident report · adverse event",
    shortTitle: "Incident report · adverse event",
    meta: "5 categories · 8 sections",
    description:
      "Falls, medication errors, pressure injuries, behaviour incidents, near-miss. SAF mapping, RCA, escalation routing.",
    longDescription: "",
    pathways: [],
    sections: [],
    exports: ["pdf", "html", "csv"],
    release: "Q3 2026",
    price: { oneOffDisplay: "£19", subscriptionDisplay: "£19 / mo" },
  },
  {
    id: "consent-capacity-mca-dols",
    slug: "consent-capacity-mca-dols",
    initials: "CC",
    industry: "healthcare",
    status: "soon",
    title: "Consent & capacity · MCA / DoLS",
    shortTitle: "Consent & capacity",
    meta: "2 pathways · 6 sections",
    description:
      "MCA decision-specific, DoLS standard authorisation, ReSPECT — best-interests rationale captured, professional sign-off.",
    longDescription: "",
    pathways: [],
    sections: [],
    exports: ["pdf", "docx"],
    release: "Q4 2026",
    price: { oneOffDisplay: "£29", subscriptionDisplay: "£29 / mo" },
  },
  {
    id: "safeguarding-referral-adults",
    slug: "safeguarding-referral-adults",
    initials: "SR",
    industry: "healthcare",
    status: "soon",
    title: "Safeguarding referral · adults",
    shortTitle: "Safeguarding referral",
    meta: "1 pathway · 5 sections",
    description:
      "Section 42 enquiry triggers, allegation capture, automatic LA / CQC notification, audit-hashed timeline.",
    longDescription: "",
    pathways: [],
    sections: [],
    exports: ["pdf", "html"],
    release: "Q4 2026",
    price: { oneOffDisplay: "£19", subscriptionDisplay: "£19 / mo" },
  },
  {
    id: "family-agreement-consent",
    slug: "family-agreement-consent",
    initials: "FA",
    industry: "healthcare",
    status: "soon",
    title: "Family agreement & consent",
    shortTitle: "Family agreement & consent",
    meta: "1 pathway · 4 sections",
    description:
      "Photography, social media, end-of-life preferences, advance decisions, communication preferences. Refresh annually.",
    longDescription: "",
    pathways: [],
    sections: [],
    exports: ["pdf", "gforms"],
    release: "Q1 2027",
    price: { oneOffDisplay: "£12", subscriptionDisplay: "£12 / mo" },
  },
];

export const INDUSTRIES: Array<{
  id: Industry;
  initials: string;
  label: string;
  description: string;
  status: ProductStatus;
  release?: string;
  productCount: number;
}> = [
  {
    id: "healthcare",
    initials: "HC",
    label: "Healthcare",
    description: "CQC SAF aligned. NMC, HCPC, DBS, DSPT, ReSPECT, DoLS.",
    status: "live",
    productCount: PRODUCTS.filter((p) => p.industry === "healthcare" && p.status === "live").length,
  },
  {
    id: "hr",
    initials: "HR",
    label: "HR & people",
    description: "Onboarding, performance, exit, grievance, return to work.",
    status: "soon",
    release: "Q3 2026",
    productCount: 0,
  },
  {
    id: "finance",
    initials: "FN",
    label: "Finance & banking",
    description: "KYC, AML, FCA suitability, customer onboarding.",
    status: "soon",
    release: "Q4 2026",
    productCount: 0,
  },
  {
    id: "legal",
    initials: "LG",
    label: "Legal",
    description: "Client intake, conflict checks, regulatory notices, AML.",
    status: "soon",
    release: "Q4 2026",
    productCount: 0,
  },
  {
    id: "education",
    initials: "ED",
    label: "Education",
    description: "Admissions, parent consent, SEND plans, trip forms.",
    status: "soon",
    release: "Q1 2027",
    productCount: 0,
  },
  {
    id: "hospitality",
    initials: "HS",
    label: "Hospitality",
    description: "Booking, T&Cs, supplier onboarding, EHO compliance.",
    status: "soon",
    release: "Q2 2027",
    productCount: 0,
  },
  {
    id: "realestate",
    initials: "RE",
    label: "Real estate",
    description: "Tenant referencing, AML, property disclosure, EPC.",
    status: "soon",
    release: "Q2 2027",
    productCount: 0,
  },
  {
    id: "construction",
    initials: "CN",
    label: "Construction",
    description: "RAMS, H&S, CDM, contractor onboarding, near-miss.",
    status: "soon",
    release: "Q3 2027",
    productCount: 0,
  },
  {
    id: "public",
    initials: "PB",
    label: "Public sector",
    description: "Grants, licensing, disclosure, citizen service requests.",
    status: "soon",
    release: "Q3 2027",
    productCount: 0,
  },
  {
    id: "logistics",
    initials: "LO",
    label: "Logistics",
    description: "Driver onboarding, tachograph, customs, incident.",
    status: "soon",
    release: "Q4 2027",
    productCount: 0,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getLiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.status === "live");
}

export const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: "PDF",
  docx: "DOCX",
  html: "HTML",
  csv: "CSV",
  gforms: "GFORMS",
  web: "HOSTED",
};
