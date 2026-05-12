"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

/**
 * Slide-out cart drawer. Renders item list, qty controls, line totals,
 * grand total, and a single Checkout button that POSTs the whole cart to
 * /api/checkout/cart and redirects to Stripe.
 *
 * Mounted once in the root layout. Visibility driven by useCart().isOpen.
 *
 * Subscription / pass-mode line items can't be co-purchased with one-off
 * items in a single Stripe session — we surface a warning and disable
 * checkout until the buyer fixes it.
 */
export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, clear, totalPence } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const hasRecurring = items.some(
    (it) => it.snapshot.mode === "subscription" || it.snapshot.mode === "pass",
  );
  const hasOneOff = items.some(
    (it) => it.snapshot.mode !== "subscription" && it.snapshot.mode !== "pass",
  );
  const mixedModes = hasRecurring && hasOneOff;

  async function checkout() {
    if (items.length === 0) return;
    if (mixedModes) {
      setError(
        "Stripe can't combine a subscription and a one-off purchase in one checkout. Check out the subscription first, then come back for the rest.",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({
            slug: it.slug,
            optionId: it.optionId,
            qty: it.qty,
          })),
        }),
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Cart">
      {/* Scrim */}
      <button
        type="button"
        onClick={closeCart}
        aria-label="Close cart"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />
      {/* Panel */}
      <aside className="absolute right-0 top-0 h-full w-full sm:max-w-[440px] bg-white dark:bg-kapture-coal text-kapture-black dark:text-white shadow-2xl flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-kapture-fog dark:border-white/10">
          <div>
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/55 font-bold mb-1">
              YOUR CART
            </div>
            <h2 className="font-bold text-lg tracking-[-0.01em]">
              {items.length === 0
                ? "Empty for now."
                : `${items.length} ${items.length === 1 ? "pack" : "packs"} selected.`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-kapture-paper dark:bg-white/[0.06] flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-kapture-smoke dark:text-white/65 leading-relaxed mb-4 max-w-xs">
              Nothing in your basket yet. Add a pack from the store and it will land here.
            </p>
            <Link
              href="/store"
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-kapture-black dark:bg-white text-white dark:text-kapture-black hover:opacity-90 px-5 py-3 rounded-xl font-bold text-sm transition"
            >
              Browse all packs →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-kapture-fog dark:divide-white/10">
              {items.map((it) => (
                <li key={`${it.slug}-${it.optionId}`} className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${it.slug}`}
                        onClick={closeCart}
                        className="font-bold text-sm tracking-[-0.005em] hover:underline"
                      >
                        {it.snapshot.title}
                      </Link>
                      <div className="mt-1 text-xs font-medium text-kapture-smoke dark:text-white/65">
                        {it.snapshot.optionLabel}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center border border-kapture-fog dark:border-white/15 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setQty(it.slug, it.optionId, it.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06] font-bold"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <div className="w-9 h-8 flex items-center justify-center font-mono font-bold text-sm">
                            {it.qty}
                          </div>
                          <button
                            type="button"
                            onClick={() => setQty(it.slug, it.optionId, it.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06] font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(it.slug, it.optionId)}
                          className="text-xs font-semibold text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white underline-offset-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {it.snapshot.rrpPence && it.snapshot.rrpPence > it.snapshot.pricePence && (
                        <div className="font-mono text-[0.6875rem] font-semibold text-kapture-mist dark:text-white/45 line-through">
                          {money(it.snapshot.rrpPence * it.qty)}
                        </div>
                      )}
                      <div className="font-bold text-base tracking-[-0.01em]">
                        {money(it.snapshot.pricePence * it.qty)}
                      </div>
                      {(it.snapshot.mode === "subscription" || it.snapshot.mode === "pass") && (
                        <div className="font-mono text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 mt-0.5">/ mo</div>
                      )}
                      {it.snapshot.mode === "preorder" && (
                        <div className="text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 mt-0.5">reserve</div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="px-6 py-5 border-t border-kapture-fog dark:border-white/10 space-y-3">
              {mixedModes && (
                <div className="rounded-xl bg-kapture-paper dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 px-4 py-3 text-xs font-medium text-kapture-black dark:text-white leading-relaxed">
                  Subscription and one-off items can't be checked out together. Buy the subscription first, then come back for the rest.
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-kapture-smoke dark:text-white/55 mb-1">
                    SUBTOTAL · BEFORE VAT
                  </div>
                  <div className="text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">
                    UK VAT calculated at checkout · Stripe receipts
                  </div>
                </div>
                <div className="font-bold text-2xl tracking-[-0.02em]">{money(totalPence)}</div>
              </div>
              <button
                type="button"
                onClick={checkout}
                disabled={loading || mixedModes}
                className="w-full inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 disabled:cursor-not-allowed px-5 py-4 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
              >
                {loading ? "Opening Stripe…" : `Checkout · ${money(totalPence)} →`}
              </button>
              {error && <p className="text-xs font-mono text-status-critical text-center">{error}</p>}
              <button
                type="button"
                onClick={clear}
                className="w-full text-xs font-semibold text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white py-1"
              >
                Empty cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function money(pence: number): string {
  const isClean = pence % 100 === 0;
  return `£${(pence / 100).toFixed(isClean ? 0 : 2)}`;
}
