"use client";

import { useEffect, useMemo, useState } from "react";
import type { PackSchema } from "@lib/schemas/types";
import {
  BUILDER_FEE_PENCE,
  BUILDER_BUNDLE_PENCE,
  BUILDER_FORMATS,
  priceForFormat,
  type BuilderFormat,
} from "@lib/builder/types";

interface Props {
  open: boolean;
  onClose: () => void;
  schema: PackSchema;
  title: string;
}

/**
 * £2 generate-and-send dialog for the builder. Collects email and format,
 * posts to /api/builder/checkout, redirects to Stripe.
 *
 * No buyer login. Stripe handles billing address + UK VAT. The webhook
 * generates the file and emails it via Resend; this dialog hands off and
 * shuts. Success URL bounces back to the builder with ?paid=1.
 */
export function BuilderCheckoutDialog({ open, onClose, schema, title }: Props) {
  const [email, setEmail] = useState("");
  const [format, setFormat] = useState<BuilderFormat>("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esc to close + body lock.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    window.addEventListener("keydown", onKey);
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = orig;
    };
  }, [open, onClose, loading]);

  const totals = useMemo(() => {
    const sections = schema.sections.length;
    const fields = schema.sections.reduce((n, s) => n + s.fields.length, 0);
    return { sections, fields };
  }, [schema]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function submit() {
    if (!emailValid) {
      setError("Enter a valid email");
      return;
    }
    if (totals.fields === 0) {
      setError("Add at least one field before generating");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/builder/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), format, title, schema }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Generate and send">
      <button
        type="button"
        onClick={loading ? undefined : onClose}
        aria-label="Close"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 top-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6">
        <div className="bg-white dark:bg-kapture-coal text-kapture-black dark:text-white w-full sm:max-w-[640px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Top strip */}
          <div className="flex items-center gap-3 px-5 sm:px-8 h-[60px] border-b border-kapture-fog dark:border-white/10 shrink-0">
            <span className="inline-flex items-center bg-kapture-yellow text-kapture-black font-mono text-[0.625rem] font-bold tracking-widest px-2 py-1 rounded shrink-0">
              £2
            </span>
            <span className="text-xs font-bold tracking-[-0.005em] truncate text-kapture-smoke dark:text-white/65">
              Generate and send
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={loading ? undefined : onClose}
              disabled={loading}
              className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06] disabled:opacity-40"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Header band */}
          <div className="px-5 sm:px-10 pt-6 pb-5 border-b border-kapture-fog dark:border-white/10 bg-kapture-paper/40 dark:bg-white/[0.02]">
            <h2 className="font-bold text-xl sm:text-2xl tracking-[-0.015em] leading-[1.2]">
              We'll generate it and email it to you.
            </h2>
            <p className="mt-1.5 text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed">
              <strong className="text-kapture-black dark:text-white">{title}</strong> · {totals.sections} {totals.sections === 1 ? "section" : "sections"} · {totals.fields} {totals.fields === 1 ? "field" : "fields"}. Pay £2, the file lands in your inbox within seconds.
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto bg-kapture-paper/70 dark:bg-white/[0.02]">
            <div className="px-5 sm:px-10 py-7 sm:py-9 space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="builder-email" className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] font-bold text-kapture-smoke dark:text-white/70 mb-1.5">
                  Email *
                </label>
                <input
                  id="builder-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="field-input"
                />
                <p className="mt-1.5 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">
                  We send the generated file here. Stripe receipt goes here too.
                </p>
              </div>

              {/* Bundle pick — primary highlight */}
              <div>
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] font-bold text-kapture-smoke dark:text-white/70 mb-2.5">
                  Best value
                </div>
                <button
                  type="button"
                  role="radio"
                  aria-checked={format === "all"}
                  onClick={() => setFormat("all")}
                  className={`w-full text-left rounded-2xl border px-5 py-4 transition flex items-center justify-between gap-4 ${
                    format === "all"
                      ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black border-kapture-black dark:border-white"
                      : "bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base tracking-[-0.005em]">All 5 formats</span>
                      <span className="font-mono text-[0.625rem] font-bold tracking-widest bg-kapture-yellow text-kapture-black px-2 py-0.5 rounded">SAVE £2</span>
                    </div>
                    <div className={`mt-0.5 text-xs font-medium ${format === "all" ? "opacity-80" : "text-kapture-smoke dark:text-white/65"}`}>
                      PDF · DOCX · HTML · CSV · Google Forms — one email
                    </div>
                  </div>
                  <div className="font-bold text-xl tracking-[-0.01em] shrink-0">£8</div>
                </button>
              </div>

              {/* Single-format picker */}
              <div>
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.12em] font-bold text-kapture-smoke dark:text-white/70 mb-2.5">
                  Or just one · £2
                </div>
                <div role="radiogroup" aria-label="Single format" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BUILDER_FORMATS.map((f) => {
                    const active = format === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFormat(f.id)}
                        className={`text-left rounded-2xl border bg-white dark:bg-white/[0.04] px-4 py-3.5 transition ${
                          active
                            ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                            : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-sm tracking-[-0.005em] text-kapture-black dark:text-white">
                            {f.label}
                          </span>
                          <span className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-kapture-mist dark:text-white/45">
                            .{f.extension}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-kapture-smoke dark:text-white/65 leading-snug">
                          {f.blurb}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between gap-3 px-5 sm:px-10 py-4 border-t border-kapture-fog dark:border-white/10 bg-white dark:bg-kapture-coal shrink-0">
            <div>
              <div className="font-bold text-lg tracking-[-0.01em] text-kapture-black dark:text-white">
                £{(priceForFormat(format) / 100).toFixed(priceForFormat(format) % 100 === 0 ? 0 : 2)}
              </div>
              <div className="text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">
                Stripe checkout · UK VAT · Instant email
              </div>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={loading || !emailValid}
              className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold text-sm transition active:scale-[0.99]"
            >
              {loading
                ? "Opening Stripe…"
                : format === "all"
                  ? "Pay £8 & send →"
                  : `Pay £${(BUILDER_FEE_PENCE / 100).toFixed(0)} & send →`}
            </button>
          </footer>
          {error && (
            <div className="px-5 sm:px-10 pb-3 -mt-1 bg-white dark:bg-kapture-coal">
              <p className="text-xs font-mono font-bold text-status-critical">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
