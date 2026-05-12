"use client";

import { useState } from "react";
import type { StoreProduct } from "@lib/store-product";

interface BuyControlsProps {
  product: StoreProduct;
}

/**
 * Apple-style selection cards + single Buy.
 *
 * - Each option is a full-width card with title + sub-line on the left
 *   and price stack on the right (Apple's iPhone-model selector pattern)
 * - Selected card gets a yellow ring; unselected stays neutral
 * - One yellow Buy button beneath
 * - Optional helper card ("Need help choosing a plan?")
 */
export function BuyControls({ product }: BuyControlsProps) {
  const initial = product.options.find((o) => o.primary)?.id ?? product.options[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(initial ?? "");
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
        body: JSON.stringify({ mode: selected.mode }),
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
    <div className="space-y-3">
      {/* Option cards */}
      <div role="radiogroup" aria-label="Choose a plan" className="space-y-2.5">
        {product.options.map((opt) => {
          const active = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(opt.id)}
              className={`w-full text-left rounded-2xl border bg-white dark:bg-white/[0.04] px-5 py-4 transition ${
                active
                  ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                  : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold text-base text-kapture-black dark:text-white tracking-[-0.005em]">
                    {opt.label}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-kapture-smoke dark:text-white/65">
                    {opt.subtitle}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {opt.rrpPence && (
                    <div className="font-mono text-xs font-semibold text-kapture-mist dark:text-white/45 line-through">
                      £{(opt.rrpPence / 100).toFixed(0)}
                    </div>
                  )}
                  <div className="font-bold text-base text-kapture-black dark:text-white">
                    £{(opt.pricePence / 100).toFixed(opt.pricePence % 100 === 0 ? 0 : 2)}
                  </div>
                  {(opt.mode === "subscription" || opt.mode === "pass") && (
                    <div className="text-xs text-kapture-smoke dark:text-white/55 font-mono font-medium">/mo</div>
                  )}
                  {opt.mode === "preorder" && (
                    <div className="text-[0.6875rem] text-kapture-smoke dark:text-white/55 font-medium">reserve fee</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper card */}
      <div className="rounded-2xl bg-kapture-paper dark:bg-white/[0.04] px-5 py-3.5 flex items-start gap-3 text-sm">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-white/[0.08] border border-kapture-fog dark:border-white/15 shrink-0 mt-0.5 text-kapture-black dark:text-white font-bold text-xs">?</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-kapture-black dark:text-white">Need help choosing a plan?</div>
          <div className="text-xs font-medium text-kapture-smoke dark:text-white/65 mt-0.5 leading-relaxed">
            One-off is for single workspaces. Hosted is for inviting staff or candidates by magic link.
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-5 py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
      >
        {loading
          ? "Opening Stripe…"
          : selected?.mode === "preorder"
            ? "Reserve →"
            : selected?.mode === "pass"
              ? "Start pass →"
              : selected?.mode === "subscription"
                ? "Subscribe →"
                : "Buy now →"}
      </button>

      {error && <p className="text-xs text-status-critical font-mono text-center">{error}</p>}

      <p className="text-center text-xs font-medium text-kapture-smoke dark:text-white/55">
        Stripe checkout · UK VAT auto-applied · Instant delivery
      </p>
    </div>
  );
}
