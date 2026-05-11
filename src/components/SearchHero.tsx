"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  POPULAR_QUERIES,
  searchCatalog,
  type SearchEntry,
} from "@lib/search-catalog";

/**
 * Search-first landing widget. Single rounded input on a white canvas,
 * two action buttons below ("Search forms" + "I'm feeling regulated"),
 * popular-search chips and a live dropdown of matches as the buyer types.
 */
export function SearchHero() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchEntry[] = useMemo(() => searchCatalog(q), [q]);
  const showDropdown = focused && q.length > 0 && results.length >= 0;

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
  }

  function feelingRegulated() {
    // Hand the buyer the live pack — Kapture's "I'm Feeling Lucky".
    const live = results.find((r) => r.status === "live");
    if (live) go(live.href);
    else go("/products/staff-onboarding-uk-care");
  }

  return (
    <div ref={containerRef} className="w-full max-w-[584px] mx-auto relative">
      <form onSubmit={onSubmit}>
        {/* SEARCH BAR — Google's pill, our chrome */}
        <div
          className={`relative flex items-center gap-3 bg-white rounded-full border transition-all ${
            focused
              ? "border-kapture-fog shadow-[0_2px_18px_rgba(0,0,0,0.10)]"
              : "border-kapture-fog hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
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
            placeholder="Search forms — staff onboarding, AML, RAMS, tenant referencing…"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search forms"
            className="flex-1 bg-transparent text-kapture-black placeholder:text-kapture-mist text-base py-3.5 pr-5 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="mr-3 text-kapture-mist hover:text-kapture-black p-1"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* BUTTON ROW — Google parallel: "Search" + "Feeling Lucky" */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button type="submit" className="btn-search">
            Search forms
          </button>
          <button
            type="button"
            onClick={feelingRegulated}
            className="btn-search"
          >
            I&apos;m feeling regulated
          </button>
        </div>
      </form>

      {/* POPULAR — only when input empty */}
      {!q && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mr-1">
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
              className="px-3 py-1.5 rounded-full bg-kapture-paper text-kapture-smoke hover:bg-kapture-fog/40 hover:text-kapture-black border border-kapture-fog transition font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-[60px] bg-white text-kapture-black border border-kapture-fog rounded-2xl shadow-2xl overflow-hidden z-50">
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
        </div>
      )}
    </div>
  );
}
