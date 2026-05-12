/**
 * Unified store product accessor.
 *
 * Looks up a product by slug across:
 *   1. The rich product catalogue (src/lib/products.ts) — live packs
 *   2. The hierarchical taxonomy (src/lib/taxonomy.ts) — soon packs
 *   3. The bundle catalogue (src/lib/bundles.ts) — multi-pack offers
 *   4. The Designer Pass — special subscription product
 *
 * Returns a normalised StoreProduct that every product page renders.
 */

import { getProduct as getCatalogueProduct, type Product } from "./products";
import {
  TAXONOMY,
  flatForms,
  getIndustryBySlug,
  type IndustryNode,
  type Subcategory,
  type TaxonomyForm,
} from "./taxonomy";
import { BUNDLES, type Bundle } from "./bundles";

/** £14.50 reserve fee for pre-orders — 50% of the £29 launch price. */
export const PREORDER_PENCE = 1450;
export const LAUNCH_PENCE = 2900;
export const HOSTED_PENCE = 2900;
export const DESIGNER_PASS_PENCE = 4900;

export type ProductMode = "oneoff" | "subscription" | "preorder" | "bundle" | "pass";

export interface StoreProduct {
  /** Internal id used by /api/buy and Stripe metadata. */
  id: string;
  /** URL-safe slug. */
  slug: string;
  /** Card title. */
  title: string;
  /** Marketing one-liner. */
  hook: string;
  /** Long-form copy. */
  description: string;
  /** Industry name (top-level taxonomy). */
  industry: string;
  /** Subcategory name (mid-level taxonomy). */
  subcategory?: string;
  /** Live = ship today. Soon = pre-order. Bundle = multi-pack. Pass = subscription. */
  status: "live" | "soon" | "bundle" | "pass";
  /** Launch window for soon products. */
  release?: string;
  /** "What you get" — short bulleted list. */
  whatsIncluded: string[];
  /** Headline feature bullets. */
  features: Array<{ title: string; body: string }>;
  /** Inline spec rows. */
  specs: Array<{ label: string; value: string }>;
  /** Format tags shown in the price card. */
  formats: Array<"pdf" | "docx" | "html" | "csv" | "gforms" | "web">;
  /** Pricing options the buyer can pick. */
  options: Array<{
    id: string;
    mode: ProductMode;
    label: string;
    pricePence: number;
    /** RRP for strikethrough display. */
    rrpPence?: number;
    /** Short subtitle ("lifetime · all formats") */
    subtitle: string;
    /** Optional caption beneath the price. */
    note?: string;
    /** True for the default selected option. */
    primary?: boolean;
  }>;
  /** Related slugs to show beneath the page. */
  relatedSlugs: string[];
  /** True for the Designer Pass. Hides one-off pricing UI. */
  isPass?: boolean;
}

