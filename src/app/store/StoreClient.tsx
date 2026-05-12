"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchEntry } from "@lib/search-catalog";

const INDUSTRIES = [
  "Healthcare",
  "HR & people",
  "Finance",
  "Legal",
  "Education",
  "Hospitality",
  "Real estate",
  "Construction",
  "Public sector",
  "Logistics",
] as const;

type Status = "all" | "live" | "soon";
type Sort = "industry" | "alpha" | "live-first";

interface StoreClientProps {
  initialIndustry: string | null;
  allEntries: SearchEntry[];
}

/**
 * The /store experience.
 * Left sidebar (industry switcher · status filter · sort).
 * Right pane: searchable pack grid.
 * Mobile: filters tucked into a sheet that slides up from the bottom.
 */
export function StoreClient({ initialIndustry, allEntries }: StoreClientProps) {
  const [industry, setIndustry] = useState<string | null>(initialIndustry);
  const [status, setStatus] = useState<Status>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("live-first");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of allEntries) map.set(e.industry, (map.get(e.industry) ?? 0) + 1);
    return map;
  }, [allEntries]);

  const filtered = useMemo(() => {
    let list = allEntries;
    if (industry) list = list.filter((e) => e.industry === industry);
    if (status !== "all") list = list.filter((e) => e.status === status);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.keywords.some((k) => k.toLowerCase().includes(needle)) ||
          e.industry.toLowerCase().includes(needle)
      );
    }
    if (sort === "alpha") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "industry")
      list = [...list].sort((a, b) => a.industry.localeCompare(b.industry) || a.title.localeCompare(b.title));
    else
      list = [...list].sort((a, b) => {
        if (a.status === b.status) return a.title.localeCompare(b.title);
        return a.status === "live" ? -1 : 1;
      });
    return list;
  }, [allEntries, industry, status, q, sort]);

  const liveCount = allEntries.filter((e) => e.status === "live").length;

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
        {/* SIDEBAR — desktop */}
        <aside className="hidden lg:block">
          <SidebarFilters
            industry={industry}
            setIndustry={setIndustry}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            counts={counts}
            allCount={allEntries.length}
            liveCount={liveCount}
          />
        </aside>

        {/* MAIN PANE */}
        <section>
          {/* TOP TOOLBAR */}
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6 flex-wrap">
            <div>
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-1">
                STORE · {filtered.length} OF {allEntries.length}
              </div>
              <h1 className="font-semibold text-2xl sm:text-3xl tracking-[-0.025em] text-kapture-black dark:text-white">
                {industry ?? "All packs"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className="lg:hidden inline-flex items-center gap-2 bg-white dark:bg-white/[0.04] border border-kapture-fog dark:border-white/10 hover:border-kapture-black dark:hover:border-white/30 px-3 py-2 rounded-xl text-sm font-medium text-kapture-black dark:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mb-4">
            <div className="relative flex items-center bg-white dark:bg-white/[0.04] border border-kapture-fog dark:border-white/10 rounded-xl focus-within:border-kapture-black dark:focus-within:border-white/40">
              <span className="pl-3.5 text-kapture-mist pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by name or keyword…"
                className="flex-1 min-w-0 bg-transparent text-kapture-black dark:text-white placeholder:text-kapture-mist text-sm py-2.5 pl-2.5 pr-3 focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="text-kapture-mist hover:text-kapture-black dark:hover:text-white p-2"
                  aria-label="Clear filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER CHIPS */}
          {(industry || status !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {industry && (
                <Chip onClear={() => setIndustry(null)}>{industry}</Chip>
              )}
              {status !== "all" && (
                <Chip onClear={() => setStatus("all")}>{status.toUpperCase()}</Chip>
              )}
              <button
                type="button"
                onClick={() => {
                  setIndustry(null);
                  setStatus("all");
                  setQ("");
                }}
                className="text-xs font-medium text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white"
              >
                Clear all
              </button>
            </div>
          )}

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-kapture-fog dark:border-white/10 p-10 text-center">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40 mb-2">
                NO MATCHES
              </div>
              <p className="text-sm text-kapture-smoke dark:text-white/60 mb-3">
                Nothing matched your filters. Try clearing them or request a pack.
              </p>
              <a
                href={`mailto:forms@thekapture.com?subject=${encodeURIComponent(`Pack request · ${q || "new pack"}`)}`}
                className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Request a pack →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((e) => (
                <PackTile key={e.title} entry={e} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTER SHEET */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-kapture-coal text-kapture-black dark:text-white p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40">
                FILTERS
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="text-sm font-medium hover:opacity-70"
              >
                Done
              </button>
            </div>
            <SidebarFilters
              industry={industry}
              setIndustry={(v) => {
                setIndustry(v);
                setFiltersOpen(false);
              }}
              status={status}
              setStatus={setStatus}
              sort={sort}
              setSort={setSort}
              counts={counts}
              allCount={allEntries.length}
              liveCount={liveCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── sidebar ─── */

function SidebarFilters({
  industry,
  setIndustry,
  status,
  setStatus,
  sort,
  setSort,
  counts,
  allCount,
  liveCount,
}: {
  industry: string | null;
  setIndustry: (v: string | null) => void;
  status: Status;
  setStatus: (s: Status) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  counts: Map<string, number>;
  allCount: number;
  liveCount: number;
}) {
  return (
    <div className="space-y-7">
      <FilterGroup label="Industry">
        <SidebarRow
          label="All"
          count={allCount}
          active={industry === null}
          onClick={() => setIndustry(null)}
        />
        {INDUSTRIES.map((i) => (
          <SidebarRow
            key={i}
            label={i}
            count={counts.get(i) ?? 0}
            active={industry === i}
            onClick={() => setIndustry(i)}
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Status">
        <SidebarRow label="All" count={allCount} active={status === "all"} onClick={() => setStatus("all")} />
        <SidebarRow label="Live" count={liveCount} active={status === "live"} onClick={() => setStatus("live")} />
        <SidebarRow
          label="Coming soon"
          count={allCount - liveCount}
          active={status === "soon"}
          onClick={() => setStatus("soon")}
        />
      </FilterGroup>
      <FilterGroup label="Sort">
        <SidebarRow label="Live first" active={sort === "live-first"} onClick={() => setSort("live-first")} />
        <SidebarRow label="A → Z" active={sort === "alpha"} onClick={() => setSort("alpha")} />
        <SidebarRow label="Industry" active={sort === "industry"} onClick={() => setSort("industry")} />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-2">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
        active
          ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black font-semibold"
          : "text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.04]"
      }`}
    >
      <span>{label}</span>
      {count != null && (
        <span className={`font-mono text-[0.625rem] tracking-wider ${active ? "opacity-80" : "opacity-60"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─── tile + chip ─── */

function PackTile({ entry }: { entry: SearchEntry }) {
  const isLive = entry.status === "live";
  return (
    <Link
      href={entry.href}
      className="group rounded-2xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 transition hover:border-kapture-black dark:hover:border-white/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55">
          {entry.industry}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold tracking-wider ${
            isLive
              ? "bg-kapture-yellow text-kapture-black"
              : "bg-kapture-paper dark:bg-white/10 text-kapture-smoke dark:text-white/65 border border-kapture-fog dark:border-white/10"
          }`}
        >
          {isLive ? "LIVE" : entry.release ?? "SOON"}
        </span>
      </div>
      <h3 className="font-semibold text-base text-kapture-black dark:text-white tracking-[-0.01em] flex-1">
        {entry.title}
      </h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-lg text-kapture-black dark:text-white tracking-[-0.01em]">
          {isLive ? "£29" : "Notify"}
        </span>
        <span className="text-sm font-medium text-kapture-black dark:text-white group-hover:translate-x-0.5 transition">
          {isLive ? "Buy →" : "→"}
        </span>
      </div>
    </Link>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-kapture-black dark:bg-white text-white dark:text-kapture-black px-3 py-1 rounded-full text-xs font-semibold">
      {children}
      <button type="button" onClick={onClear} className="opacity-70 hover:opacity-100" aria-label="Clear filter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}
