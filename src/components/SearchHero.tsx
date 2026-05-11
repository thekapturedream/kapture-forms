"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  POPULAR_QUERIES,
  searchCatalog,
  type SearchEntry,
} from "@lib/search-catalog";

/**
 * Search-first landing hero. One input, suggestions below, dropdown of
 * matching packs as the buyer types. Press Enter to open the top result.
 *
 * Lives on the homepage. Renders ~30 entries from `search-catalog.ts`.
 */
export function SearchHero() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchEntry[] = useMemo(() => searchCatalog(q), [q]);
  const showDropdown = focused && (q.length > 0 || results.length > 0);

  // Click outside → close dropdown
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const top = results[0];
    if (top) window.location.href = top.href;
  }

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={onSubmit} className="w-full">
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
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
            placeholder="Search forms — staff onboarding, AML, RAMS, tenant referencing…"
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-white text-kapture-black placeholder:text-kapture-mist text-base lg:text-lg pl-14 pr-5 py-5 rounded-2xl border border-kapture-fog focus:outline-none focus:border-kapture-black focus:ring-4 focus:ring-kapture-yellow/30 transition"
          />
        </div>

        {/* Popular row — hidden once user starts typing */}
        {!q && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-mono text-[0.625rem] uppercase tracking-widest text-white/45 mr-1">
              Popular:
            </span>
            {POPULAR_QUERIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setQ(p);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-3 bg-white text-kapture-black border border-kapture-fog rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="p-5">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-2">
                NO MATCHES
              </div>
              <p className="text-sm text-kapture-smoke leading-relaxed mb-3">
                We don&apos;t have a pack for &ldquo;<strong>{q}</strong>&rdquo; yet. Tell us
                what you need — we&apos;ll add it to the roadmap.
              </p>
              <a
                href={`mailto:forms@thekapture.com?subject=${encodeURIComponent(
                  `Pack request · ${q}`
                )}`}
                className="btn-yellow text-xs"
              >
                Request this form →
              </a>
            </div>
          ) : (
            <ul className="max-h-[26rem] overflow-y-auto divide-y divide-kapture-fog">
              {results.slice(0, 8).map((r) => (
                <li key={r.title}>
                  <Link
                    href={r.href}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-kapture-paper transition"
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
                      className={`shrink-0 chip text-[0.625rem] tracking-wider ${
                        r.status === "live" ? "chip-yellow" : ""
                      }`}
                    >
                      {r.status === "live" ? "LIVE · BUY" : "NOTIFY ME"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-kapture-fog bg-kapture-paper px-5 py-3 text-[0.625rem] font-mono uppercase tracking-widest text-kapture-mist flex items-center justify-between gap-3 flex-wrap">
            <span>Press ENTER for the top result</span>
            <Link href="/how-to" className="hover:text-kapture-black">
              How-to guides →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
