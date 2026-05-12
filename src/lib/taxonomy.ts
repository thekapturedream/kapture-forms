/**
 * Kapture Forms · hierarchical taxonomy.
 *
 * Industries → subcategories → forms. Source of truth for the landing
 * category grid, the /store experience, and the /store/[industry]
 * detail pages.
 *
 * Forms with `status: "live"` link into /products/[slug] and can be
 * bought today. `status: "soon"` opens a notify-me mailto so the
 * marketplace stays a working surface even before every pack ships.
 */

export interface TaxonomyForm {
  id: string;
  title: string;
  status: "live" | "soon";
  release?: string;
  /** When live, an internal /products/<slug> path. */
  href?: string;
  keywords: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  tagline: string;
  forms: TaxonomyForm[];
}

export interface IndustryNode {
  id: string;
  name: SearchIndustry;
  slug: string;
  tagline: string;
  description: string;
  subcategories: Subcategory[];
}

export type SearchIndustry =
  | "Healthcare"
  | "HR & people"
  | "Finance"
  | "Legal & agreements"
  | "Education"
  | "Hospitality"
  | "Real estate"
  | "Construction"
  | "Public sector"
  | "Logistics";

const soon = (title: string, release: string, keywords: string[] = []): TaxonomyForm => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title,
  status: "soon",
  release,
  keywords,
});

const live = (title: string, href: string, keywords: string[] = []): TaxonomyForm => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title,
  status: "live",
  href,
  keywords,
});

