"use client";

import { useState } from "react";
import type { StoreProduct } from "@lib/store-product";
import { useCart } from "@components/cart/CartProvider";
import type { CartItem } from "@lib/cart/types";

interface BuyControlsProps {
  product: StoreProduct;
}

/**
 * Plan picker + CTAs for a product.
 *
 *   • When the product has exactly two options (the common case — one-off
 *     vs hosted), the picker becomes a 2-column grid: each card stacks
 *     label, subtitle, and price vertically so it fits comfortably in
 *     half the column width.
 *   • One option → a single full-width card. Three or more options →
 *     vertical list, which scales without dangling cells.
 *   • Selected card: yellow ring (light) / yellow border (dark).
 *   • CTAs: yellow Buy (one word + mode arrow), icon-only cart button.
 *     One trust line below. No helper card — labels speak for themselves.
 */
export function BuyControls({ product }: BuyControlsProps) {
  const initial = product.options.find((o) => o.primary)?.id ?? product.options[0]?.id;
  const [selectedId, setSelectedId] = useState<string>(initial ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const selected = product.options.find((o) => o.id === selectedId) ?? product.options[0];
  const twoOptions = product.options.length === 2;

  function addToCart() {
    if (!selected) return;
    const item: CartItem = {
      slug: product.slug,
      optionId: selected.id,
      qty: 1,
      snapshot: {
        title: product.title,
        optionLabel: selected.label,
        pricePence: selected.pricePence,
        rrpPence: selected.rrpPence,
        mode: selected.mode,
      },
    };
    addItem(item);
  }

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

  const buyLabel = loading
    ? "Opening Stripe…"
    : selected?.mode === "preorder"
      ? "Reserve →"
      : selected?.mode === "pass"
        ? "Start pass →"
        : selected?.mode === "subscription"
          ? "Subscribe →"
          : "Buy →";

  return (
    <div className="space-y-3">
      {/* Option cards — 2-col grid when there are two; otherwise stack vertically */}
      <div
        role="radiogroup"
        aria-label="Choose a plan"
        className={twoOptions ? "grid grid-cols-2 gap-2" : "space-y-2"}
      >
        {product.options.map((opt) => {
          const active = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelectedId(opt.id)}
              className={`w-full text-left rounded-2xl border bg-white dark:bg-white/[0.04] px-4 py-3.5 transition flex flex-col ${
                twoOptions ? "h-full" : ""
              } ${
                active
                  ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                  : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
              }`}
            >
              {twoOptions ? (
                <CardVertical opt={opt} />
              ) : (
                <CardHorizontal opt={opt} />
              )}
            </button>
          );
        })}
      </div>

      {/* CTAs — Buy claims the row via flex-1, cart icon only shows for
          one-off / bundle. Subscription, pass, AND preorder hide the cart
          (reservations aren't cart items; subs / passes can't be in a cart
          alongside one-offs). */}
      {(() => {
        const showCart =
          selected?.mode !== "subscription" &&
          selected?.mode !== "pass" &&
          selected?.mode !== "preorder";
        return (
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={buy}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-5 py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
            >
              {buyLabel}
            </button>
            {showCart && (
              <button
                type="button"
                onClick={addToCart}
                disabled={loading}
                aria-label="Add to cart"
                title="Add to cart"
                className="shrink-0 inline-flex items-center justify-center bg-white dark:bg-white/[0.06] text-kapture-black dark:text-white border-2 border-kapture-black dark:border-white hover:bg-kapture-paper dark:hover:bg-white/[0.12] disabled:opacity-60 w-[52px] h-[52px] rounded-2xl transition active:scale-[0.99]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
              </button>
            )}
          </div>
        );
      })()}

      {error && <p className="text-xs text-status-critical font-mono text-center">{error}</p>}

      <p className="text-center text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">
        Stripe checkout · UK VAT · Instant delivery
      </p>
    </div>
  );
}

/* ─────────── card layouts ─────────── */

function CardVertical({ opt }: { opt: StoreProduct["options"][number] }) {
  return (
    <>
      <div className="font-bold text-sm sm:text-[0.9375rem] text-kapture-black dark:text-white tracking-[-0.005em] leading-tight">
        {opt.label}
      </div>
      <div className="mt-1 text-xs font-medium text-kapture-smoke dark:text-white/65 leading-snug line-clamp-2">
        {opt.subtitle}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5 flex-wrap">
        {opt.rrpPence && opt.rrpPence > opt.pricePence && (
          <span className="font-mono text-[0.6875rem] font-semibold text-kapture-mist dark:text-white/45 line-through">
            £{(opt.rrpPence / 100).toFixed(0)}
          </span>
        )}
        <span className="font-bold text-xl text-kapture-black dark:text-white tracking-[-0.01em] leading-none">
          £{(opt.pricePence / 100).toFixed(opt.pricePence % 100 === 0 ? 0 : 2)}
        </span>
        {(opt.mode === "subscription" || opt.mode === "pass") && (
          <span className="text-[0.6875rem] text-kapture-smoke dark:text-white/55 font-mono font-medium">/mo</span>
        )}
        {opt.mode === "preorder" && (
          <span className="text-[0.6875rem] text-kapture-smoke dark:text-white/55 font-medium">reserve</span>
        )}
      </div>
    </>
  );
}

function CardHorizontal({ opt }: { opt: StoreProduct["options"][number] }) {
  return (
    <div className="flex items-start justify-between gap-4 w-full">
      <div className="min-w-0">
        <div className="font-bold text-base text-kapture-black dark:text-white tracking-[-0.005em]">
          {opt.label}
        </div>
        <div className="mt-0.5 text-sm font-medium text-kapture-smoke dark:text-white/65">
          {opt.subtitle}
        </div>
      </div>
      <div className="text-right shrink-0">
        {opt.rrpPence && opt.rrpPence > opt.pricePence && (
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
  );
}
