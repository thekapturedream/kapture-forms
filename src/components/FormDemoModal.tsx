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
 * Test Form modal — rebalanced layout.
 *
 *  Top strip       — DEMO pill · form name · pathway picker · close.
 *  Header band     — form title + one-line use-case subtitle. Always visible
 *                    so the buyer knows what they're testing without scrolling.
 *  Progress strip  — one dot per section, current dot yellow, completed dots
 *                    filled, future dots outlined. Section name + 'X of Y'
 *                    indicator on the right. Real progress, no chip rail.
 *  Form body       — section intro, then a 2-column responsive grid of fields.
 *                    Textarea / signature / multi-select / checkbox span the
 *                    full row. Single column on mobile.
 *  Footer          — generous padding. Back ← / Next →.
 *
 * Pathway switching, conditional field visibility, validation gating, and
 * the finished-state checkout flow are unchanged.
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  const visibleSections: Section[] = useMemo(() => {
    return schema.sections
      .map((s) => ({
        ...s,
        fields: s.fields.filter((f) => fieldVisible(f, pathwayId)),
      }))
      .filter((s) => s.fields.length > 0);
  }, [schema, pathwayId]);

  useEffect(() => {
    if (sectionIdx >= visibleSections.length) {
      setSectionIdx(Math.max(0, visibleSections.length - 1));
    }
  }, [visibleSections.length, sectionIdx]);

  if (!open) return null;

  const current = visibleSections[sectionIdx];
  const isLast = sectionIdx === visibleSections.length - 1;
  const totalSections = visibleSections.length;

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
        next[f.id] = "Required";
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
      // Scroll the form region to the top when advancing.
      requestAnimationFrame(() => {
        const main = document.getElementById("kap-demo-main");
        if (main) main.scrollTop = 0;
      });
    }
  }

  function goBack() {
    setSectionIdx((i) => Math.max(0, i - 1));
    requestAnimationFrame(() => {
      const main = document.getElementById("kap-demo-main");
      if (main) main.scrollTop = 0;
    });
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
      <button
        type="button"
        onClick={onClose}
        aria-label="Close test form"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />
      <div className="absolute inset-x-0 top-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6">
        <div className="bg-white dark:bg-kapture-coal text-kapture-black dark:text-white w-full sm:max-w-[880px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* ── TOP STRIP ── */}
          <div className="flex items-center gap-3 px-5 sm:px-8 h-[60px] border-b border-kapture-fog dark:border-white/10 shrink-0">
            <span className="inline-flex items-center bg-kapture-yellow text-kapture-black font-mono text-[0.625rem] font-bold tracking-widest px-2 py-1 rounded shrink-0">
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
                className="appearance-none bg-white dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40 text-xs font-bold text-kapture-black dark:text-white pl-3 pr-8 py-2 rounded-lg cursor-pointer focus:outline-none focus:border-kapture-black dark:focus:border-white/40 shrink-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237a7a7a' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.625rem center",
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
              className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06] shrink-0"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
              {/* ── HEADER BAND ── form-level use-case context */}
              <div className="px-5 sm:px-10 pt-6 pb-5 sm:pt-7 sm:pb-6 border-b border-kapture-fog dark:border-white/10 bg-kapture-paper/40 dark:bg-white/[0.02]">
                <h2 className="font-bold text-xl sm:text-2xl tracking-[-0.015em] leading-[1.2]">
                  {schema.title}
                </h2>
                <p className="mt-1.5 text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed max-w-[640px]">
                  {product.hook}
                </p>
              </div>

              {/* ── PROGRESS STRIP ── dots + section indicator */}
              <div className="px-5 sm:px-10 py-3.5 flex items-center justify-between gap-4 border-b border-kapture-fog dark:border-white/10 shrink-0">
                <ProgressDots total={totalSections} current={sectionIdx} />
                <div className="flex items-baseline gap-2 shrink-0 min-w-0">
                  <span className="hidden sm:inline text-xs font-bold tracking-[-0.005em] text-kapture-black dark:text-white truncate">
                    {current?.name ?? ""}
                  </span>
                  <span className="font-mono text-[0.6875rem] font-bold tracking-wider text-kapture-mist dark:text-white/45 whitespace-nowrap">
                    {sectionIdx + 1} / {totalSections}
                  </span>
                </div>
              </div>

              {/* ── FORM BODY ── */}
              <div id="kap-demo-main" className="flex-1 overflow-y-auto">
                <div className="px-5 sm:px-10 py-7 sm:py-9">
                  {current ? (
                    <>
                      <h3 className="font-bold text-lg sm:text-xl tracking-[-0.01em] mb-2 sm:hidden">
                        {current.name}
                      </h3>
                      {current.intro && (
                        <p className="text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed mb-7 sm:mb-8 max-w-[640px]">
                          {current.intro}
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-x-6 sm:gap-y-6">
                        {current.fields.map((f) => (
                          <div key={f.id} className={spanClassFor(f)}>
                            <FieldRenderer
                              field={f}
                              value={values[f.id]}
                              error={errors[f.id]}
                              onChange={(v) => setValue(f.id, v)}
                            />
                          </div>
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

              {/* ── FOOTER ── */}
              <footer className="flex items-center justify-between gap-3 px-5 sm:px-10 py-4 sm:py-5 border-t border-kapture-fog dark:border-white/10 bg-white dark:bg-kapture-coal shrink-0">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={sectionIdx === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 bg-kapture-black dark:bg-white text-white dark:text-kapture-black hover:opacity-90 px-6 py-3 rounded-xl font-bold text-sm transition active:scale-[0.99]"
                >
                  {isLast ? "Finish demo →" : "Next section →"}
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── progress dots ─────────── */

function ProgressDots({ total, current }: { total: number; current: number }) {
  // Cap the dot count for very long forms (>12 sections) — fall back to a
  // hairline with current/total numerals so we don't paint a pixel parade.
  if (total > 12) {
    return (
      <div className="flex-1 flex items-center gap-3">
        <div className="h-1 flex-1 bg-kapture-fog dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-kapture-yellow transition-all duration-300 rounded-full"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => {
        const isPast = i < current;
        const isCurrent = i === current;
        return (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all ${
              isCurrent
                ? "w-6 bg-kapture-yellow"
                : isPast
                  ? "w-1.5 bg-kapture-black dark:bg-white"
                  : "w-1.5 bg-kapture-fog dark:bg-white/15"
            }`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

/* ─────────── finished state ─────────── */

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
      <div className="max-w-[520px] mx-auto px-6 sm:px-10 py-12 sm:py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-kapture-yellow text-kapture-black mx-auto mb-6 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
        <h3 className="font-bold text-2xl sm:text-[1.75rem] tracking-[-0.02em] leading-[1.15] mb-3">
          You reached the end.
        </h3>
        <p className="text-sm font-medium text-kapture-smoke dark:text-white/70 leading-relaxed mb-8 max-w-[420px] mx-auto">
          Nothing was submitted — this was a test pass. To make it real, add the pack to your cart or check out now.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-[420px] mx-auto">
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
    <div className="flex items-baseline justify-between gap-2 mb-1.5">
      <label htmlFor={id} className="font-mono text-[0.625rem] uppercase tracking-[0.12em] font-bold text-kapture-smoke dark:text-white/70">
        {field.label}
        {field.required && <span className="text-status-critical ml-1">*</span>}
      </label>
      {error && (
        <span className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-status-critical">
          {error}
        </span>
      )}
    </div>
  );
  const helper = field.help ? (
    <p className="mt-1.5 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">
      {field.help}
    </p>
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
            {error && (
              <span className="block mt-1 text-xs font-mono font-bold text-status-critical">{error}</span>
            )}
            {field.help && (
              <span className="block mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">
                {field.help}
              </span>
            )}
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
          {helper}
        </div>
      );
  }
}

/* ─────────── grid span ─────────── */

/**
 * Decide whether a field gets one or two grid columns on desktop. Long-form
 * inputs span the full row so they read like prose; short fields pair up.
 */
function spanClassFor(field: Field): string {
  const isWide =
    field.type === "textarea" ||
    field.type === "signature" ||
    field.type === "checkbox" ||
    field.type === "multi-select" ||
    // Heuristic: address-like fields are usually 'Address line 1', 'line 2'
    // — keep those full-width so the URL bar of an input doesn't get cramped.
    /address line|address|notes|statement|exhibits|describe|comments/i.test(field.label);
  return isWide ? "sm:col-span-2" : "sm:col-span-1";
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
