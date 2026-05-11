"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  POPULAR_QUERIES,
  searchCatalog,
  type SearchEntry,
} from "@lib/search-catalog";

/**
 * Conversion-tuned search hero.
 * One input + one primary yellow CTA in the same row. Live dropdown of
 * matches as the buyer types. Popular chips below. ENTER opens the top
 * result — same as clicking the button.
 */
export function SearchHero() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchEntry[] = useMemo(() => searchCatalog(q), [q]);
  const topLive = useMemo(
    () => results.find((r) => r.status === "live") ?? null,
    [results]
  );
  const showDropdown = focused && q.length > 0;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function go(href: string) {
    window.location.href = href;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const top = results[0];
    if (top) go(top.href);
    else go("/products/staff-onboarding-uk-care");
  }

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto relative">
      <form onSubmit={onSubmit}>
        {/* SEARCH ROW — input + primary CTA inline */}
        <div
          className={`flex items-stretch gap-2 transition-all ${
            focused ? "" : ""
          }`}
        >
          <div
            className={`flex-1 flex items-center bg-white rounded-2xl border transition-all ${
              focused
                ? "border-kapture-black shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                : "border-kapture-fog hover:border-kapture-mist hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
            }`}
          >
            <span className="pl-5 text-kapture-mist pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search a form — staff onboarding, AML, RAMS…"
              spellCheck={false}
              autoComplete="off"
              aria-label="Search a form"
              className="flex-1 bg-transparent text-kapture-black placeholder:text-kapture-mist text-base lg:text-[1.0625rem] py-4 pl-3.5 pr-3 focus:outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="mr-2 text-kapture-mist hover:text-kapture-black p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-kapture-black text-white hover:bg-kapture-coal transition-all rounded-2xl px-6 lg:px-7 font-medium text-sm lg:text-base whitespace-nowrap inline-flex items-center gap-2"
          >
            Find my form
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </form>

      {/* POPULAR — only when input empty */}
      {!q && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mr-1">
            Try:
          </span>
          {POPULAR_QUERIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setQ(p);
                inputRef.current?.focus();
              }}
              className="px-3 py-1.5 rounded-full bg-kapture-paper text-kapture-smoke hover:bg-white hover:text-kapture-black hover:shadow-sm border border-kapture-fog transition font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] bg-white text-kapture-black border border-kapture-fog rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="p-5">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-2">
                NOT YET ON THE ROADMAP
              </div>
              <p className="text-sm text-kapture-smoke leading-relaxed mb-3">
                We don&apos;t have a pack for &ldquo;<strong>{q}</strong>&rdquo;. Tell us what
                you need — we&apos;ll add it.
              </p>
              <a
                href={`mailto:forms@thekapture.com?subject=${encodeURIComponent(
                  `Pack request · ${q}`
                )}`}
                className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Request this form →
              </a>
            </div>
          ) : (
            <ul className="max-h-[26rem] overflow-y-auto divide-y divide-kapture-fog">
              {results.slice(0, 8).map((r, i) => (
                <li key={r.title}>
                  <Link
                    href={r.href}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-kapture-paper transition ${
                      i === 0 ? "bg-kapture-paper/40" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm text-kapture-black truncate">
                        {r.title}
                      </div>
                      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mt-0.5">
                        {r.industry}
                        {r.status === "soon" && r.release && ` · ${r.release}`}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.625rem] font-mono font-semibold tracking-wider ${
                        r.status === "live"
                          ? "bg-kapture-yellow text-kapture-black"
                          : "bg-kapture-paper text-kapture-smoke border border-kapture-fog"
                      }`}
                    >
                      {r.status === "live" ? "BUY · £29" : "NOTIFY ME"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-kapture-fog bg-kapture-paper/60 px-5 py-2.5 text-[0.625rem] font-mono uppercase tracking-widest text-kapture-mist flex items-center justify-between gap-3 flex-wrap">
            <span>↵ ENTER for top result</span>
            {topLive && q && (
              <span className="text-kapture-black">
                Top live: <span className="font-semibold">{topLive.title}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