const NOTIFY_EMAIL = "forms@thekapture.com";
export function notifyMailto(label: string): string {
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(`Notify me · ${label}`)}`;
}

/* ─────────── public lookup ─────────── */

export function getStoreProduct(slug: string): StoreProduct | undefined {
  if (slug === "designer-pass") return designerPass();
  const bundle = BUNDLES.find((b) => b.slug === slug);
  if (bundle) return fromBundle(bundle);
  const catalogue = getCatalogueProduct(slug);
  if (catalogue) return fromCatalogue(catalogue, slug);
  const tax = findInTaxonomy(slug);
  if (tax) return fromTaxonomy(tax.form, tax.industry, tax.sub);
  return undefined;
}

export function getAllProductSlugs(): string[] {
  const taxonomySlugs = flatForms().map((f) => slugify(f.title));
  const bundleSlugs = BUNDLES.map((b) => b.slug);
  return Array.from(new Set([...taxonomySlugs, ...bundleSlugs, "designer-pass"]));
}

/** Returns relevant products from the same subcategory or industry. */
export function relatedProducts(slug: string, limit = 4): StoreProduct[] {
  const tax = findInTaxonomy(slug);
  if (!tax) return [];
  const inSub = tax.sub.forms
    .filter((f) => slugify(f.title) !== slug)
    .slice(0, limit)
    .map((f) => fromTaxonomy(f, tax.industry, tax.sub));
  if (inSub.length >= limit) return inSub;
  // Pad from sibling subcategories in the same industry.
  const others: StoreProduct[] = [];
  for (const sub of tax.industry.subcategories) {
    if (sub.id === tax.sub.id) continue;
    for (const f of sub.forms) {
      if (slugify(f.title) === slug) continue;
      others.push(fromTaxonomy(f, tax.industry, sub));
      if (inSub.length + others.length >= limit) break;
    }
    if (inSub.length + others.length >= limit) break;
  }
  return [...inSub, ...others];
}

/* ─────────── builders ─────────── */

function fromCatalogue(p: Product, slug: string): StoreProduct {
  // Live "Staff onboarding · UK care" — rich data from products.ts.
  return {
    id: p.id,
    slug,
    title: p.title,
    hook: p.description,
    description: p.longDescription || p.description,
    industry: "Healthcare",
    subcategory: "Care homes & older adults",
    status: "live",
    whatsIncluded: [
      "All 4 pathway flows · clinical · non-clinical · agency · volunteer",
      "9 sections · 60+ regulator-mapped fields",
      "5 exports — PDF · DOCX · HTML · CSV · Google Forms",
      "Hosted runner option (£29/mo) with magic-link invites",
      "SHA-256 audit hash on every submission",
      "Lifetime updates as CQC, NMC, HCPC change",
    ],
    features: [
      {
        title: "Regulator-mapped fields",
        body: "Every field cites the CQC SAF, NMC, HCPC, DSPT or MCA clause it satisfies.",
      },
      {
        title: "Four pathway flows",
        body: "Permanent clinical · non-clinical · agency / bank · volunteer · student — fields hide per pathway.",
      },
      {
        title: "Inspector-grade audit hash",
        body: "Tamper-evident SHA-256 on every submission. The same hash is printed on the PDF footer and exported to CSV.",
      },
      {
        title: "Five export formats",
        body: "Buyer picks PDF, DOCX, embeddable HTML, HRIS-ready CSV, or Google Forms spec. Same data, same audit hash.",
      },
    ],
    specs: [
      { label: "Pathways", value: "4" },
      { label: "Sections", value: "9" },
      { label: "Regulator-mapped fields", value: "60+" },
      { label: "Export formats", value: "5 + hosted" },
      { label: "Audit", value: "SHA-256" },
      { label: "Updates", value: "Lifetime" },
    ],
    formats: ["pdf", "docx", "html", "csv", "gforms", "web"],
    options: [
      {
        id: "oneoff",
        mode: "oneoff",
        label: "One-off · all formats",
        pricePence: LAUNCH_PENCE,
        subtitle: "Lifetime use · single workspace",
        note: "Includes future updates as regulators change.",
        primary: true,
      },
      {
        id: "hosted",
        mode: "subscription",
        label: "Hosted runner · monthly",
        pricePence: HOSTED_PENCE,
        subtitle: "Branded URL · magic links · queue",
        note: "Cancel anytime.",
      },
    ],
    relatedSlugs: [],
  };
}

function fromTaxonomy(form: TaxonomyForm, industry: IndustryNode, sub: Subcategory): StoreProduct {
  const isLive = form.status === "live";
  const slug = slugify(form.title);
  return {
    id: form.id,
    slug,
    title: form.title,
    hook: defaultHook(form, sub, industry),
    description: defaultDescription(form, sub, industry),
    industry: industry.name,
    subcategory: sub.name,
    status: isLive ? "live" : "soon",
    release: form.release,
    whatsIncluded: [
      "5 export formats — PDF · DOCX · HTML · CSV · Google Forms",
      "Hosted runner option with branded URL",
      "Regulator-mapped fields and citations",
      "SHA-256 audit hash on every submission",
      "Lifetime updates",
    ],
    features: [
      {
        title: "Built by sector specialists",
        body: `Authored by ${industry.name.toLowerCase()} compliance specialists, reviewed before release.`,
      },
      {
        title: "Inspector-ready",
        body: "Every field is tagged with the clause it satisfies. Print, hand to an auditor, defend.",
      },
      {
        title: "Five formats included",
        body: "One purchase. Five outputs. Same audit hash on each.",
      },
    ],
    specs: [
      { label: "Industry", value: industry.name },
      { label: "Subcategory", value: sub.name },
      { label: "Formats", value: "PDF · DOCX · HTML · CSV · GForms" },
      { label: "Audit", value: "SHA-256" },
      { label: "Status", value: isLive ? "Live now" : `Pre-order · ${form.release ?? "TBC"}` },
    ],
    formats: ["pdf", "docx", "html", "csv", "gforms", "web"],
    options: isLive
      ? [
          {
            id: "oneoff",
            mode: "oneoff",
            label: "One-off · all formats",
            pricePence: LAUNCH_PENCE,
            subtitle: "Lifetime use · single workspace",
            primary: true,
          },
          {
            id: "hosted",
            mode: "subscription",
            label: "Hosted runner · monthly",
            pricePence: HOSTED_PENCE,
            subtitle: "Branded URL · magic links · queue",
          },
        ]
      : [
          {
            id: "preorder",
            mode: "preorder",
            label: "Pre-order · 50% off",
            pricePence: PREORDER_PENCE,
            rrpPence: LAUNCH_PENCE,
            subtitle: `Launches ${form.release ?? "soon"}`,
            note: "Pay the reserve fee now — full pack delivered free at launch.",
            primary: true,
          },
        ],
    relatedSlugs: [],
  };
}

function fromBundle(b: Bundle): StoreProduct {
  return {
    id: `bundle-${b.id}`,
    slug: b.slug,
    title: b.title,
    hook: b.hook,
    description: `${b.hook} Bundle includes ${b.packs.length} packs at a single price. Live packs ship today; pre-ordered packs land in your inbox at launch.`,
    industry: b.industry,
    status: "bundle",
    whatsIncluded: b.packs.map((p) => `${p} — included`),
    features: [
      {
        title: `${b.packs.length} packs in one bundle`,
        body: "Buy once. Use across every pathway your team runs.",
      },
      {
        title: "Save vs individual purchase",
        body: `RRP ${money(b.rrpPence)} → bundle ${money(b.bundlePence)} (save ${money(b.rrpPence - b.bundlePence)}).`,
      },
      {
        title: "Same audit hash across the bundle",
        body: "Inspector picks one license slug. Every pack in the bundle attaches to it.",
      },
    ],
    specs: [
      { label: "Packs", value: String(b.packs.length) },
      { label: "Bundle price", value: money(b.bundlePence) },
      { label: "RRP", value: money(b.rrpPence) },
      { label: "You save", value: money(b.rrpPence - b.bundlePence) },
    ],
    formats: ["pdf", "docx", "html", "csv", "gforms", "web"],
    options: [
      {
        id: "bundle",
        mode: "bundle",
        label: "Bundle · all packs",
        pricePence: b.bundlePence,
        rrpPence: b.rrpPence,
        subtitle: `${b.packs.length} packs · one license slug`,
        primary: true,
      },
    ],
    relatedSlugs: [],
  };
}

function designerPass(): StoreProduct {
  return {
    id: "designer-pass",
    slug: "designer-pass",
    title: "Designer Pass",
    hook: "Unlimited downloads. Source files. White-label rights.",
    description:
      "For agencies, freelancers, and design studios. Pull every Kapture Forms pack in any format, get the Figma kit and brand tokens, and white-label on a client domain.",
    industry: "Cross-sector",
    status: "pass",
    isPass: true,
    whatsIncluded: [
      "Unlimited PDF · DOCX · HTML · CSV · Google Forms downloads",
      "Figma kit · brand tokens · form schema JSON",
      "White-label on one client domain (resell rights)",
      "Hosted runner with your brand chrome",
      "New packs auto-added · cancel anytime",
    ],
    features: [
      {
        title: "Every pack. Every format.",
        body: "All 150+ live and pre-released packs. New ones arrive in your account as we ship them.",
      },
      {
        title: "Source files included",
        body: "Figma kit, brand colour tokens, JSON form schemas. Ship faster on every brief.",
      },
      {
        title: "White-label rights",
        body: "Re-export to one client domain with your branding. Resell the hosted runner under your studio name.",
      },
    ],
    specs: [
      { label: "Plan", value: "Monthly subscription" },
      { label: "Pack access", value: "Unlimited" },
      { label: "Source files", value: "Figma · JSON · tokens" },
      { label: "White-label", value: "1 client domain" },
      { label: "Cancel", value: "Anytime" },
    ],
    formats: ["pdf", "docx", "html", "csv", "gforms", "web"],
    options: [
      {
        id: "monthly",
        mode: "pass",
        label: "Designer Pass · monthly",
        pricePence: DESIGNER_PASS_PENCE,
        subtitle: "First 30 days, then £49 / mo",
        note: "Cancel anytime.",
        primary: true,
      },
    ],
    relatedSlugs: [],
  };
}

/* ─────────── helpers ─────────── */

function findInTaxonomy(
  slug: string
): { industry: IndustryNode; sub: Subcategory; form: TaxonomyForm } | undefined {
  for (const industry of TAXONOMY) {
    for (const sub of industry.subcategories) {
      for (const form of sub.forms) {
        if (slugify(form.title) === slug) return { industry, sub, form };
      }
    }
  }
  return undefined;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function money(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

function defaultHook(form: TaxonomyForm, sub: Subcategory, industry: IndustryNode): string {
  if (form.status === "live") return `Ship-ready ${sub.name.toLowerCase()} pack.`;
  return `Pre-order · ${industry.name.toLowerCase()} · ${sub.name.toLowerCase()}.`;
}

function defaultDescription(form: TaxonomyForm, sub: Subcategory, industry: IndustryNode): string {
  if (form.status === "live") {
    return `${form.title} — pre-built form pack covering ${sub.tagline.toLowerCase()} Mapped to the regulator. Ships in PDF, DOCX, HTML, CSV and Google Forms with an optional hosted runner.`;
  }
  return `${form.title} is launching ${form.release ?? "soon"} as part of our ${industry.name} catalogue. Pre-order at 50% off the launch price and we'll deliver the full pack the moment it ships.`;
}

/** For the search index — preserves backwards compat with /store. */
export function slugFor(title: string): string {
  return slugify(title);
}

/** Re-exported from bundles for the bundle index render. */
export { BUNDLES, type Bundle } from "./bundles";
