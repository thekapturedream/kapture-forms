/**
 * Flat searchable catalog of every form Kapture either ships or has
 * scheduled. The search hero on the landing page reads from this list.
 * Many industries have no live product yet but still need to surface to
 * a buyer who searches the keyword.
 */

export interface SearchEntry {
  title: string;
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
  status: "live" | "soon";
  release?: string;
  /** Internal route for live, mailto for soon. */
  href: string;
  keywords: string[];
}

const NOTIFY = (label: string) =>
  `mailto:forms@thekapture.com?subject=${encodeURIComponent(`Notify me · ${label}`)}&body=${encodeURIComponent(
    `Please email me when "${label}" goes live on Kapture Forms.`
  )}`;

export const SEARCH_CATALOG: SearchEntry[] = [
  // ─── Healthcare ──────────────────────────────────────────────────
  {
    title: "Staff onboarding · UK care",
    industry: "Healthcare",
    status: "live",
    href: "/products/staff-onboarding-uk-care",
    keywords: ["onboarding","staff","carer","nurse","DBS","NMC","HCPC","Care Certificate","DSPT","right to work","CQC","agency","bank"],
  },
  { title: "Patient intake · primary care", industry: "Healthcare", status: "soon", release: "Q3 2026", href: NOTIFY("Patient intake · primary care"), keywords: ["GP","registration","NHS number","intake","demographics"] },
  { title: "Incident report · adverse event", industry: "Healthcare", status: "soon", release: "Q3 2026", href: NOTIFY("Incident report · adverse event"), keywords: ["incident","fall","medication error","near miss","RCA","SAF"] },
  { title: "Consent & capacity · MCA / DoLS", industry: "Healthcare", status: "soon", release: "Q4 2026", href: NOTIFY("Consent & capacity · MCA / DoLS"), keywords: ["MCA","DoLS","ReSPECT","capacity","consent","best interests"] },
  { title: "Safeguarding referral · adults", industry: "Healthcare", status: "soon", release: "Q4 2026", href: NOTIFY("Safeguarding referral · adults"), keywords: ["safeguarding","Section 42","allegation","abuse","LA"] },
  { title: "Family agreement & consent", industry: "Healthcare", status: "soon", release: "Q1 2027", href: NOTIFY("Family agreement & consent"), keywords: ["family","advance decision","photography","communications"] },
  { title: "Medication management record", industry: "Healthcare", status: "soon", release: "Q1 2027", href: NOTIFY("Medication management record"), keywords: ["MAR","medication","pharmacy","controlled drugs"] },
  { title: "Pressure ulcer risk · Waterlow", industry: "Healthcare", status: "soon", release: "Q1 2027", href: NOTIFY("Pressure ulcer risk · Waterlow"), keywords: ["pressure","Waterlow","skin integrity"] },

  // ─── HR & people ─────────────────────────────────────────────────
  { title: "HR onboarding · UK employer", industry: "HR & people", status: "soon", release: "Q3 2026", href: NOTIFY("HR onboarding · UK employer"), keywords: ["HR","onboarding","starter declaration","P45","Bamboo","Breathe"] },
  { title: "Performance review", industry: "HR & people", status: "soon", release: "Q3 2026", href: NOTIFY("Performance review"), keywords: ["performance","appraisal","OKR","1-on-1"] },
  { title: "Exit interview", industry: "HR & people", status: "soon", release: "Q3 2026", href: NOTIFY("Exit interview"), keywords: ["exit","leaver","offboarding"] },
  { title: "Grievance · disciplinary", industry: "HR & people", status: "soon", release: "Q4 2026", href: NOTIFY("Grievance · disciplinary"), keywords: ["grievance","disciplinary","ACAS","tribunal"] },
  { title: "Return to work", industry: "HR & people", status: "soon", release: "Q4 2026", href: NOTIFY("Return to work"), keywords: ["sickness","absence","self-cert"] },
  { title: "PIP · performance improvement plan", industry: "HR & people", status: "soon", release: "Q4 2026", href: NOTIFY("PIP · performance improvement plan"), keywords: ["PIP","improvement","review"] },
  { title: "Parental leave request", industry: "HR & people", status: "soon", release: "Q4 2026", href: NOTIFY("Parental leave request"), keywords: ["maternity","paternity","shared parental","SPL"] },
  { title: "Flexible working request", industry: "HR & people", status: "soon", release: "Q1 2027", href: NOTIFY("Flexible working request"), keywords: ["flexible","remote","hybrid"] },

  // ─── Finance ─────────────────────────────────────────────────────
  { title: "AML / KYC onboarding", industry: "Finance", status: "soon", release: "Q4 2026", href: NOTIFY("AML / KYC onboarding"), keywords: ["AML","KYC","FCA","money laundering","PEP"] },
  { title: "FCA suitability assessment", industry: "Finance", status: "soon", release: "Q4 2026", href: NOTIFY("FCA suitability assessment"), keywords: ["FCA","suitability","advice","investment"] },
  { title: "Customer onboarding · banking", industry: "Finance", status: "soon", release: "Q1 2027", href: NOTIFY("Customer onboarding · banking"), keywords: ["customer onboarding","bank","current account"] },
  { title: "SAR · suspicious activity report", industry: "Finance", status: "soon", release: "Q1 2027", href: NOTIFY("SAR · suspicious activity report"), keywords: ["SAR","NCA","money laundering","reporting"] },
  { title: "Credit application", industry: "Finance", status: "soon", release: "Q1 2027", href: NOTIFY("Credit application"), keywords: ["credit","loan","CCA"] },

  // ─── Legal ───────────────────────────────────────────────────────
  { title: "Client intake · legal", industry: "Legal", status: "soon", release: "Q4 2026", href: NOTIFY("Client intake · legal"), keywords: ["client intake","matter","engagement"] },
  { title: "Conflict check", industry: "Legal", status: "soon", release: "Q4 2026", href: NOTIFY("Conflict check"), keywords: ["conflict","SRA","compliance"] },
  { title: "AML · solicitors", industry: "Legal", status: "soon", release: "Q4 2026", href: NOTIFY("AML · solicitors"), keywords: ["AML","SRA","money laundering"] },
  { title: "GDPR · DSAR (data subject access)", industry: "Legal", status: "soon", release: "Q1 2027", href: NOTIFY("GDPR · DSAR (data subject access)"), keywords: ["GDPR","DSAR","data protection","ICO"] },
  { title: "GDPR · breach notification", industry: "Legal", status: "soon", release: "Q1 2027", href: NOTIFY("GDPR · breach notification"), keywords: ["GDPR","breach","ICO","72 hours"] },

  // ─── Education ───────────────────────────────────────────────────
  { title: "Admissions · school", industry: "Education", status: "soon", release: "Q1 2027", href: NOTIFY("Admissions · school"), keywords: ["admissions","school","primary","secondary"] },
  { title: "Parent consent", industry: "Education", status: "soon", release: "Q1 2027", href: NOTIFY("Parent consent"), keywords: ["parent consent","trip","photo","media"] },
  { title: "SEND plan", industry: "Education", status: "soon", release: "Q1 2027", href: NOTIFY("SEND plan"), keywords: ["SEND","EHCP","special needs"] },
  { title: "Behaviour incident · school", industry: "Education", status: "soon", release: "Q2 2027", href: NOTIFY("Behaviour incident · school"), keywords: ["behaviour","incident","detention"] },

  // ─── Hospitality ─────────────────────────────────────────────────
  { title: "Booking T&Cs", industry: "Hospitality", status: "soon", release: "Q2 2027", href: NOTIFY("Booking T&Cs"), keywords: ["booking","terms","hotel","restaurant"] },
  { title: "Supplier onboarding · hospitality", industry: "Hospitality", status: "soon", release: "Q2 2027", href: NOTIFY("Supplier onboarding · hospitality"), keywords: ["supplier","EHO","food hygiene"] },
  { title: "Allergen disclosure", industry: "Hospitality", status: "soon", release: "Q2 2027", href: NOTIFY("Allergen disclosure"), keywords: ["allergen","Natasha's Law","food labelling"] },

  // ─── Real estate ─────────────────────────────────────────────────
  { title: "Tenant referencing", industry: "Real estate", status: "soon", release: "Q2 2027", href: NOTIFY("Tenant referencing"), keywords: ["tenant","referencing","rent","right to rent"] },
  { title: "Property disclosure (TA6)", industry: "Real estate", status: "soon", release: "Q2 2027", href: NOTIFY("Property disclosure (TA6)"), keywords: ["TA6","disclosure","law society","conveyancing"] },
  { title: "Inventory · check-in / check-out", industry: "Real estate", status: "soon", release: "Q2 2027", href: NOTIFY("Inventory · check-in / check-out"), keywords: ["inventory","check-in","tenancy"] },

  // ─── Construction ────────────────────────────────────────────────
  { title: "RAMS · risk + method", industry: "Construction", status: "soon", release: "Q3 2027", href: NOTIFY("RAMS"), keywords: ["RAMS","risk assessment","method statement","CDM"] },
  { title: "Contractor onboarding", industry: "Construction", status: "soon", release: "Q3 2027", href: NOTIFY("Contractor onboarding"), keywords: ["contractor","subcontractor","PQQ"] },
  { title: "Near-miss report", industry: "Construction", status: "soon", release: "Q3 2027", href: NOTIFY("Near-miss report"), keywords: ["near miss","RIDDOR","HSE"] },
  { title: "Toolbox talk · sign-off", industry: "Construction", status: "soon", release: "Q3 2027", href: NOTIFY("Toolbox talk · sign-off"), keywords: ["toolbox talk","H&S","training"] },

  // ─── Public sector ───────────────────────────────────────────────
  { title: "Grant application", industry: "Public sector", status: "soon", release: "Q3 2027", href: NOTIFY("Grant application"), keywords: ["grant","funding","council"] },
  { title: "Citizen service request", industry: "Public sector", status: "soon", release: "Q3 2027", href: NOTIFY("Citizen service request"), keywords: ["citizen","council","service request"] },
  { title: "FOI request", industry: "Public sector", status: "soon", release: "Q3 2027", href: NOTIFY("FOI request"), keywords: ["FOI","freedom of information","disclosure"] },

  // ─── Logistics (from kapture · logistics + sector) ───────────────
  { title: "Freight booking", industry: "Logistics", status: "soon", release: "Q4 2026", href: NOTIFY("Freight booking · Kapture Logistics"), keywords: ["freight","booking","load","quote","Kapture Logistics"] },
  { title: "Driver onboarding · HGV", industry: "Logistics", status: "soon", release: "Q4 2027", href: NOTIFY("Driver onboarding · HGV"), keywords: ["driver","DVLA","tachograph","CPC","HGV","class 1"] },
  { title: "Customs declaration · import", industry: "Logistics", status: "soon", release: "Q4 2027", href: NOTIFY("Customs declaration · import"), keywords: ["customs","HMRC","EORI","import","CDS"] },
  { title: "Vehicle defect report (VOR)", industry: "Logistics", status: "soon", release: "Q4 2027", href: NOTIFY("Vehicle defect report (VOR)"), keywords: ["vehicle","defect","DVSA","walk-around","VOR"] },
  { title: "Tachograph download log", industry: "Logistics", status: "soon", release: "Q4 2027", href: NOTIFY("Tachograph download log"), keywords: ["tachograph","DVSA","driver hours","WTD"] },
  { title: "ADR consignment note", industry: "Logistics", status: "soon", release: "Q1 2028", href: NOTIFY("ADR consignment note"), keywords: ["ADR","dangerous goods","hazardous","DGSA"] },
  { title: "PCN dispute · fleet", industry: "Logistics", status: "soon", release: "Q1 2028", href: NOTIFY("PCN dispute · fleet"), keywords: ["PCN","fleet","traffic","penalty"] },
  { title: "Proof of delivery (POD)", industry: "Logistics", status: "soon", release: "Q1 2028", href: NOTIFY("Proof of delivery (POD)"), keywords: ["POD","delivery","signature","freight"] },
];

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
  "Customs",
  "DSAR",
];

/** Industries with a live or soon entry — used by the industries grid. */
export function getIndustries(): Array<{ name: SearchEntry["industry"]; count: number; live: number }> {
  const map = new Map<SearchEntry["industry"], { count: number; live: number }>();
  for (const e of SEARCH_CATALOG) {
    const m = map.get(e.industry) ?? { count: 0, live: 0 };
    m.count += 1;
    if (e.status === "live") m.live += 1;
    map.set(e.industry, m);
  }
  return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
}
