import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TAXONOMY } from "@lib/taxonomy";
import { IndustryIcon } from "./IndustryIcon";

/**
 * Category cards inspired by Vercel / Tony Robbins layouts.
 * Icon top-left, count + LIVE chip top-right, name + tagline body,
 * sub-category list as foot. Hover lifts and shows arrow.
 */

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {TAXONOMY.map((ind) => {
        const total = ind.subcategories.reduce((n, s) => n + s.forms.length, 0);
        const live = ind.subcategories.reduce(
          (n, s) => n + s.forms.filter((f) => f.status === "live").length,
          0
        );
        return (
          <Link
            key={ind.id}
            href={`/store/${ind.slug}`}
            className="group relative rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 sm:p-6 hover:border-kapture-black dark:hover:border-white/40 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_28px_rgba(255,255,255,0.04)] transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-kapture-black dark:bg-kapture-yellow text-kapture-yellow dark:text-kapture-black transition group-hover:scale-105">
                <IndustryIcon name={ind.name} size={22} />
              </span>
              <div className="flex flex-col items-end gap-1">
                {live > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-kapture-black" />
                    LIVE
                  </span>
                )}
                <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
                  {total} packs
                </span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
                {ind.name}
              </h3>
              <p className="mt-1.5 text-sm text-kapture-smoke dark:text-white/65 leading-relaxed">
                {ind.tagline}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-kapture-fog dark:border-white/10 flex items-center justify-between">
              <div className="text-xs text-kapture-smoke dark:text-white/55 truncate pr-3">
                {ind.subcategories.slice(0, 3).map((s) => s.name).join(" · ")}
                {ind.subcategories.length > 3 && ` · +${ind.subcategories.length - 3}`}
              </div>
              <span className="shrink-0 inline-flex items-center text-kapture-black dark:text-white group-hover:translate-x-0.5 transition">
                <ArrowUpRight size={16} strokeWidth={2.25} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