export const TAXONOMY: IndustryNode[] = [
  // ════════════════════════════════════════════════════════════════
  {
    id: "healthcare",
    name: "Healthcare",
    slug: "healthcare",
    tagline: "Regulator-mapped forms for every clinical setting.",
    description: "From a GP surgery to a 200-bed care home. CQC SAF, NMC, HCPC, DSPT, MCA — every field cited.",
    subcategories: [
      {
        id: "care-homes",
        name: "Care homes & older adults",
        tagline: "CQC-aligned packs for residential and nursing settings.",
        forms: [
          live("Staff onboarding · UK care", "/products/staff-onboarding-uk-care", ["DBS","NMC","Care Certificate"]),
          soon("Resident admission", "Q3 2026", ["admission","intake"]),
          soon("Care plan · person-centred", "Q3 2026", ["care plan","outcomes"]),
          soon("Falls risk assessment", "Q3 2026", ["falls","FRAT"]),
          soon("Pressure ulcer risk · Waterlow", "Q4 2026", ["Waterlow","pressure"]),
          soon("Nutrition screening · MUST", "Q4 2026", ["MUST","nutrition"]),
          soon("Behaviour / DSDB log", "Q4 2026", ["behaviour","BPSD"]),
          soon("End of life care plan", "Q1 2027", ["EoL","palliative","ReSPECT"]),
          soon("Continence assessment", "Q1 2027", ["continence"]),
        ],
      },
      {
        id: "general-practice",
        name: "General practice (GP)",
        tagline: "Patient intake, prescriptions, registrations.",
        forms: [
          soon("New patient registration", "Q3 2026", ["GP","NHS number","registration"]),
          soon("Repeat prescription request", "Q3 2026", ["repeat","prescription"]),
          soon("Sick note / Fit note request", "Q3 2026", ["med3","fit note"]),
          soon("Travel vaccine consultation", "Q3 2026", ["travel","vaccine"]),
          soon("Annual health review · chronic", "Q4 2026", ["LTC","review","QOF"]),
          soon("GP transfer · summary care record", "Q4 2026", ["SCR","transfer"]),
          soon("Online consultation triage", "Q4 2026", ["triage","econsult"]),
        ],
      },
      {
        id: "dental",
        name: "Dental",
        tagline: "Registration, consent, NHS exemption, treatment plans.",
        forms: [
          soon("Patient registration · dental", "Q4 2026", ["dental","registration"]),
          soon("Medical history · dental", "Q4 2026", ["medical history","dental"]),
          soon("Sedation consent", "Q4 2026", ["IV sedation","consent"]),
          soon("Implant consent · informed", "Q1 2027", ["implant","consent"]),
          soon("Orthodontic assessment", "Q1 2027", ["ortho","IOTN"]),
          soon("NHS dental exemption", "Q1 2027", ["NHS","exemption"]),
          soon("Treatment plan · FP17", "Q1 2027", ["FP17","UDA"]),
        ],
      },
      {
        id: "opticians",
        name: "Opticians",
        tagline: "Eye tests, dispensing, NHS vouchers.",
        forms: [
          soon("Eye test booking", "Q1 2027", ["eye test","booking"]),
          soon("Patient registration · opticians", "Q1 2027", ["optician","registration"]),
          soon("Contact lens fitting consent", "Q1 2027", ["contact lens"]),
          soon("NHS voucher claim · GOS3", "Q1 2027", ["GOS","voucher"]),
          soon("Children's eye-care plan", "Q1 2027", ["paediatric optometry"]),
        ],
      },
      {
        id: "pharmacy",
        name: "Pharmacy",
        tagline: "MUR / NMS, controlled drugs, vaccinations.",
        forms: [
          soon("Prescription delivery consent", "Q1 2027", ["delivery","pharmacy"]),
          soon("Medicines Use Review (MUR)", "Q1 2027", ["MUR","review"]),
          soon("New Medicine Service (NMS)", "Q1 2027", ["NMS"]),
          soon("Controlled drug register · entry", "Q1 2027", ["CD","controlled drugs"]),
          soon("Vaccination booking · pharmacy", "Q1 2027", ["flu","COVID","pharmacy"]),
          soon("Pharmacy first triage", "Q1 2027", ["pharmacy first","CPCS"]),
        ],
      },
      {
        id: "gynaecology",
        name: "Gynaecology & women's health",
        tagline: "Antenatal, screening, fertility, menopause.",
        forms: [
          soon("Antenatal booking", "Q1 2027", ["antenatal","booking"]),
          soon("Cervical screening · invitation", "Q1 2027", ["smear","screening"]),
          soon("Contraception consultation", "Q1 2027", ["contraception","LARC"]),
          soon("Menopause / HRT consultation", "Q2 2027", ["menopause","HRT"]),
          soon("IVF intake · fertility", "Q2 2027", ["IVF","fertility"]),
          soon("Breast clinic referral", "Q2 2027", ["breast","referral"]),
        ],
      },
      {
        id: "paediatrics",
        name: "Paediatrics",
        tagline: "From 6-week check to school-entry.",
        forms: [
          soon("6-week baby check", "Q2 2027", ["paediatric","6 week"]),
          soon("Childhood vaccination consent", "Q2 2027", ["vaccine","child"]),
          soon("Developmental milestone review", "Q2 2027", ["milestone","health visitor"]),
          soon("ADHD / autism screening (ASQ)", "Q2 2027", ["ADHD","autism","screening"]),
          soon("School-entry health form", "Q2 2027", ["school entry","Reception"]),
          soon("Paediatric consent · procedure", "Q2 2027", ["paediatric","consent"]),
        ],
      },
      {
        id: "mental-health",
        name: "Mental health",
        tagline: "Referrals, risk, therapy intake.",
        forms: [
          soon("IAPT self-referral", "Q1 2027", ["IAPT","talking therapies"]),
          soon("Risk assessment · suicide / self-harm", "Q1 2027", ["risk","suicide"]),
          soon("Crisis plan", "Q2 2027", ["crisis plan"]),
          soon("Therapy intake · counsellor", "Q2 2027", ["therapy","intake","BACP"]),
          soon("PHQ-9 · depression score", "Q2 2027", ["PHQ-9","depression"]),
          soon("GAD-7 · anxiety score", "Q2 2027", ["GAD-7","anxiety"]),
          soon("Mood / sleep diary", "Q2 2027", ["mood","sleep diary"]),
        ],
      },
      {
        id: "physiotherapy",
        name: "Physiotherapy & rehab",
        tagline: "MSK and post-op pathways.",
        forms: [
          soon("Physiotherapy initial assessment", "Q2 2027", ["physio","MSK","assessment"]),
          soon("Pain score · VAS / NRS", "Q2 2027", ["pain","VAS"]),
          soon("Treatment / exercise plan", "Q2 2027", ["exercise","plan"]),
          soon("Outcome measure · Oxford / EQ-5D", "Q2 2027", ["outcome","Oxford","EQ-5D"]),
          soon("Discharge summary · physio", "Q2 2027", ["discharge","physio"]),
        ],
      },
      {
        id: "veterinary",
        name: "Veterinary",
        tagline: "Pet registration, surgery consent, insurance claims.",
        forms: [
          soon("Pet registration · vet", "Q2 2027", ["pet","vet","registration"]),
          soon("Surgery consent · veterinary", "Q2 2027", ["surgery","consent","vet"]),
          soon("Vaccination card · pet", "Q2 2027", ["vaccination","pet"]),
          soon("Pet insurance claim", "Q2 2027", ["pet insurance","claim"]),
          soon("Euthanasia consent", "Q2 2027", ["euthanasia","vet"]),
        ],
      },
      {
        id: "patient-record",
        name: "Patient record & consent",
        tagline: "Cross-cutting consents and notifications.",
        forms: [
          soon("Patient intake · primary care", "Q3 2026", ["intake","primary care"]),
          soon("Incident report · adverse event", "Q3 2026", ["incident","RIDDOR"]),
          soon("Consent & capacity · MCA / DoLS", "Q4 2026", ["MCA","DoLS","capacity"]),
          soon("Safeguarding referral · adults", "Q4 2026", ["safeguarding","section 42"]),
          soon("Family agreement & consent", "Q1 2027", ["family","consent"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "hr",
    name: "HR & people",
    slug: "hr",
    tagline: "Hire to retire, performance to PIP.",
    description: "Manage the full employee lifecycle with regulator-mapped HR packs.",
    subcategories: [
      {
        id: "hiring-onboarding",
        name: "Hiring & onboarding",
        tagline: "Offer to first-day-fit.",
        forms: [
          soon("HR onboarding · UK employer", "Q3 2026", ["onboarding","P45","new starter"]),
          soon("Right-to-work check", "Q3 2026", ["right to work","RtW"]),
          soon("Reference request", "Q3 2026", ["reference"]),
          soon("Offer letter", "Q3 2026", ["offer letter"]),
          soon("Probation review", "Q4 2026", ["probation"]),
          soon("DBS request", "Q4 2026", ["DBS","background"]),
        ],
      },
      {
        id: "performance",
        name: "Performance",
        tagline: "Reviews, objectives, calibration.",
        forms: [
          soon("Performance review", "Q3 2026", ["appraisal","review"]),
          soon("Quarterly OKR check-in", "Q3 2026", ["OKR","check-in"]),
          soon("1:1 meeting notes", "Q3 2026", ["1-on-1","manager"]),
          soon("PIP · performance improvement plan", "Q4 2026", ["PIP"]),
          soon("Promotion case", "Q4 2026", ["promotion","case"]),
        ],
      },
      {
        id: "time-leave",
        name: "Time & leave",
        tagline: "Absence, holidays, statutory leave.",
        forms: [
          soon("Holiday request", "Q3 2026", ["holiday","annual leave"]),
          soon("Return to work · absence", "Q4 2026", ["return to work","sickness"]),
          soon("Parental leave request", "Q4 2026", ["maternity","paternity","SPL"]),
          soon("Flexible working request", "Q1 2027", ["flexible","hybrid"]),
          soon("Compassionate leave request", "Q1 2027", ["bereavement"]),
        ],
      },
      {
        id: "exit-disputes",
        name: "Exit & disputes",
        tagline: "Leaving cleanly, fairly, and fast.",
        forms: [
          soon("Exit interview", "Q3 2026", ["leaver","exit"]),
          soon("Grievance · disciplinary", "Q4 2026", ["grievance","ACAS"]),
          soon("Whistleblowing report", "Q4 2026", ["whistleblowing","PIDA"]),
          soon("Settlement agreement (COT3)", "Q1 2027", ["settlement","COT3"]),
          soon("Garden leave & restrictive covenant", "Q1 2027", ["garden leave","restrictive"]),
        ],
      },
      {
        id: "wellness",
        name: "Wellness & H&S",
        tagline: "Workplace risk, EAP, DSE.",
        forms: [
          soon("DSE workstation assessment", "Q4 2026", ["DSE","display screen"]),
          soon("Workplace risk assessment", "Q4 2026", ["risk","H&S"]),
          soon("EAP self-referral", "Q1 2027", ["EAP","mental health"]),
          soon("Lone worker check-in", "Q1 2027", ["lone worker"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "finance",
    name: "Finance",
    slug: "finance",
    tagline: "AML, KYC, FCA, lending — the regulated finance stack.",
    description: "Banking, insurance, advice and lending packs mapped to FCA, FCA SMCR and HMRC.",
    subcategories: [
      {
        id: "banking",
        name: "Banking & accounts",
        tagline: "Customer onboarding for retail and SME.",
        forms: [
          soon("Customer onboarding · banking", "Q1 2027", ["onboarding","banking"]),
          soon("Account opening · personal", "Q1 2027", ["account","personal"]),
          soon("Account opening · SME", "Q1 2027", ["SME","business banking"]),
          soon("Direct debit mandate", "Q1 2027", ["DDM","mandate"]),
          soon("Bereavement notification · bank", "Q1 2027", ["bereavement"]),
        ],
      },
      {
        id: "aml-kyc",
        name: "AML / KYC",
        tagline: "Anti-money-laundering for any regulated firm.",
        forms: [
          soon("AML / KYC onboarding", "Q4 2026", ["AML","KYC","PEP"]),
          soon("Source of funds declaration", "Q4 2026", ["source of funds","SoF"]),
          soon("Enhanced due diligence (EDD)", "Q4 2026", ["EDD","high risk"]),
          soon("SAR · suspicious activity report", "Q1 2027", ["SAR","NCA"]),
          soon("Sanctions screening result", "Q1 2027", ["sanctions","OFSI"]),
        ],
      },
      {
        id: "lending",
        name: "Lending",
        tagline: "Personal, mortgage, SME credit.",
        forms: [
          soon("Credit application · personal", "Q1 2027", ["credit","loan"]),
          soon("Mortgage application · DIP", "Q1 2027", ["mortgage","DIP"]),
          soon("Bridging loan application", "Q1 2027", ["bridging"]),
          soon("SME finance application", "Q1 2027", ["SME","business loan"]),
          soon("Loan affordability assessment", "Q1 2027", ["affordability"]),
        ],
      },
      {
        id: "insurance",
        name: "Insurance",
        tagline: "Quote, bind, claim.",
        forms: [
          soon("Quote request · motor", "Q1 2027", ["motor","quote"]),
          soon("Quote request · home", "Q1 2027", ["home","quote"]),
          soon("Claim notification · motor", "Q1 2027", ["motor","claim"]),
          soon("Claim notification · property", "Q1 2027", ["property","claim"]),
          soon("Statement of fact", "Q1 2027", ["statement of fact"]),
        ],
      },
      {
        id: "wealth-advice",
        name: "Wealth & advice",
        tagline: "Suitability, fact-find, investment.",
        forms: [
          soon("FCA suitability assessment", "Q4 2026", ["FCA","suitability"]),
          soon("Client fact-find · holistic", "Q1 2027", ["fact-find","financial plan"]),
          soon("Investment risk questionnaire", "Q1 2027", ["risk","ATR"]),
          soon("Pension transfer · DB", "Q1 2027", ["pension","DB"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "legal",
    name: "Legal & agreements",
    slug: "legal",
    tagline: "Affidavits, agreements, contracts. The paper of business and life.",
    description: "From a one-page NDA to a 30-page lease. Lawyer-reviewed templates with English & Welsh law footers.",
    subcategories: [
      {
        id: "personal-agreements",
        name: "Personal agreements",
        tagline: "Affidavits, statutory declarations, wills, POA.",
        forms: [
          soon("Affidavit · general purpose", "Q4 2026", ["affidavit","sworn"]),
          soon("Statutory declaration", "Q4 2026", ["statutory","declaration"]),
          soon("Witness statement", "Q4 2026", ["witness","statement"]),
          soon("Power of attorney · LPA health", "Q1 2027", ["LPA","health","attorney"]),
          soon("Power of attorney · LPA finance", "Q1 2027", ["LPA","finance"]),
          soon("Simple will", "Q1 2027", ["will","testament"]),
          soon("Codicil to a will", "Q1 2027", ["codicil"]),
          soon("Cohabitation agreement", "Q1 2027", ["cohab","cohabitation"]),
          soon("Statement of truth", "Q1 2027", ["statement of truth"]),
        ],
      },
      {
        id: "business-contracts",
        name: "Business contracts",
        tagline: "NDAs, services, partnerships, MoUs.",
        forms: [
          soon("Mutual NDA", "Q4 2026", ["NDA","mutual","confidentiality"]),
          soon("One-way NDA", "Q4 2026", ["NDA","one-way"]),
          soon("Service agreement (B2B)", "Q4 2026", ["service","B2B","contract"]),
          soon("Consultancy agreement", "Q4 2026", ["consultancy","freelance"]),
          soon("Partnership agreement (LLP)", "Q1 2027", ["partnership","LLP"]),
          soon("Shareholder agreement", "Q1 2027", ["shareholder","equity"]),
          soon("Memorandum of understanding (MoU)", "Q1 2027", ["MoU","memorandum"]),
          soon("Distribution / reseller agreement", "Q1 2027", ["distribution","reseller"]),
          soon("Joint venture agreement", "Q2 2027", ["JV","joint venture"]),
        ],
      },
      {
        id: "sales-trade",
        name: "Sales & trade",
        tagline: "Quotes, invoices, bills of sale.",
        forms: [
          soon("Sales agreement · goods", "Q4 2026", ["sales","goods","SoG"]),
          soon("Bill of sale", "Q4 2026", ["bill of sale"]),
          soon("Purchase order", "Q4 2026", ["PO","purchase order"]),
          soon("Quotation / proposal", "Q1 2027", ["quote","proposal"]),
          soon("Invoice with VAT", "Q1 2027", ["invoice","VAT","HMRC"]),
          soon("Credit note", "Q1 2027", ["credit note"]),
          soon("Refund / cancellation agreement", "Q1 2027", ["refund","cancel"]),
        ],
      },
      {
        id: "property-law",
        name: "Property & leases",
        tagline: "Tenancies, lodgers, leases, sales.",
        forms: [
          soon("Assured shorthold tenancy (AST)", "Q2 2027", ["AST","tenancy"]),
          soon("Commercial lease", "Q2 2027", ["commercial lease","FRI"]),
          soon("Lodger agreement", "Q2 2027", ["lodger","rent-a-room"]),
          soon("Sub-letting agreement", "Q2 2027", ["sublet"]),
          soon("Property sale agreement", "Q2 2027", ["sale","property"]),
          soon("Section 21 notice to quit", "Q2 2027", ["section 21","S21"]),
        ],
      },
      {
        id: "employment-law",
        name: "Employment law",
        tagline: "Contracts, settlements, restrictive covenants.",
        forms: [
          soon("Employment contract · permanent", "Q4 2026", ["employment","contract"]),
          soon("Fixed-term employment contract", "Q4 2026", ["fixed-term","FTC"]),
          soon("Contractor / freelance agreement", "Q4 2026", ["contractor","IR35"]),
          soon("Settlement agreement", "Q1 2027", ["settlement","COT3"]),
          soon("Restrictive covenant amendment", "Q1 2027", ["restrictive","non-compete"]),
        ],
      },
      {
        id: "family-law",
        name: "Family law",
        tagline: "Pre-nups, divorce, child arrangements.",
        forms: [
          soon("Pre-nuptial agreement", "Q2 2027", ["pre-nup","prenup"]),
          soon("Cohabitation breakdown", "Q2 2027", ["cohab","breakup"]),
          soon("Divorce financial disclosure (Form E)", "Q2 2027", ["Form E","divorce"]),
          soon("Child arrangements agreement", "Q2 2027", ["child","custody"]),
          soon("Parental responsibility agreement", "Q2 2027", ["parental responsibility"]),
        ],
      },
      {
        id: "data-privacy",
        name: "Data & privacy",
        tagline: "GDPR, DSAR, breach notifications.",
        forms: [
          soon("GDPR · DSAR (subject access)", "Q1 2027", ["DSAR","GDPR","ICO"]),
          soon("GDPR · breach notification", "Q1 2027", ["breach","GDPR"]),
          soon("Privacy impact assessment (DPIA)", "Q1 2027", ["DPIA","privacy"]),
          soon("Right to be forgotten request", "Q1 2027", ["RTBF","erasure"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "education",
    name: "Education",
    slug: "education",
    tagline: "Admissions to SEND, trips to behaviour.",
    description: "DfE-mapped packs for schools, colleges, MATs.",
    subcategories: [
      {
        id: "admissions",
        name: "Admissions",
        tagline: "Reception to sixth form.",
        forms: [
          soon("Admissions · primary", "Q1 2027", ["primary","admission"]),
          soon("Admissions · secondary", "Q1 2027", ["secondary","admission"]),
          soon("Admissions · sixth form", "Q1 2027", ["sixth form","A level"]),
          soon("In-year admission", "Q1 2027", ["in-year"]),
          soon("Appeal · admission", "Q1 2027", ["admission appeal"]),
        ],
      },
      {
        id: "parents-consent",
        name: "Parents & consent",
        tagline: "Trip, photo, media, transport.",
        forms: [
          soon("Parental consent · school", "Q1 2027", ["parent","consent"]),
          soon("Photography & media consent", "Q1 2027", ["photo","media"]),
          soon("Educational visit consent", "Q1 2027", ["trip","visit"]),
          soon("School transport request", "Q1 2027", ["transport","bus"]),
          soon("Medication-in-school form", "Q1 2027", ["medication","school"]),
        ],
      },
      {
        id: "send",
        name: "SEND & inclusion",
        tagline: "Identification, EHCP, support plans.",
        forms: [
          soon("SEND support plan", "Q1 2027", ["SEND","support"]),
          soon("EHCP referral", "Q1 2027", ["EHCP","education health care"]),
          soon("Pupil profile · one-page", "Q2 2027", ["one-page","SEND"]),
          soon("Annual EHCP review", "Q2 2027", ["EHCP review"]),
        ],
      },
      {
        id: "behaviour-welfare",
        name: "Behaviour & welfare",
        tagline: "Incidents, exclusions, safeguarding.",
        forms: [
          soon("Behaviour incident · school", "Q2 2027", ["behaviour","incident"]),
          soon("Suspension / exclusion record", "Q2 2027", ["exclusion","suspension"]),
          soon("Safeguarding concern · CPOMS", "Q2 2027", ["safeguarding","DSL"]),
          soon("Bullying log", "Q2 2027", ["bullying"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "hospitality",
    name: "Hospitality",
    slug: "hospitality",
    tagline: "Bookings, allergens, suppliers.",
    description: "EHO-mapped packs for hotels, restaurants and pubs.",
    subcategories: [
      {
        id: "bookings",
        name: "Bookings & T&Cs",
        tagline: "Walk-in to large-party booking.",
        forms: [
          soon("Restaurant booking T&Cs", "Q2 2027", ["restaurant","booking"]),
          soon("Hotel booking T&Cs", "Q2 2027", ["hotel","booking"]),
          soon("Event booking · catering", "Q2 2027", ["event","catering"]),
          soon("Cancellation request", "Q2 2027", ["cancellation"]),
        ],
      },
      {
        id: "food-safety",
        name: "Food safety & allergens",
        tagline: "Natasha's Law, HACCP, EHO.",
        forms: [
          soon("Allergen disclosure (Natasha's Law)", "Q2 2027", ["allergen","Natasha"]),
          soon("HACCP daily check", "Q2 2027", ["HACCP","food safety"]),
          soon("EHO inspection prep", "Q2 2027", ["EHO","inspection"]),
          soon("Food incident report", "Q2 2027", ["food","incident"]),
        ],
      },
      {
        id: "supplier-ops",
        name: "Supplier & operations",
        tagline: "Procurement and supplier onboarding.",
        forms: [
          soon("Supplier onboarding · hospitality", "Q2 2027", ["supplier"]),
          soon("Stock count · weekly", "Q2 2027", ["stock"]),
          soon("Maintenance request", "Q2 2027", ["maintenance"]),
        ],
      },
      {
        id: "staff-training",
        name: "Staff training",
        tagline: "Inductions, role-play, comp.",
        forms: [
          soon("Front-of-house induction", "Q2 2027", ["FoH","induction"]),
          soon("Kitchen induction", "Q2 2027", ["BoH","kitchen"]),
          soon("Tip distribution sign-off", "Q2 2027", ["tronc","tips"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "real-estate",
    name: "Real estate",
    slug: "real-estate",
    tagline: "Letting, sales, surveys, management.",
    description: "ARLA / RICS-mapped packs for agents, landlords, sellers.",
    subcategories: [
      {
        id: "lettings",
        name: "Lettings",
        tagline: "From offer to deposit.",
        forms: [
          soon("Tenant referencing", "Q2 2027", ["tenant","reference"]),
          soon("Right-to-rent check", "Q2 2027", ["RtR","right to rent"]),
          soon("AST · assured shorthold tenancy", "Q2 2027", ["AST"]),
          soon("Inventory · check-in", "Q2 2027", ["inventory","check-in"]),
          soon("Inventory · check-out", "Q2 2027", ["check-out"]),
          soon("Deposit protection certificate", "Q2 2027", ["deposit","TDS"]),
          soon("Notice to quit · Section 21", "Q2 2027", ["S21","notice"]),
        ],
      },
      {
        id: "sales",
        name: "Sales",
        tagline: "Listing to completion.",
        forms: [
          soon("Property disclosure (TA6)", "Q2 2027", ["TA6","disclosure"]),
          soon("Fixtures & fittings (TA10)", "Q2 2027", ["TA10","fixtures"]),
          soon("Property sale agreement", "Q2 2027", ["sale","property"]),
          soon("Agency listing instruction", "Q2 2027", ["listing","instruction"]),
          soon("Mortgage broker referral", "Q2 2027", ["broker","mortgage"]),
        ],
      },
      {
        id: "property-mgmt",
        name: "Property management",
        tagline: "Block, leasehold, service charge.",
        forms: [
          soon("Block management · resident form", "Q2 2027", ["block","leasehold"]),
          soon("Service charge query", "Q2 2027", ["service charge"]),
          soon("Maintenance request · property", "Q2 2027", ["maintenance"]),
          soon("Section 20 consultation", "Q2 2027", ["section 20","S20"]),
        ],
      },
      {
        id: "surveys",
        name: "Surveys & disclosure",
        tagline: "Level 1–3 surveys + EPC.",
        forms: [
          soon("Home buyer survey (L2)", "Q2 2027", ["survey","RICS"]),
          soon("Building survey (L3)", "Q2 2027", ["L3","building"]),
          soon("EPC questionnaire", "Q2 2027", ["EPC","energy"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "construction",
    name: "Construction",
    slug: "construction",
    tagline: "RAMS, CDM, near-miss, toolbox.",
    description: "HSE / CDM 2015-mapped packs for principal contractors and trades.",
    subcategories: [
      {
        id: "rams-hs",
        name: "RAMS & H&S",
        tagline: "Risk + method statements for every task.",
        forms: [
          soon("RAMS · risk + method", "Q3 2027", ["RAMS"]),
          soon("Permit to work · hot work", "Q3 2027", ["permit","hot work"]),
          soon("Confined space permit", "Q3 2027", ["confined space"]),
          soon("Lifting plan", "Q3 2027", ["lifting","LOLER"]),
          soon("COSHH assessment", "Q3 2027", ["COSHH"]),
        ],
      },
      {
        id: "contractors",
        name: "Contractors & onboarding",
        tagline: "PQQ, induction, paperwork.",
        forms: [
          soon("Contractor onboarding", "Q3 2027", ["contractor","onboarding"]),
          soon("Site induction", "Q3 2027", ["induction"]),
          soon("PQQ · pre-qualification questionnaire", "Q3 2027", ["PQQ"]),
          soon("Sub-contractor agreement", "Q3 2027", ["subcontractor"]),
        ],
      },
      {
        id: "cdm-site",
        name: "CDM & site",
        tagline: "Pre-construction info, F10, plans.",
        forms: [
          soon("F10 notification", "Q3 2027", ["F10","CDM"]),
          soon("Pre-construction information", "Q3 2027", ["PCI","CDM"]),
          soon("Construction phase plan", "Q3 2027", ["CPP","CDM"]),
          soon("Health & safety file", "Q3 2027", ["H&S file"]),
        ],
      },
      {
        id: "inspections-defects",
        name: "Inspections & defects",
        tagline: "Toolbox to handover.",
        forms: [
          soon("Toolbox talk · sign-off", "Q3 2027", ["toolbox"]),
          soon("Near-miss report", "Q3 2027", ["near miss","RIDDOR"]),
          soon("Snagging list", "Q3 2027", ["snagging"]),
          soon("Practical completion certificate", "Q3 2027", ["PC","completion"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "public",
    name: "Public sector",
    slug: "public",
    tagline: "Citizens, grants, licensing, FOI.",
    description: "Council, NHS, education-adjacent forms.",
    subcategories: [
      {
        id: "citizen",
        name: "Citizen services",
        tagline: "Council day-to-day requests.",
        forms: [
          soon("Council tax · single person discount", "Q3 2027", ["council tax"]),
          soon("Missed bin · service request", "Q3 2027", ["bin","waste"]),
          soon("Pothole report", "Q3 2027", ["pothole","highway"]),
          soon("Blue badge application", "Q3 2027", ["blue badge"]),
          soon("Housing application", "Q3 2027", ["housing","social"]),
        ],
      },
      {
        id: "grants",
        name: "Grants & funding",
        tagline: "Apply, evaluate, report.",
        forms: [
          soon("Grant application · small charity", "Q3 2027", ["grant","charity"]),
          soon("Grant report · outcomes", "Q3 2027", ["grant report"]),
          soon("Hardship fund application", "Q3 2027", ["hardship"]),
        ],
      },
      {
        id: "foi-disclosure",
        name: "FOI & disclosure",
        tagline: "FOI, EIR, redaction.",
        forms: [
          soon("FOI request", "Q3 2027", ["FOI"]),
          soon("EIR request", "Q3 2027", ["EIR"]),
          soon("Internal review · FOI", "Q3 2027", ["FOI review"]),
        ],
      },
      {
        id: "licensing",
        name: "Licensing",
        tagline: "Alcohol, taxi, premises.",
        forms: [
          soon("Personal licence application · alcohol", "Q3 2027", ["alcohol licence"]),
          soon("Premises licence application", "Q3 2027", ["premises licence"]),
          soon("Taxi driver licence", "Q3 2027", ["taxi","PHV"]),
          soon("Pavement / street trading", "Q3 2027", ["street trading"]),
        ],
      },
    ],
  },
  // ════════════════════════════════════════════════════════════════
  {
    id: "logistics",
    name: "Logistics",
    slug: "logistics",
    tagline: "Drivers, vehicles, customs, dangerous goods.",
    description: "DVSA / DVLA / HMRC-mapped packs for fleets and freight.",
    subcategories: [
      {
        id: "drivers",
        name: "Drivers",
        tagline: "From licence check to CPC.",
        forms: [
          soon("Driver onboarding · HGV", "Q4 2027", ["driver","HGV","CPC"]),
          soon("DVLA licence check (mandate)", "Q4 2027", ["DVLA","licence"]),
          soon("CPC training log", "Q4 2027", ["CPC"]),
          soon("Driver eyesight declaration", "Q4 2027", ["eyesight"]),
          soon("Drug & alcohol policy sign-off", "Q4 2027", ["D&A","policy"]),
        ],
      },
      {
        id: "vehicles",
        name: "Vehicles",
        tagline: "Walk-around, defects, MOT.",
        forms: [
          soon("Vehicle defect report (VOR)", "Q4 2027", ["VOR","defect"]),
          soon("Walk-around check · daily", "Q4 2027", ["walk-around"]),
          soon("Vehicle inspection · 6-week", "Q4 2027", ["inspection"]),
          soon("Tachograph download log", "Q4 2027", ["tachograph"]),
          soon("Accident report · fleet", "Q4 2027", ["accident","FNOL"]),
        ],
      },
      {
        id: "customs",
        name: "Customs & freight",
        tagline: "Import / export, EORI, manifest.",
        forms: [
          soon("Customs declaration · import", "Q4 2027", ["customs","CDS"]),
          soon("Customs declaration · export", "Q4 2027", ["export","CDS"]),
          soon("EORI registration", "Q4 2027", ["EORI"]),
          soon("Freight booking", "Q4 2026", ["freight","booking"]),
          soon("CMR consignment note", "Q4 2027", ["CMR","consignment"]),
          soon("Proof of delivery (POD)", "Q1 2028", ["POD","delivery"]),
        ],
      },
      {
        id: "dangerous-goods",
        name: "Dangerous goods (ADR)",
        tagline: "ADR-compliant carriage.",
        forms: [
          soon("ADR consignment note", "Q1 2028", ["ADR","hazmat"]),
          soon("DGSA report", "Q1 2028", ["DGSA"]),
          soon("Spill incident report", "Q1 2028", ["spill","ADR"]),
        ],
      },
      {
        id: "fleet-ops",
        name: "Fleet operations",
        tagline: "PCN, expenses, fuel.",
        forms: [
          soon("PCN dispute · fleet", "Q1 2028", ["PCN"]),
          soon("Fuel card reconciliation", "Q1 2028", ["fuel","reconcile"]),
          soon("Vehicle handover · driver", "Q1 2028", ["handover"]),
        ],
      },
    ],
  },
];

/** All industries — for the landing grid. */
export function getIndustryNodes(): IndustryNode[] {
  return TAXONOMY;
}

/** Lookup by URL slug. */
export function getIndustryBySlug(slug: string): IndustryNode | undefined {
  return TAXONOMY.find((i) => i.slug === slug);
}

/** Flatten the taxonomy into searchable rows. */
export function flatForms(): Array<TaxonomyForm & { industry: SearchIndustry; subcategory: string }> {
  const out: Array<TaxonomyForm & { industry: SearchIndustry; subcategory: string }> = [];
  for (const i of TAXONOMY) {
    for (const s of i.subcategories) {
      for (const f of s.forms) {
        out.push({ ...f, industry: i.name, subcategory: s.name });
      }
    }
  }
  return out;
}

/** Total pack count across the taxonomy. */
export function totalForms(): number {
  return flatForms().length;
}
