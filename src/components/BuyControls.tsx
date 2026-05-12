"use client";

import { useState } from "react";
import type { StoreProduct } from "@lib/store-product";

interface BuyControlsProps {
  product: StoreProduct;
}

/**
 * Apple-style minimal buy controls.
 *
 *   - Segmented plan picker (only renders when there are 2+ options)
 *   - One single big yellow Buy button
 *   - A single quiet trust line below
 *   - No email field (Stripe collects it)
 */
export function BuyControls({ product }: BuyControlsProps) {
  const initial = product.options.find((o) => o.primary)?.id ?? product.options[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(initial ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = product.options.find((o) => o.id === selectedId) ?? product.options[0];
  const hasMultiple = product.options.length > 1;

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

  const ctaLabel = (() => {
    if (loading) return "Opening Stripe…";
    if (selected?.mode === "preorder") return "Reserve";
    if (selected?.mode === "pass") return "Start pass";
    if (selected?.mode === "subscription") return "Subscribe";
    return "Buy";
  })();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Price line */}
      <div className="flex items-baseline justify-center gap-2 mb-6">
        {selected?.rrpPence && (
          <span className="font-mono text-base text-kapture-mist dark:text-white/40 line-through">
            £{(selected.rrpPence / 100).toFixed(0)}
          </span>
        )}
        <span className="font-bold text-4xl sm:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white leading-none">
          £{selected ? (selected.pricePence / 100).toFixed(selected.pricePence % 100 === 0 ? 0 : 2) : "—"}
        </span>
        {(selected?.mode === "subscription" || selected?.mode === "pass") && (
          <span className="text-base text-kapture-smoke dark:text-white/55 font-medium">/mo</span>
        )}
      </div>

      {/* Plan segmented control */}
      {hasMultiple && (
        <div className="mb-6 grid gap-2 p-1 rounded-2xl bg-kapture-paper dark:bg-white/[0.05] border border-kapture-fog dark:border-white/10"
             style={{ gridTemplateColumns: `repeat(${product.options.length}, minmax(0, 1fr))` }}>
          {product.options.map((opt) => {
            const active = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedId(opt.id)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? "bg-white dark:bg-kapture-black text-kapture-black dark:text-white shadow-sm"
                    : "text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white"
                }`}
              >
                {planLabel(opt.mode)}
              </button>
            );
          })}
        </div>
      )}

      {/* Single CTA */}
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-5 py-4 rounded-full font-bold text-base transition active:scale-[0.99]"
      >
        {ctaLabel}
      </button>

      {error && <p className="mt-3 text-xs text-status-critical font-mono text-center">{error}</p>}

      {/* Single quiet trust line */}
      <p className="mt-5 text-center text-xs text-kapture-mist dark:text-white/50 font-medium">
        {trustLine(product, selected)}
      </p>
    </div>
  );
}

function planLabel(mode: StoreProduct["options"][number]["mode"]): string {
  switch (mode) {
    case "oneoff": return "One-off";
    case "subscription": return "Hosted";
    case "preorder": return "Pre-order";
    case "bundle": return "Bundle";
    case "pass": return "Monthly";
  }
}

function trustLine(p: StoreProduct, sel: StoreProduct["options"][number] | undefined): string {
  if (!sel) return "Stripe checkout";
  if (sel.mode === "preorder") return `Free at launch · refundable until ${p.release ?? "ship"}`;
  if (sel.mode === "subscription" || sel.mode === "pass") return "Cancel anytime · UK VAT applied";
  if (sel.mode === "bundle") return `Lifetime updates · save vs individual`;
  return "Lifetime updates · UK VAT applied";
}
