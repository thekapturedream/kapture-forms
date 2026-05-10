"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to send magic link");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-kapture-paper border border-kapture-fog rounded-xl p-5">
        <div className="font-mono text-[0.625rem] uppercase tracking-widest text-status-ok mb-2">
          LINK SENT
        </div>
        <p className="text-sm text-kapture-smoke leading-relaxed">
          Check <strong>{email}</strong> for a sign-in link from Kapture Forms. It&apos;s valid
          for one hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-yellow w-full justify-center"
      >
        {status === "loading" ? "Sending…" : "Send magic link"}
      </button>
      {error && <p className="text-xs text-status-critical font-mono">{error}</p>}
    </form>
  );
}
