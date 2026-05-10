"use client";

import { useState } from "react";

interface BuyButtonProps {
  productId: string;
  mode: "oneoff" | "subscription";
  label: string;
  className?: string;
}

/**
 * Posts to /api/buy/[productId] and redirects the buyer to Stripe Checkout.
 * Falls back to /auth/login when Stripe isn't configured (early dev path).
 */
export function BuyButton({ productId, mode, label, className }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/buy/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
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
    <div className="inline-flex flex-col items-stretch gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={className ?? "btn-yellow"}
      >
        {loading ? "Opening checkout…" : label}
      </button>
      {error && (
        <p className="text-xs text-status-critical font-mono">{error}</p>
      )}
    </div>
  );
}
