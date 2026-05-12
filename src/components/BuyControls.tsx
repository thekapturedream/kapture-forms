"use client";

import { useState } from "react";
import type { StoreProduct } from "@lib/store-product";
import { Check } from "lucide-react";

interface BuyControlsProps {
  product: StoreProduct;
}

/**
 * Amazon-style buy controls.
 *
 * - Pricing options as radio cards (one-off / hosted / pre-order / bundle / pass)
 * - Email capture (pre-fills Stripe Checkout)
 * - Two CTAs: Add to cart (queues + go to checkout) and Buy now (direct)
 * - Trust line + instant-delivery footer
 */
export function BuyControls({ product }: BuyControlsProps) {
  const initial = product.options.find((o) => o.primary)?.id ?? product.options[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(initial ?? "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = product.options.find((o) => o.id === selectedId) ?? product.options[0];

  async function buy() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/buy/${product.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selected.mode, email: email || undefined }),
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

  return (
    <div className="rounded-2xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-5 sm:p-6">
      {/* Pricing options */}
      <div className="space-y-2 mb-5" role="radiogroup" aria-label="Choose a plan">
        {product.options.map((opt) => {
          const active = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(opt.id)}
              className={`w-full text-left rounded-xl border p-3.5 transition ${
                active
                  ? "border-kapture-black dark:border-kapture-yellow bg-kapture-paper dark:bg-white/[0.06]"
                  : "border-kapture-fog dark:border-white/10 bg-white dark:bg-transparent hover:border-kapture-mist dark:hover:border-white/25"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 inline-flex items-center justify-center w-4 h-4 rounded-full border-2 shrink-0 transition ${
                    active
                      ? "border-kapture-black dark:border-kapture-yellow"
                      : "border-kapture-fog dark:border-white/25"
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-kapture-black dark:bg-kapture-yellow" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="font-semibold text-sm text-kapture-black dark:text-white">
                      {opt.label}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      {opt.rrpPence && (
                        <span className="font-mono text-xs text-kapture-mist dark:text-white/40 line-through">
                          £{(opt.rrpPence / 100).toFixed(0)}
                        </span>
                      )}
                      <span className="font-bold text-base text-kapture-black dark:text-white tracking-[-0.01em]">
                        £{(opt.pricePence / 100).toFixed(opt.pricePence % 100 === 0 ? 0 : 2)}
                      </span>
                      {(opt.mode === "subscription" || opt.mode === "pass") && (
                        <span className="text-xs text-kapture-mist dark:text-white/55 font-mono">/mo</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-kapture-smoke dark:text-white/60 mt-0.5">{opt.subtitle}</div>
                  {opt.note && (
                    <div className="text-[0.6875rem] text-kapture-mist dark:text-white/45 mt-1.5">{opt.note}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Email (optional pre-fill) */}
      <label htmlFor="buy-email" className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55 mb-1.5 block">
        Email (we&apos;ll send your magic link here)
      </label>
      <input
        id="buy-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-white dark:bg-kapture-coal text-kapture-black dark:text-white border border-kapture-fog dark:border-white/15 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-kapture-mist focus:outline-none focus:border-kapture-black dark:focus:border-white/40 mb-4"
      />

      {/* CTAs */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={buy}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-4 py-3 rounded-xl font-semibold text-sm transition"
        >
          {loading ? "Opening Stripe…" : selected?.mode === "preorder" ? "Reserve · pre-order →" : selected?.mode === "pass" ? "Start Designer Pass →" : selected?.mode === "subscription" ? "Subscribe →" : "Buy now →"}
        </button>
        <button
          type="button"
          onClick={buy}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 disabled:opacity-60 px-4 py-3 rounded-xl font-semibold text-sm transition"
        >
          Add to cart & checkout
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-status-critical font-mono">{error}</p>}

      {/* Trust line */}
      <ul className="mt-5 space-y-1.5 text-xs text-kapture-smoke dark:text-white/65">
        {trustLines(product).map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check size={14} strokeWidth={2.5} className="text-kapture-yellow shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-kapture-fog dark:border-white/10 font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist dark:text-white/40">
        Stripe checkout · UK VAT auto-applied · Instant magic-link delivery
      </div>
    </div>
  );
}

function trustLines(p: StoreProduct): string[] {
  if (p.status === "soon") {
    return [
      "Reserve fee locks 50% off the launch price",
      "Full pack delivered free at launch",
      "Cancel before launch for full refund",
      "SHA-256 audit hash on every submission",
    ];
  }
  if (p.isPass) {
    return [
      "Unlimited downloads in every format",
      "Source files · Figma · brand tokens",
      "White-label rights · one client domain",
      "Cancel anytime",
    ];
  }
  if (p.status === "bundle") {
    return [
      `${p.whatsIncluded.length} packs in one purchase`,
      "Save vs individual purchase",
      "Same audit hash across the bundle",
      "Lifetime updates as packs ship",
    ];
  }
  return [
    "Lifetime updates as regulators change",
    "Five export formats included",
    "Audit-hashed on every submission",
    "Instant magic-link delivery",
  ];
}
