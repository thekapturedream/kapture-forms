/**
 * Kapture Forms · bundles.
 *
 * Curated multi-pack offers — typically one live pack + several roadmap
 * packs at a discount. Pre-order pricing: buyer gets the live pack
 * immediately, the rest are emailed when each launches.
 */

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  industry: string;
  /** Short marketing line shown on the card. */
  hook: string;
  /** Each pack's display title — keep these short. */
  packs: string[];
  /** Bundle price in pence. */
  bundlePence: number;
  /** Sum of individual pack RRPs in pence (for "save £X" display). */
  rrpPence: number;
  /** "PRE-ORDER" if any pack is still roadmap; "LIVE" if all live. */
  status: "live" | "pre-order";
}

export const BUNDLES: Bundle[] = [
  {
    id: "healthcare-starter",
    slug: "healthcare-starter",
    title: "Healthcare starter",
    industry: "Healthcare",
    hook: "The three packs every UK care provider needs first.",
    packs: ["Staff onboarding · UK care", "Patient intake · primary care", "Incident report · adverse event"],
    bundlePence: 6900,
    rrpPence: 9700,
    status: "pre-order",
  },
  {
    id: "hr-essentials",
    slug: "hr-essentials",
    title: "HR essentials",
    industry: "HR & people",
    hook: "Hire to exit, performance to PIP — five packs, one bundle.",
    packs: [
      "HR onboarding · UK employer",
      "Performance review",
      "Exit interview",
      "Return to work",
      "Grievance · disciplinary",
    ],
    bundlePence: 9900,
    rrpPence: 14500,
    status: "pre-order",
  },
  {
    id: "compliance-fundamentals",
    slug: "compliance-fundamentals",
    title: "Compliance fundamentals",
    industry: "Cross-sector",
    hook: "AML, KYC, conflict, DSAR — the four every regulated business runs.",
    packs: [
      "AML / KYC onboarding",
      "FCA suitability assessment",
      "Conflict check",
      "GDPR · DSAR (data subject access)",
    ],
    bundlePence: 7900,
    rrpPence: 11600,
    status: "pre-order",
  },
  {
    id: "construction-hs",
    slug: "construction-hs",
    title: "Construction H&S",
    industry: "Construction",
    hook: "RAMS, contractors, near-miss, toolbox — H&S in one bundle.",
    packs: ["RAMS · risk + method", "Contractor onboarding", "Near-miss report", "Toolbox talk · sign-off"],
    bundlePence: 6900,
    rrpPence: 11600,
    status: "pre-order",
  },
  {
    id: "logistics-fleet",
    slug: "logistics-fleet",
    title: "Logistics fleet",
    industry: "Logistics",
    hook: "Drivers, vehicles, tacho, customs — fleet ops covered.",
    packs: [
      "Driver onboarding · HGV",
      "Vehicle defect report (VOR)",
      "Tachograph download log",
      "Proof of delivery (POD)",
    ],
    bundlePence: 6900,
    rrpPence: 11600,
    status: "pre-order",
  },
  {
    id: "education-core",
    slug: "education-core",
    title: "Education core",
    industry: "Education",
    hook: "Admissions, parent consent, SEND, behaviour — every school needs.",
    packs: ["Admissions · school", "Parent consent", "SEND plan", "Behaviour incident · school"],
    bundlePence: 6900,
    rrpPence: 11600,
    status: "pre-order",
  },
];

export function moneyFromPence(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}
