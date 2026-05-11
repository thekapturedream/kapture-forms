/**
 * Flat searchable catalog of every form Kapture either ships or has
 * scheduled. The search hero on the landing page reads from this list,
 * not from PRODUCTS — many industries have no live product yet but
 * still need to surface to a buyer who searches the keyword.
 */

export interface SearchEntry {
  /** Display title shown in the result row. */
  title: string;
  /** Sector tag — drives the chip colour and the secondary line. */
  industry:
    | "Healthcare"
    | "HR & people"
    | "Finance"
    | "Legal"
    | "Education"
    | "Hospitality"
    | "Real estate"
    | "Construction"
    | "Public sector"
    | "Logistics";
  /** What you can do with this entry today. */
  status: "live" | "soon";
  /** Release window when status === "soon" */
  release?: string;
  /** Where to send the user when they pick this row.
   *  For `live` entries: an internal /products/[slug] route.
   *  For `soon` entries: a mailto: that pre-fills "notify me". */
  href: string;
  /** Free-text keywords used for fuzzy matching (regulator names, synonyms,
   *  HRIS systems, common search queries). */
  keywords: string[];
}

const NOTIFY = (label: string) =>
  `mailto:forms@thekapture.com?subject=${encodeURIComponent(`Notify me · ${label}`)}&body=${encodeURIComponent(
    `Please email me when "${label}" goes live on Kapture Forms.`
  )}`;

