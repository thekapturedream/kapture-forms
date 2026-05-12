"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import {
  PLACEHOLDER_PHRASES,
  searchCatalog,
  type SearchEntry,
} from "@lib/search-catalog";

/**
 * Animated typing placeholder + live dropdown.
 * Mobile-safe — submit button is INSIDE the input.
 */
export function SearchHero() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholder = useTypingPlaceholder(PLACEHOLDER_PHRASES, q.length > 0 || focused);

  const results: SearchEntry[] = useMemo(() => searchCatalog(q), [q]);
  const topLive = useMemo(() => results.find((r) => r.status === "live") ?? null, [results]);
  const showDropdown = focused && q.length > 0;

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
    else window.location.href = "/store";
  }

  return (
    <div ref={containerRef} className="w-full max-w-[620px] mx-auto relative">
      <form onSubmit={onSubmit}>
        <div
          className={`relative flex items-center bg-white dark:bg-white rounded-full border transition ${
            focused
              ? "border-kapture-black shadow-[0_8px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_40px_rgba(255,212,0,0.18)]"
              : "border-kapture-fog hover:border-kapture-mist"
          }`}
        >
          <span className="pl-5 text-kapture-mist pointer-events-none">
            <Search size={18} strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            aria-label="Search a form"
            className="flex-1 min-w-0 bg-transparent text-kapture-black placeholder:text-kapture-mist text-[15px] sm:text-base py-3.5 pl-3 pr-2 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="text-kapture-mist hover:text-kapture-black p-2"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Find my form"
            className="m-1.5 shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-kapture-yellow text-kapture-black hover:bg-kapture-amber active:scale-[0.97] transition"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] bg-white text-kapture-black border border-kapture-fog rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="p-5">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-2">
                NOT ON THE ROADMAP YET
              </div>
              <p className="text-sm text-kapture-smoke leading-relaxed mb-3">
                We don&apos;t have a pack for &ldquo;<strong>{q}</strong>&rdquo;. Tell us what
                you need.
              </p>
              <a
                href={`mailto:forms@thekapture.com?subject=${encodeURIComponent(`Pack request · ${q}`)}`}
                className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Request this form →
              </a>
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto divide-y divide-kapture-fog">
              {results.slice(0, 10).map((r, i) => (
                <li key={`${r.industry}-${r.title}`}>
                  <Link
                    href={r.href}
                    className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 hover:bg-kapture-paper transition ${
                      i === 0 ? "bg-kapture-paper/40" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-kapture-black truncate">{r.title}</div>
                      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mt-0.5 truncate">
                        {r.industry} · {r.subcategory}
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
                      {r.status === "live" ? "BUY · £29" : "NOTIFY"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {results.length > 0 && (
            <div className="border-t border-kapture-fog bg-kapture-paper/60 px-4 sm:px-5 py-2.5 text-[0.625rem] font-mono uppercase tracking-widest text-kapture-mist flex items-center justify-between gap-3">
              <span>↵ for top result</span>
              {topLive && (
                <span className="text-kapture-black truncate">
                  Live: <span className="font-semibold">{topLive.title}</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Cycles through phrases — types each character with a small delay, holds
 * for ~1.6s, deletes, moves to the next. Pauses while the input is active.
 */
function useTypingPlaceholder(phrases: string[], paused: boolean): string {
  const [text, setText] = useState("");
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    if (paused) return;
    let timeout: number;
    function tick() {
      const phrase = phrases[idxRef.current % phrases.length];
      const deleting = deletingRef.current;
      if (!deleting) {
        charRef.current += 1;
        setText(phrase.slice(0, charRef.current));
        if (charRef.current >= phrase.length) {
          timeout = window.setTimeout(() => {
            deletingRef.current = true;
            tick();
          }, 1600);
          return;
        }
        timeout = window.setTimeout(tick, 55);
      } else {
        charRef.current -= 1;
        setText(phrase.slice(0, Math.max(0, charRef.current)));
        if (charRef.current <= 0) {
          deletingRef.current = false;
          idxRef.current += 1;
          timeout = window.setTimeout(tick, 220);
          return;
        }
        timeout = window.setTimeout(tick, 28);
      }
    }
    timeout = window.setTimeout(tick, 220);
    return () => window.clearTimeout(timeout);
  }, [phrases, paused]);

  return `Search a form — ${text || phrases[0]}`;
}
