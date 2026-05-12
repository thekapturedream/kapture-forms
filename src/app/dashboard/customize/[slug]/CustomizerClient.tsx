"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import {
  ACCENTS,
  FONTS,
  SHAPES,
  type Customization,
  type ShapeChoice,
  type FontChoice,
} from "@lib/customization";

interface Props {
  slug: string;
  productId: string;
  initial: Customization;
}

const FONT_FAMILY: Record<FontChoice, string> = {
  manrope: "'Manrope', system-ui, sans-serif",
  inter: "'Inter', system-ui, sans-serif",
  "space-grotesk": "'Space Grotesk', system-ui, sans-serif",
};

const RADIUS: Record<ShapeChoice, string> = {
  square: "4px",
  rounded: "12px",
  pill: "9999px",
};

export function CustomizerClient({ slug, productId, initial }: Props) {
  const [draft, setDraft] = useState<Customization>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Customization>(key: K, value: Customization[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/customize/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-kapture-black/85 backdrop-blur-md border-b border-kapture-fog dark:border-white/5">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle size={32} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-[1180px] px-5 sm:px-6 lg:px-10 pt-6 pb-12 sm:pb-16">
          <h1 className="font-semibold text-xl sm:text-2xl tracking-[-0.015em] text-kapture-black dark:text-white">
            Customise.{" "}
            <span className="text-kapture-mist dark:text-white/40">
              Brand your hosted form.
            </span>
          </h1>
          <p className="mt-1 text-sm text-kapture-smoke dark:text-white/65">
            License <span className="font-mono">{slug.slice(0, 16)}…</span> · pack{" "}
            <span className="font-mono">{productId}</span>
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT — controls */}
            <div className="lg:col-span-7 space-y-10">
              <Group title="Headline." sub="What candidates see at the top.">
                <input
                  type="text"
                  value={draft.headline ?? ""}
                  onChange={(e) => set("headline", e.target.value)}
                  placeholder="Welcome to onboarding — please complete the steps below."
                  maxLength={120}
                  className="w-full bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white border border-kapture-fog dark:border-white/15 rounded-xl px-4 py-3 text-base placeholder:text-kapture-mist focus:outline-none focus:border-kapture-black dark:focus:border-white/40"
                />
                <p className="mt-2 text-xs text-kapture-mist dark:text-white/45">
                  {(draft.headline ?? "").length} / 120
                </p>
              </Group>

              <Group title="Font." sub="Pick a typeface for the form.">
                <div className="grid grid-cols-3 gap-2">
                  {FONTS.map((f) => {
                    const active = draft.font === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => set("font", f.id)}
                        className={`rounded-xl border p-4 text-center transition ${
                          active
                            ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                            : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
                        }`}
                      >
                        <div
                          className="font-bold text-2xl text-kapture-black dark:text-white mb-1"
                          style={{ fontFamily: FONT_FAMILY[f.id] }}
                        >
                          {f.preview}
                        </div>
                        <div className="text-xs font-medium text-kapture-smoke dark:text-white/65">
                          {f.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Group>

              <Group title="Accent." sub="One colour for buttons and the audit-hash badge.">
                <div className="flex flex-wrap gap-2.5">
                  {ACCENTS.map((a) => {
                    const active = draft.accent?.toUpperCase() === a.hex.toUpperCase();
                    return (
                      <button
                        key={a.hex}
                        type="button"
                        onClick={() => set("accent", a.hex)}
                        title={a.label}
                        aria-label={a.label}
                        className={`relative w-9 h-9 rounded-full border-2 transition ${
                          active
                            ? "border-kapture-black dark:border-white"
                            : "border-transparent hover:border-kapture-fog dark:hover:border-white/30"
                        }`}
                        style={{ backgroundColor: a.hex }}
                      >
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check
                              size={14}
                              strokeWidth={3}
                              className={parseInt(a.hex.slice(1), 16) > 0x888888 ? "text-kapture-black" : "text-white"}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Group>

              <Group title="Button shape." sub="Square edges, rounded, or pill.">
                <div className="grid grid-cols-3 gap-2">
                  {SHAPES.map((s) => {
                    const active = draft.buttonShape === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => set("buttonShape", s.id)}
                        className={`rounded-xl border p-3 text-center transition ${
                          active
                            ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                            : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <span
                            className="inline-block bg-kapture-black dark:bg-white"
                            style={{ width: 48, height: 16, borderRadius: RADIUS[s.id] }}
                          />
                        </div>
                        <div className="text-xs font-medium text-kapture-smoke dark:text-white/65">
                          {s.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Group>

              <Group title="Card corners." sub="How rounded the input fields look.">
                <div className="grid grid-cols-3 gap-2">
                  {SHAPES.map((s) => {
                    const active = draft.borderRadius === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => set("borderRadius", s.id)}
                        className={`rounded-xl border p-3 text-center transition ${
                          active
                            ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black dark:ring-kapture-yellow"
                            : "border-kapture-fog dark:border-white/15 hover:border-kapture-mist dark:hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <span
                            className="inline-block bg-white border-2 border-kapture-fog dark:bg-white/10 dark:border-white/20"
                            style={{ width: 48, height: 22, borderRadius: RADIUS[s.id] }}
                          />
                        </div>
                        <div className="text-xs font-medium text-kapture-smoke dark:text-white/65">
                          {s.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Group>
            </div>

            {/* RIGHT — live preview */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/40 mb-3">
                  PREVIEW
                </div>
                <div
                  className="rounded-3xl border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] p-6"
                  style={{ fontFamily: FONT_FAMILY[(draft.font as FontChoice) ?? "manrope"] }}
                >
                  <h3
                    className="font-bold text-xl tracking-[-0.015em] text-kapture-black dark:text-white"
                    style={{ color: undefined }}
                  >
                    {draft.headline || "Welcome to your hosted form."}
                  </h3>
                  <div className="mt-5 space-y-3">
                    <PreviewInput shape={draft.borderRadius} label="Full legal name" />
                    <PreviewInput shape={draft.borderRadius} label="Email" />
                    <PreviewInput shape={draft.borderRadius} label="Date of birth" />
                  </div>
                  <button
                    type="button"
                    className="mt-5 w-full inline-flex items-center justify-center px-5 py-3 font-semibold text-sm transition active:scale-[0.99]"
                    style={{
                      backgroundColor: draft.accent ?? "#FFD400",
                      color: parseInt((draft.accent ?? "#FFD400").slice(1), 16) > 0x888888 ? "#0A0A0A" : "#FFFFFF",
                      borderRadius: RADIUS[(draft.buttonShape as ShapeChoice) ?? "rounded"],
                    }}
                  >
                    Submit & sign
                  </button>
                  <p className="mt-3 text-[0.6875rem] text-center text-kapture-mist dark:text-white/45 font-mono uppercase tracking-widest">
                    SHA-256 audit hash on submit
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 bg-kapture-black text-white dark:bg-white dark:text-kapture-black hover:opacity-90 disabled:opacity-60 px-5 py-3.5 rounded-2xl font-semibold text-sm transition"
                  >
                    {saving ? "Saving…" : "Save customisations"}
                  </button>
                  {error && <p className="mt-2 text-xs text-status-critical font-mono text-center">{error}</p>}
                  {savedAt && !error && (
                    <p className="mt-2 text-xs text-status-ok font-mono text-center">Saved · changes live</p>
                  )}
                  <p className="mt-3 text-center text-xs text-kapture-mist dark:text-white/45">
                    Open <Link href={`/run/${slug}`} className="underline">/run/{slug}</Link> to see it live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Group({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-semibold text-base sm:text-lg tracking-[-0.01em]">
        <span className="text-kapture-black dark:text-white">{title}</span>
        <span className="text-kapture-mist dark:text-white/40"> {sub}</span>
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PreviewInput({ shape, label }: { shape: ShapeChoice | undefined; label: string }) {
  const r = RADIUS[shape ?? "rounded"];
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-smoke dark:text-white/55 mb-1">
        {label}
      </div>
      <div
        className="h-10 bg-kapture-paper dark:bg-white/[0.05] border border-kapture-fog dark:border-white/15"
        style={{ borderRadius: r }}
      />
    </div>
  );
}