export const SEARCH_CATALOG: SearchEntry[] = [
  // --- Healthcare (live + soon) ----------------------------------------
  {
    title: "Staff onboarding · UK care",
    industry: "Healthcare",
    status: "live",
    href: "/products/staff-onboarding-uk-care",
    keywords: [
      "onboarding",
      "staff",
      "carer",
      "nurse",
      "DBS",
      "NMC",
      "HCPC",
      "Care Certificate",
      "DSPT",
      "right to work",
      "CQC",
      "agency",
      "bank",
    ],
  },
  {
    title: "Patient intake · primary care",
    industry: "Healthcare",
    status: "soon",
    release: "Q3 2026",
    href: NOTIFY("Patient intake · primary care"),
    keywords: ["GP", "registration", "NHS number", "intake", "demographics"],
  },
  {
    title: "Incident report · adverse event",
    industry: "Healthcare",
    status: "soon",
    release: "Q3 2026",
    href: NOTIFY("Incident report · adverse event"),
    keywords: ["incident", "fall", "medication error", "near miss", "RCA", "SAF"],
  },
  {
    title: "Consent & capacity · MCA / DoLS",
    industry: "Healthcare",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Consent & capacity · MCA / DoLS"),
    keywords: ["MCA", "DoLS", "ReSPECT", "capacity", "consent", "best interests"],
  },
  {
    title: "Safeguarding referral · adults",
    industry: "Healthcare",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Safeguarding referral · adults"),
    keywords: ["safeguarding", "Section 42", "allegation", "abuse", "LA"],
  },
  {
    title: "Family agreement & consent",
    industry: "Healthcare",
    status: "soon",
    release: "Q1 2027",
    href: NOTIFY("Family agreement & consent"),
    keywords: ["family", "advance decision", "photography", "communications"],
  },

  // --- HR & people ------------------------------------------------------
  {
    title: "HR onboarding · UK employer",
    industry: "HR & people",
    status: "soon",
    release: "Q3 2026",
    href: NOTIFY("HR onboarding · UK employer"),
    keywords: ["HR", "onboarding", "starter declaration", "P45", "Bamboo", "Breathe"],
  },
  {
    title: "Performance review",
    industry: "HR & people",
    status: "soon",
    release: "Q3 2026",
    href: NOTIFY("Performance review"),
    keywords: ["performance", "review", "appraisal", "OKR", "1-on-1"],
  },
  {
    title: "Exit interview",
    industry: "HR & people",
    status: "soon",
    release: "Q3 2026",
    href: NOTIFY("Exit interview"),
    keywords: ["exit", "leaver", "offboarding"],
  },
  {
    title: "Grievance · disciplinary",
    industry: "HR & people",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Grievance · disciplinary"),
    keywords: ["grievance", "disciplinary", "ACAS", "tribunal"],
  },
  {
    title: "Return to work",
    industry: "HR & people",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Return to work"),
    keywords: ["sickness", "absence", "return to work", "self-cert"],
  },

  // --- Finance ----------------------------------------------------------
  {
    title: "AML / KYC onboarding",
    industry: "Finance",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("AML / KYC onboarding"),
    keywords: ["AML", "KYC", "FCA", "money laundering", "PEP"],
  },
  {
    title: "FCA suitability assessment",
    industry: "Finance",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("FCA suitability assessment"),
    keywords: ["FCA", "suitability", "advice", "investment"],
  },
  {
    title: "Customer onboarding · banking",
    industry: "Finance",
    status: "soon",
    release: "Q1 2027",
    href: NOTIFY("Customer onboarding · banking"),
    keywords: ["customer onboarding", "bank", "current account"],
  },

  // --- Legal ------------------------------------------------------------
  {
    title: "Client intake · legal",
    industry: "Legal",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Client intake · legal"),
    keywords: ["client intake", "matter", "engagement"],
  },
  {
    title: "Conflict check",
    industry: "Legal",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("Conflict check"),
    keywords: ["conflict", "SRA", "compliance"],
  },
  {
    title: "AML · solicitors",
    industry: "Legal",
    status: "soon",
    release: "Q4 2026",
    href: NOTIFY("AML · solicitors"),
    keywords: ["AML", "SRA", "money laundering"],
  },

  // --- Education --------------------------------------------------------
  {
    title: "Admissions · school",
    industry: "Education",
    status: "soon",
    release: "Q1 2027",
    href: NOTIFY("Admissions · school"),
    keywords: ["admissions", "school", "primary", "secondary"],
  },
  {
    title: "Parent consent",
    industry: "Education",
    status: "soon",
    release: "Q1 2027",
    href: NOTIFY("Parent consent"),
    keywords: ["parent consent", "trip", "photo", "media"],
  },
  {
    title: "SEND plan",
    industry: "Education",
    status: "soon",
    release: "Q1 2027",
    href: NOTIFY("SEND plan"),
    keywords: ["SEND", "EHCP", "special needs"],
  },

  // --- Hospitality ------------------------------------------------------
  {
    title: "Booking T&Cs",
    industry: "Hospitality",
    status: "soon",
    release: "Q2 2027",
    href: NOTIFY("Booking T&Cs"),
    keywords: ["booking", "terms", "hotel", "restaurant"],
  },
  {
    title: "Supplier onboarding · hospitality",
    industry: "Hospitality",
    status: "soon",
    release: "Q2 2027",
    href: NOTIFY("Supplier onboarding · hospitality"),
    keywords: ["supplier", "EHO", "food hygiene"],
  },

  // --- Real estate ------------------------------------------------------
  {
    title: "Tenant referencing",
    industry: "Real estate",
    status: "soon",
    release: "Q2 2027",
    href: NOTIFY("Tenant referencing"),
    keywords: ["tenant", "referencing", "rent", "right to rent"],
  },
  {
    title: "Property disclosure (TA6)",
    industry: "Real estate",
    status: "soon",
    release: "Q2 2027",
    href: NOTIFY("Property disclosure (TA6)"),
    keywords: ["TA6", "disclosure", "law society", "conveyancing"],
  },

  // --- Construction -----------------------------------------------------
  {
    title: "RAMS · risk + method",
    industry: "Construction",
    status: "soon",
    release: "Q3 2027",
    href: NOTIFY("RAMS"),
    keywords: ["RAMS", "risk assessment", "method statement", "CDM"],
  },
  {
    title: "Contractor onboarding",
    industry: "Construction",
    status: "soon",
    release: "Q3 2027",
    href: NOTIFY("Contractor onboarding"),
    keywords: ["contractor", "subcontractor", "PQQ"],
  },
  {
    title: "Near-miss report",
    industry: "Construction",
    status: "soon",
    release: "Q3 2027",
    href: NOTIFY("Near-miss report"),
    keywords: ["near miss", "RIDDOR", "HSE"],
  },

  // --- Public sector ----------------------------------------------------
  {
    title: "Grant application",
    industry: "Public sector",
    status: "soon",
    release: "Q3 2027",
    href: NOTIFY("Grant application"),
    keywords: ["grant", "funding", "council"],
  },
  {
    title: "Citizen service request",
    industry: "Public sector",
    status: "soon",
    release: "Q3 2027",
    href: NOTIFY("Citizen service request"),
    keywords: ["citizen", "council", "service request"],
  },

  // --- Logistics --------------------------------------------------------
  {
    title: "Driver onboarding",
    industry: "Logistics",
    status: "soon",
    release: "Q4 2027",
    href: NOTIFY("Driver onboarding"),
    keywords: ["driver", "DVLA", "tachograph", "CPC"],
  },
  {
    title: "Customs declaration",
    industry: "Logistics",
    status: "soon",
    release: "Q4 2027",
    href: NOTIFY("Customs declaration"),
    keywords: ["customs", "HMRC", "EORI"],
  },
];

/**
 * Plain ranked search. We don't need a fuzzy library for ~30 entries —
 * a normalised includes-match against title + industry + keywords does it.
 */
export function searchCatalog(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_CATALOG;
  return SEARCH_CATALOG
    .map((e) => {
      const title = e.title.toLowerCase();
      const ind = e.industry.toLowerCase();
      const kws = e.keywords.join(" ").toLowerCase();
      let score = 0;
      if (title.includes(q)) score += 4;
      if (ind.includes(q)) score += 2;
      if (kws.includes(q)) score += 1;
      // Boost live results slightly so they rise on equal matches
      if (e.status === "live") score += 0.5;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e);
}

export const POPULAR_QUERIES: string[] = [
  "Staff onboarding",
  "AML",
  "Tenant referencing",
  "RAMS",
  "Performance review",
  "Patient intake",
];
