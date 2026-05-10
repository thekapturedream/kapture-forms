"use client";

import { useState } from "react";

interface MiniBuyFormProps {
  productId: string;
  productTitle: string;
  oneOffLabel: string;
  subscriptionLabel: string;
}

/**
 * Above-the-fold purchase widget. Email + plan toggle + buy button.
 * Posts to /api/buy/[productId] and redirects the buyer straight to
 * Stripe Checkout with the email pre-filled.
 */
export function MiniBuyForm({
  productId,
  productTitle,
  oneOffLabel,
  subscriptionLabel,
}: MiniBuyFormProps) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"oneoff" | "subscription">("oneoff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/buy/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, email: email || undefined }),
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
    <form
      onSubmit={onSubmit}
      className="bg-white border border-kapture-fog rounded-2xl p-5 lg:p-6 w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist">
          BUY · 30 SECONDS
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-yellow bg-kapture-black px-2 py-1 rounded">
          LIVE
        </span>
      </div>
      <h3 className="font-display font-semibold text-base mb-1 text-kapture-black">
        {productTitle}
      </h3>
      <p className="text-xs text-kapture-smoke mb-4">
        Pay, get your magic link, download in any of five formats.
      </p>

      {/* PLAN TOGGLE */}
      <div
        className="grid grid-cols-2 gap-2 p-1 rounded-xl border border-kapture-fog bg-kapture-paper mb-4"
        role="radiogroup"
        aria-label="Plan"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === "oneoff"}
          onClick={() => setMode("oneoff")}
          className={`px-3 py-2.5 rounded-lg text-xs font-medium transition ${
            mode === "oneoff"
              ? "bg-kapture-black text-white"
              : "text-kapture-smoke hover:text-kapture-black"
          }`}
        >
          <div className="font-display font-semibold">One-off</div>
          <div className="font-mono text-[0.625rem] tracking-wider mt-0.5 opacity-80">
            {oneOffLabel}
          </div>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === "subscription"}
          onClick={() => setMode("subscription")}
          className={`px-3 py-2.5 rounded-lg text-xs font-medium transition ${
            mode === "subscription"
              ? "bg-kapture-black text-white"
              : "text-kapture-smoke hover:text-kapture-black"
          }`}
        >
          <div className="font-display font-semibold">Hosted</div>
          <div className="font-mono text-[0.625rem] tracking-wider mt-0.5 opacity-80">
            {subscriptionLabel}
          </div>
        </button>
      </div>

      {/* EMAIL */}
      <label htmlFor="mini-buy-email" className="field-label">
        Email
      </label>
      <input
        id="mini-buy-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="field-input mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn-yellow w-full justify-center"
      >
        {loading ? "Opening Stripe…" : `Continue to checkout →`}
      </button>
      {error && (
        <p className="text-xs text-status-critical font-mono mt-2">{error}</p>
      )}
      <p className="text-[0.625rem] text-kapture-mist font-mono uppercase tracking-widest mt-3 text-center">
        Stripe · UK VAT auto-applied · cancel anytime
      </p>
    </form>
  );
}
