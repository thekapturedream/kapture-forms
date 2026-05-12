"use client";

import { useEffect, useMemo, useState } from "react";
import type { PackSchema, Field, Section } from "@lib/schemas/types";
import type { StoreProduct } from "@lib/store-product";
import { useCart } from "./cart/CartProvider";
import type { CartItem } from "@lib/cart/types";

interface Props {
  open: boolean;
  onClose: () => void;
  schema: PackSchema;
  product: StoreProduct;
}

/**
 * Test Form modal — minimal, content-first.
 *
 * Design rules (after Acie feedback "too busy, hard to know where the form
 * starts"):
 *  - One slim top strip only: tiny demo badge · pathway picker · close.
 *  - One slim progress strip: hairline bar + 'Section X of Y'.
 *  - Section title sits ABOVE the field stack as the clear visual anchor.
 *  - Single-column field layout by default — easier to scan, no eye-darting.
 *  - Sticky footer with Back / Next. No chip rail, no kicker, no meta line.
 *
 * The pathway dropdown only appears when the schema has more than one
 * pathway. Conditional logic still fires — fields with a `pathways` array
 * only render when the active pathway matches.
 */
export function FormDemoModal({ open, onClose, schema, product }: Props) {
  const { addItem, openCart } = useCart();

  const [pathwayId, setPathwayId] = useState(schema.pathways[0]?.id ?? "default");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[] | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  // Reset on close.
  useEffect(() => {
    if (!open) {
      setPathwayId(schema.pathways[0]?.id ?? "default");
      setSectionIdx(0);
      setValues({});
      setErrors({});
      setFinished(false);
      setBuyError(null);
    }
  }, [open, schema.pathways]);

  // Esc.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body lock.
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  // Sections filtered for the active pathway.
  const visibleSections: Section[] = useMemo(() => {
    return schema.sections
      .map((s) => ({
        ...s,
        fields: s.fields.filter((f) => fieldVisible(f, pathwayId)),
      }))
      .filter((s) => s.fields.length > 0);
  }, [schema, pathwayId]);

  // Clamp index when sections shrink.
  useEffect(() => {
    if (sectionIdx >= visibleSections.length) {
      setSectionIdx(Math.max(0, visibleSections.length - 1));
    }
  }, [visibleSections.length, sectionIdx]);

  if (!open) return null;

  const current = visibleSections[sectionIdx];
  const isLast = sectionIdx === visibleSections.length - 1;
  const totalSections = visibleSections.length;
  const progressPct = totalSections > 0 ? ((sectionIdx + 1) / totalSections) * 100 : 0;

  function setValue(id: string, v: string | string[] | boolean) {
    setValues((prev) => ({ ...prev, [id]: v }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  function validateCurrent(): boolean {
    if (!current) return true;
    const next: Record<string, string> = {};
    for (const f of current.fields) {
      if (f.required && !isFilled(values[f.id])) {
        next[f.id] = "Required.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateCurrent()) return;
    if (isLast) {
      setFinished(true);
    } else {
      setSectionIdx((i) => i + 1);
    }
  }

  function goBack() {
    setSectionIdx((i) => Math.max(0, i - 1));
  }

  function addToCart() {
    const opt = product.options.find((o) => o.primary) ?? product.options[0];
    if (!opt) return;
    const item: CartItem = {
      slug: product.slug,
      optionId: opt.id,
      qty: 1,
      snapshot: {
        title: product.title,
        optionLabel: opt.label,
        pricePence: opt.pricePence,
        rrpPence: opt.rrpPence,
        mode: opt.mode,
      },
    };
    addItem(item);
    onClose();
    openCart();
  }

  async function buyNow() {
    const opt = product.options.find((o) => o.primary) ?? product.options[0];
    if (!opt) return;
    setBuyLoading(true);
    setBuyError(null);
    try {
      const res = await fetch(`/api/buy/${product.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: opt.mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Something went wrong");
      setBuyLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Test form">
      {/* Scrim */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close test form"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 top-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6">
        <div className="bg-white dark:bg-kapture-coal text-kapture-black dark:text-white w-full sm:max-w-[640px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* TOP STRIP — demo badge + pathway selector + close */}
          <div className="flex items-center gap-3 px-6 sm:px-10 h-14 border-b border-kapture-fog dark:border-white/10">
            <span className="inline-flex items-center bg-kapture-paper dark:bg-white/[0.06] text-kapture-smoke dark:text-white/65 font-mono text-[0.625rem] font-bold tracking-widest px-2 py-1 rounded">
              DEMO
            </span>
            <span className="hidden sm:inline text-xs font-bold tracking-[-0.005em] truncate text-kapture-smoke dark:text-white/65">
              {schema.title}
            </span>
            <div className="flex-1" />
            {schema.pathways.length > 1 && !finished && (
              <select
                value={pathwayId}
                onChange={(e) => {
                  setPathwayId(e.target.value);
                  setSectionIdx(0);
                  setErrors({});
                  setFinished(false);
                }}
                aria-label="Pathway"
                className="appearance-none bg-transparent border border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40 text-xs font-bold pl-3 pr-7 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:border-kapture-black dark:focus:border-white/40"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237a7a7a' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                }}
              >
                {schema.pathways.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
              aria-label="Close"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {finished ? (
            <FinishedState
              product={product}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              buyLoading={buyLoading}
              buyError={buyError}
            />
          ) : (
            <>
              {/* PROGRESS — single thin bar */}
              <div className="h-0.5 w-full bg-kapture-fog dark:bg-white/10">
                <div
                  className="h-full bg-kapture-yellow transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* MAIN — form */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-[480px] mx-auto px-6 sm:px-10 py-8 sm:py-12">
                  {current ? (
                    <>
                      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-mist dark:text-white/45 mb-3">
                        Section {sectionIdx + 1} of {totalSections}
                      </div>
                      <h2 className="font-bold text-2xl sm:text-[1.75rem] leading-[1.15] tracking-[-0.02em] mb-3">
                        {current.name}
                      </h2>
                      {current.intro && (
                        <p className="text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed mb-8">
                          {current.intro}
                        </p>
                      )}
                      <div className="space-y-5">
                        {current.fields.map((f) => (
                          <FieldRenderer
                            key={f.id}
                            field={f}
                            value={values[f.id]}
                            error={errors[f.id]}
                            onChange={(v) => setValue(f.id, v)}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-kapture-smoke dark:text-white/65 text-center py-12">
                      No fields render for this pathway. Switch pathway above.
                    </p>
                  )}
                </div>
              </div>

              {/* STICKY FOOTER NAV */}
              <footer className="flex items-center justify-between gap-3 px-6 sm:px-10 py-3.5 border-t border-kapture-fog dark:border-white/10 bg-white dark:bg-kapture-coal">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={sectionIdx === 0}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 bg-kapture-black dark:bg-white text-white dark:text-kapture-black hover:opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm transition active:scale-[0.99]"
                >
                  {isLast ? "Finish →" : "Next →"}
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── finished ─────────── */

function FinishedState({
  product,
  onAddToCart,
  onBuyNow,
  buyLoading,
  buyError,
}: {
  product: StoreProduct;
  onAddToCart: () => void;
  onBuyNow: () => void;
  buyLoading: boolean;
  buyError: string | null;
}) {
  const primary =
    product.options.find((o) => o.primary) ?? product.options[0];
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[440px] mx-auto px-6 sm:px-10 py-12 sm:py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-kapture-yellow text-kapture-black mx-auto mb-6 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
        <h3 className="font-bold text-2xl sm:text-[1.75rem] tracking-[-0.02em] leading-[1.15] mb-3">
          You reached the end.
        </h3>
        <p className="text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed mb-8">
          Nothing was submitted — this was a test pass. To make it real, add the pack to your cart or check out now.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 inline-flex items-center justify-center bg-white dark:bg-white/[0.06] text-kapture-black dark:text-white border-2 border-kapture-black dark:border-white hover:bg-kapture-paper dark:hover:bg-white/[0.12] px-5 py-3 rounded-xl font-bold text-sm transition"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={onBuyNow}
            disabled={buyLoading}
            className="flex-1 inline-flex items-center justify-center bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-5 py-3 rounded-xl font-bold text-sm transition active:scale-[0.99]"
          >
            {buyLoading
              ? "Opening Stripe…"
              : primary?.mode === "preorder"
                ? "Reserve →"
                : primary?.mode === "pass"
                  ? "Start pass →"
                  : primary?.mode === "subscription"
                    ? "Subscribe →"
                    : "Buy now →"}
          </button>
        </div>
        {buyError && (
          <p className="mt-4 text-xs font-mono text-status-critical">{buyError}</p>
        )}
        <p className="mt-5 text-xs font-medium text-kapture-mist dark:text-white/45">
          Stripe checkout · UK VAT auto-applied
        </p>
      </div>
    </div>
  );
}

/* ─────────── field renderer ─────────── */

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | string[] | boolean | undefined;
  error?: string;
  onChange: (v: string | string[] | boolean) => void;
}) {
  const id = `demo-${field.id}`;
  const labelEl = (
    <label htmlFor={id} className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] font-bold text-kapture-smoke dark:text-white/65 mb-1.5">
      {field.label}
      {field.required && <span className="text-status-critical ml-1">*</span>}
    </label>
  );
  const helper = field.help ? (
    <p className="mt-1.5 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">
      {field.help}
    </p>
  ) : null;
  const errorEl = error ? (
    <p className="mt-1 text-xs font-mono font-bold text-status-critical">{error}</p>
  ) : null;

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {labelEl}
          <textarea
            id={id}
            className="field-input"
            placeholder={field.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
          {errorEl}
          {helper}
        </div>
      );
    case "select":
      return (
        <div>
          {labelEl}
          <select
            id={id}
            className="field-select"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Choose…
            </option>
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errorEl}
          {helper}
        </div>
      );
    case "multi-select":
      return (
        <div>
          {labelEl}
          <div className="flex flex-wrap gap-2">
            {(field.options ?? []).map((opt) => {
              const arr = Array.isArray(value) ? value : [];
              const active = arr.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(active ? arr.filter((v) => v !== opt) : [...arr, opt]);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                    active
                      ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black border-kapture-black dark:border-white"
                      : "bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {errorEl}
          {helper}
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-start gap-3 text-sm leading-relaxed font-medium text-kapture-black dark:text-white cursor-pointer">
          <input
            id={id}
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-kapture-fog accent-kapture-yellow shrink-0"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>
            {field.label}
            {field.required && <span className="text-status-critical ml-1">*</span>}
            {error && <span className="block mt-1 text-xs font-mono font-bold text-status-critical">{error}</span>}
            {field.help && <span className="block mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">{field.help}</span>}
          </span>
        </label>
      );
    case "signature":
      return (
        <div>
          {labelEl}
          <div
            className={`field-input flex items-center justify-center text-center cursor-pointer min-h-[88px] ${
              value ? "bg-kapture-paper/60 dark:bg-white/[0.06]" : ""
            }`}
            onClick={() => onChange(value ? "" : "✎ Signed in demo")}
            role="button"
            tabIndex={0}
          >
            {value ? (
              <span className="font-mono text-sm font-bold text-kapture-black dark:text-white">
                {String(value)} · tap again to clear
              </span>
            ) : (
              <span className="text-xs font-medium text-kapture-smoke dark:text-white/55">
                Tap to sign · live runner uses canvas draw
              </span>
            )}
          </div>
          {errorEl}
          {helper}
        </div>
      );
    case "email":
    case "tel":
    case "date":
    case "number":
    case "text":
    default:
      return (
        <div>
          {labelEl}
          <input
            id={id}
            type={field.type}
            className="field-input"
            placeholder={field.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {errorEl}
          {helper}
        </div>
      );
  }
}

/* ─────────── helpers ─────────── */

function fieldVisible(field: Field, pathwayId: string): boolean {
  if (!field.pathways || field.pathways.length === 0) return true;
  return field.pathways.includes(pathwayId);
}

function isFilled(v: string | string[] | boolean | undefined): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return v === true;
  if (Array.isArray(v)) return v.length > 0;
  return false;
}
