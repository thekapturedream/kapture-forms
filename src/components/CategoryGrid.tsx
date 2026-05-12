import Link from "next/link";
import { getIndustries, type SearchEntry } from "@lib/search-catalog";

/**
 * Category grid for the landing page e-commerce layout.
 * Each tile links into /store?industry=Name and shows pack count.
 */

const INITIALS: Record<SearchEntry["industry"], string> = {
  Healthcare: "HC",
  "HR & people": "HR",
  Finance: "FN",
  Legal: "LG",
  Education: "ED",
  Hospitality: "HS",
  "Real estate": "RE",
  Construction: "CN",
  "Public sector": "PB",
  Logistics: "LO",
};

export function CategoryGrid() {
  const industries = getIndustries();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {industries.map((ind) => (
        <Link
          key={ind.name}
          href={`/store?industry=${encodeURIComponent(ind.name)}`}
          className="group relative rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-4 sm:p-5 hover:border-kapture-black dark:hover:border-white/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-kapture-black dark:bg-white text-kapture-yellow font-mono font-bold text-xs">
              {INITIALS[ind.name]}
            </span>
            {ind.live > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider">
                <span className="w-1 h-1 rounded-full bg-kapture-black" />
                LIVE
              </span>
            )}
          </div>
          <div className="font-semibold text-sm text-kapture-black dark:text-white">{ind.name}</div>
          <div className="text-xs text-kapture-smoke dark:text-white/55 mt-0.5">
            {ind.count} pack{ind.count === 1 ? "" : "s"}
            {ind.live > 0 && ` · ${ind.live} live`}
          </div>
        </Link>
      ))}
    </div>
  );
}
