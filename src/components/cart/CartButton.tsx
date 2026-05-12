"use client";

import { useCart } from "./CartProvider";

/**
 * Header cart icon with an item-count badge. Drop into any nav.
 */
export function CartButton({ size = 38 }: { size?: number }) {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative rounded-full flex items-center justify-center text-kapture-black dark:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.06] transition"
      style={{ width: size, height: size }}
      aria-label={count > 0 ? `Cart · ${count} items` : "Cart"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-kapture-yellow text-kapture-black text-[0.625rem] font-mono font-bold tracking-tight flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
