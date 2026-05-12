"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem } from "@lib/cart/types";

/**
 * Client-side cart state.
 *
 * - Persists to localStorage under "kapture-cart-v1" so reloads don't drop
 *   the basket.
 * - Listens for 'storage' events so a second tab adding to the cart updates
 *   this one without a refresh.
 * - The Stripe-side mode constrains how line items combine: subscription /
 *   pass modes can only be checked out alone, so the drawer surfaces this
 *   when the buyer mixes them with one-off items.
 */

const STORAGE_KEY = "kapture-cart-v1";

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalPence: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Add (or merge qty into) an item. Re-opens the drawer. */
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, optionId: string) => void;
  setQty: (slug: string, optionId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage on first mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Malformed payload — start clean rather than crash.
    }
    hydrated.current = true;
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota errors are rare; we accept the loss rather than block the UI.
    }
  }, [items]);

  // Cross-tab sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((next: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.slug === next.slug && p.optionId === next.optionId,
      );
      if (idx === -1) return [...prev, next];
      const merged = [...prev];
      merged[idx] = { ...merged[idx], qty: merged[idx].qty + next.qty };
      return merged;
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, optionId: string) => {
    setItems((prev) =>
      prev.filter((p) => !(p.slug === slug && p.optionId === optionId)),
    );
  }, []);

  const setQty = useCallback((slug: string, optionId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(slug, optionId);
      return;
    }
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug && p.optionId === optionId ? { ...p, qty } : p,
      ),
    );
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const totalPence = items.reduce((n, it) => n + it.snapshot.pricePence * it.qty, 0);
    return {
      items,
      count,
      totalPence,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQty,
      clear,
    };
  }, [items, isOpen, addItem, removeItem, setQty, clear, openCart, closeCart, toggleCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}

/**
 * Safe hook for components that may render outside the provider (e.g. during
 * static export of a route that doesn't include the provider). Returns the
 * default empty cart and no-op handlers. The full provider is mounted in
 * the root layout so this should almost never be reached.
 */
export function useCartOptional(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [],
      count: 0,
      totalPence: 0,
      isOpen: false,
      openCart: () => {},
      closeCart: () => {},
      toggleCart: () => {},
      addItem: () => {},
      removeItem: () => {},
      setQty: () => {},
      clear: () => {},
    };
  }
  return ctx;
}
