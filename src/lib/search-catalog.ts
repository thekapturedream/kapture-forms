/**
 * Flat search index — derived from src/lib/taxonomy.ts so adding a new
 * form in the taxonomy automatically surfaces it in /store search.
 */

import { flatForms, type SearchIndustry } from "./taxonomy";

export interface SearchEntry {
  title: string;
  industry: SearchIndustry;
  subcategory: string;
  status: "live" | "soon";
  release?: string;
  href: string;
  keywords: string[];
}

const NOTIFY = (label: string) =>
  `mailto:forms@thekapture.com?subject=${encodeURIComponent(`Notify me · ${label}`)}&body=${encodeURIComponent(
    `Please email me when "${label}" goes live on Kapture Forms.`
  )}`;

export const SEARCH_CATALOG: SearchEntry[] = flatForms().map((f) => ({
  title: f.title,
  industry: f.industry,
  subcategory: f.subcategory,
  status: f.status,
  release: f.release,
  href: f.status === "live" && f.href ? f.href : NOTIFY(f.title),
  keywords: [...f.keywords, f.subcategory.toLowerCase()],
}));

export function searchCatalog(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_CATALOG;
  return SEARCH_CATALOG
    .map((e) => {
      const title = e.title.toLowerCase();
      const ind = e.industry.toLowerCase();
      const sub = e.subcategory.toLowerCase();
      const kws = e.keywords.join(" ").toLowerCase();
      let score = 0;
      if (title.includes(q)) score += 5;
      if (sub.includes(q)) score += 3;
      if (ind.includes(q)) score += 2;
      if (kws.includes(q)) score += 1;
      if (e.status === "live") score += 0.5;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e);
}

/** For the landing page typing placeholder. Short, varied. */
export const PLACEHOLDER_PHRASES: string[] = [
  "Affidavit",
  "Tenant referencing",
  "Staff onboarding",
  "AML / KYC",
  "Lease agreement",
  "NDA",
  "Sales agreement",
  "RAMS",
  "Will & testament",
  "Patient intake",
  "Customs declaration",
  "GDPR DSAR",
];

export function getIndustries(): Array<{ name: SearchIndustry; count: number; live: number }> {
  const map = new Map<SearchIndustry, { count: number; live: number }>();
  for (const e of SEARCH_CATALOG) {
    const m = map.get(e.industry) ?? { count: 0, live: 0 };
    m.count += 1;
    if (e.status === "live") m.live += 1;
    map.set(e.industry, m);
  }
  return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
}
