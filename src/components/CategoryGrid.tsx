import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listIndustriesByPriority, type IndustryNode } from "@lib/taxonomy";
import { IndustryIcon } from "./IndustryIcon";

/**
 * Category grid — landing page hierarchy.
 *
 * Order comes from listIndustriesByPriority() so the most useful
 * categories lead. A `featured: true` industry renders in reverse colour
 * (dark in light mode, light in dark mode) so it pops as the highlighted
 * pick. Everything else uses the neutral card style.
 */
export function CategoryGrid() {
  const industries = listIndustriesByPriority();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {industries.map((ind) => (
        <CategoryCard key={ind.id} ind={ind} />
      ))}
    </div>
  );
}

function CategoryCard({ ind }: { ind: IndustryNode }) {
  const total = ind.subcategories.reduce((n, s) => n + s.forms.length, 0);
  const live = ind.subcategories.reduce(
    (n, s) => n + s.forms.filter((f) => f.status === "live").length,
    0,
  );
  const featured = ind.featured === true;

  const containerClass = featured
    ? "group relative rounded-2xl border bg-kapture-black dark:bg-white text-white dark:text-kapture-black border-kapture-black dark:border-white p-5 sm:p-6 transition-all flex flex-col hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.2)]"
    : "group relative rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 sm:p-6 hover:border-kapture-black dark:hover:border-white/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_28px_rgba(255,255,255,0.04)] transition-all flex flex-col";

  const iconClass = featured
    ? "inline-flex items-center justify-center w-11 h-11 rounded-xl bg-kapture-yellow text-kapture-black transition group-hover:scale-105"
    : "inline-flex items-center justify-center w-11 h-11 rounded-xl bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black transition group-hover:scale-105";

  const totalClass = featured
    ? "font-mono text-[0.625rem] uppercase tracking-widest font-bold text-white/65 dark:text-kapture-black/65"
    : "font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55";

  const taglineClass = featured
    ? "mt-1.5 text-sm font-medium leading-relaxed text-white/80 dark:text-kapture-black/80"
    : "mt-1.5 text-sm text-kapture-smoke dark:text-white/65 leading-relaxed";

  const dividerClass = featured
    ? "mt-4 pt-4 border-t border-white/20 dark:border-kapture-black/20 flex items-center justify-between"
    : "mt-4 pt-4 border-t border-kapture-fog dark:border-white/10 flex items-center justify-between";

  const subListClass = featured
    ? "text-xs font-medium text-white/65 dark:text-kapture-black/65 truncate pr-3"
    : "text-xs text-kapture-smoke dark:text-white/55 truncate pr-3";

  return (
    <Link key={ind.id} href={`/store/${ind.slug}`} className={containerClass}>
      <div className="flex items-start justify-between mb-4">
        <span className={iconClass}>
          <IndustryIcon name={ind.name} size={22} />
        </span>
        <div className="flex flex-col items-end gap-1">
          {featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider">
              FEATURED
            </span>
          )}
          {!featured && live > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider">
              <span className="w-1 h-1 rounded-full bg-kapture-black" />
              LIVE
            </span>
          )}
          <span className={totalClass}>{total} packs</span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-base sm:text-lg tracking-[-0.01em]">
          {ind.name}
        </h3>
        <p className={taglineClass}>{ind.tagline}</p>
      </div>

      <div className={dividerClass}>
        <div className={subListClass}>
          {ind.subcategories.slice(0, 3).map((s) => s.name).join(" · ")}
          {ind.subcategories.length > 3 && ` · +${ind.subcategories.length - 3}`}
        </div>
        <span className="shrink-0 inline-flex items-center group-hover:translate-x-0.5 transition">
          <ArrowUpRight size={16} strokeWidth={2.25} />
        </span>
      </div>
    </Link>
  );
}
