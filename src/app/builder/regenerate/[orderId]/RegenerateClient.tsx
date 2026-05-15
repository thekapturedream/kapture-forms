"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { CartButton } from "@components/cart/CartButton";
import {
  BUILDER_FORMATS,
  BUILDER_FEE_PENCE,
  BUILDER_BUNDLE_PENCE,
  type BuilderFormat,
} from "@lib/builder/types";

interface Props {
  orderId: string;
  title: string;
  originalFormat: BuilderFormat;
  maskedEmail: string;
  status: string;
}

/**
 * Format-picker UI for regenerating a builder order. The customer landed
 * here from the email's "Want another format?" CTA. They pay £2 (single)
 * or £8 (all 5) and the webhook re-runs the same fulfillment pipeline.
 */
export function RegenerateClient({
  orderId,
  title,
  originalFormat,
  maskedEmail,
  status,
}: Props) {
  const [format, setFormat] = useState<BuilderFormat>(
    originalFormat === "all" ? "pdf" : "all",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/builder/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, format }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start checkout");
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

  const price = format === "all" ? BUILDER_BUNDLE_PENCE : BUILDER_FEE_PENCE;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-kapture-black text-kapture-black dark:text-white">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-kapture-black/90 backdrop-blur-md border-b border-kapture-fog dark:border-white/10">
        <div className="kap-shell h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold text-kapture-smoke dark:text-white/55">
              <span className="text-kapture-fog dark:text-white/20">/</span>
              <span className="text-kapture-black dark:text-white">Regenerate</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CartButton size={32} />
            <ThemeToggle size={32} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center">
        <div className="kap-shell py-10 sm:py-14 lg:py-16 w-full max-w-[760px]">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-yellow mb-3">
            REGENERATE
          </div>
          <h1 className="font-bold text-3xl sm:text-4xl tracking-[-0.025em] leading-[1.1]">
            Same form. Another format.
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-kapture-smoke dark:text-white/70 leading-relaxed max-w-[560px]">
            <strong className="text-kapture-black dark:text-white">{title}</strong> — pick a new output below. £2 per format, or get all 5 for £8 and save. We email it to {maskedEmail}.
          </p>

          {status === "failed" && (
            <div className="mt-5 rounded-2xl border border-status-critical/40 bg-status-critical/5 px-5 py-4 text-sm font-medium text-status-critical">
              The original order failed to fulfill. Regenerating from this link will queue a fresh attempt with the saved schema.
            </div>
          )}

          {/* Bundle option — highlighted */}
          <div className="mt-8">
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55 mb-2.5">
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
                  <span className="font-bold text-base sm:text-lg tracking-[-0.005em]">
                    All 5 formats
                  </span>
                  <span className={`font-mono text-[0.625rem] font-bold tracking-widest px-2 py-0.5 rounded ${
                    format === "all"
                      ? "bg-kapture-yellow text-kapture-black"
                      : "bg-kapture-yellow text-kapture-black"
                  }`}>SAVE £2</span>
                </div>
                <div className={`mt-0.5 text-sm font-medium ${format === "all" ? "opacity-80" : "text-kapture-smoke dark:text-white/65"}`}>
                  PDF · DOCX · HTML · CSV · Google Forms — delivered in one email
                </div>
              </div>
              <div className="font-bold text-2xl tracking-[-0.01em] shrink-0">£8</div>
            </button>
          </div>

          {/* Single-format options */}
          <div className="mt-6">
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55 mb-2.5">
              Single format
            </div>
            <div role="radiogroup" aria-label="Single format" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUILDER_FORMATS.map((f) => {
                const active = format === f.id;
                const wasOriginal = f.id === originalFormat;
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
                    {wasOriginal && (
                      <p className="mt-2 text-[0.6875rem] font-mono font-bold tracking-widest text-kapture-yellow">
                        ALREADY SENT — RE-DELIVER FOR £2
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/builder"
              className="text-sm font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white underline-offset-2 hover:underline"
            >
              ← Back to builder
            </Link>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
            >
              {loading ? "Opening Stripe…" : `Pay £${(price / 100).toFixed(price % 100 === 0 ? 0 : 2)} & send →`}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-xs font-mono font-bold text-status-critical">{error}</p>
          )}
          <p className="mt-5 text-[0.6875rem] font-medium text-kapture-mist dark:text-white/45">
            Stripe checkout · UK VAT auto-applied · File arrives in {format === "all" ? "one email with 5 attachments" : "one email with a single attachment"}.
          </p>
        </div>
      </main>
    </div>
  );
}
