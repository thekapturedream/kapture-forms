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
 * The Test Form modal — full-fidelity demo of any PackSchema.
 *
 *  - Pathway switcher chips at the top. Fields with a `pathways` array
 *    only render when the active pathway matches (conditional logic).
 *  - Section-by-section nav: progress bar + section list + Next/Back.
 *  - Every legacy FieldType is rendered with a real native input plus
 *    `.field-input` styling, including selects with the custom chevron.
 *  - Submit is non-destructive — values stay in component state. On
 *    success the modal shows "Looks good." with two CTAs: Add to cart
 *    (drops the buyer's primary option into the cart) and Buy now
 *    (POSTs straight to /api/buy and redirects to Stripe).
 *
 * The same renderer can later back the real hosted runner; this demo
 * is the same code path with `mode="demo"` (no submission write).
 */
export function FormDemoModal({ open, onClose, schema, product }: Props) {
  const { addItem, openCart } = useCart();

  // Active pathway — defaults to the first one.
  const [pathwayId, setPathwayId] = useState(schema.pathways[0]?.id ?? "default");
  // Active section index.
  const [sectionIdx, setSectionIdx] = useState(0);
  // Form state — keyed by field.id.
  const [values, setValues] = useState<Record<string, string | string[] | boolean>>({});
  // Validation errors per field id.
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Finished state (submit clicked, validation passed).
  const [finished, setFinished] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  // Reset state when the modal closes so re-opening starts clean.
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

  // Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Sections filtered for the active pathway. A section is hidden if
  // EVERY field in it is gated to a different pathway.
  const visibleSections: Section[] = useMemo(() => {
    return schema.sections
      .map((s) => ({
        ...s,
        fields: s.fields.filter((f) => fieldVisible(f, pathwayId)),
      }))
      .filter((s) => s.fields.length > 0);
  }, [schema, pathwayId]);

  // Clamp section index if pathway change shrinks the section list.
  useEffect(() => {
    if (sectionIdx >= visibleSections.length) {
      setSectionIdx(Math.max(0, visibleSections.length - 1));
    }
  }, [visibleSections.length, sectionIdx]);

  if (!open) return null;

  const current = visibleSections[sectionIdx];
  const isLast = sectionIdx === visibleSections.length - 1;
  const totalRequired = visibleSections.flatMap((s) => s.fields).filter((f) => f.required).length;
  const filledRequired = visibleSections
    .flatMap((s) => s.fields)
    .filter((f) => f.required && isFilled(values[f.id])).length;

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
    const opt =
      product.options.find((o) => o.primary) ?? product.options[0];
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
    const opt =
      product.options.find((o) => o.primary) ?? product.options[0];
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
        <div className="bg-white dark:bg-kapture-coal text-kapture-black dark:text-white w-full sm:max-w-[920px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-start justify-between gap-4 px-6 sm:px-8 py-5 border-b border-kapture-fog dark:border-white/10">
            <div className="min-w-0">
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-yellow font-bold mb-1.5">
                TEST FORM · LIVE PREVIEW
              </div>
              <h2 className="font-bold text-xl sm:text-2xl tracking-[-0.015em] truncate">
                {schema.title}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-kapture-smoke dark:text-white/65">
                {visibleSections.length} {visibleSections.length === 1 ? "section" : "sections"} · {totalRequired} required fields · conditional logic on
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full w-9 h-9 flex items-center justify-center hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          {/* Pathway switcher */}
          {schema.pathways.length > 1 && (
            <div className="px-6 sm:px-8 py-4 border-b border-kapture-fog dark:border-white/10 bg-kapture-paper/50 dark:bg-white/[0.02]">
              <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/55 font-bold mb-2">
                PATHWAY · CONDITIONAL FIELDS HIDE PER CHOICE
              </div>
              <div className="flex flex-wrap gap-2">
                {schema.pathways.map((p) => {
                  const active = p.id === pathwayId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPathwayId(p.id);
                        setSectionIdx(0);
                        setErrors({});
                        setFinished(false);
                      }}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition border ${
                        active
                          ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black border-kapture-black dark:border-white"
                          : "bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {finished ? (
            <FinishedState
              product={product}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              buyLoading={buyLoading}
              buyError={buyError}
              filled={filledRequired}
              required={totalRequired}
            />
          ) : (
            <>
              {/* Progress + section list */}
              <div className="px-6 sm:px-8 pt-5 pb-3 border-b border-kapture-fog dark:border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55">
                    SECTION {sectionIdx + 1} OF {visibleSections.length}
                  </div>
                  <div className="font-mono text-[0.625rem] font-medium text-kapture-smoke dark:text-white/55">
                    {filledRequired} / {totalRequired} required
                  </div>
                </div>
                <div className="h-1 w-full bg-kapture-fog dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-kapture-yellow transition-all"
                    style={{
                      width: `${
                        ((sectionIdx + 1) / Math.max(1, visibleSections.length)) * 100
                      }%`,
                    }}
                  />
                </div>
                <nav className="mt-3 flex flex-wrap gap-1.5">
                  {visibleSections.map((s, i) => {
                    const active = i === sectionIdx;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSectionIdx(i)}
                        className={`px-2.5 py-1 rounded-md text-[0.6875rem] font-bold tracking-tight transition ${
                          active
                            ? "bg-kapture-black dark:bg-white text-white dark:text-kapture-black"
                            : "text-kapture-smoke dark:text-white/55 hover:text-kapture-black dark:hover:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Form body */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
                {current ? (
                  <>
                    <h3 className="font-bold text-lg tracking-[-0.01em] mb-1">
                      {current.name}
                    </h3>
                    {current.intro && (
                      <p className="text-sm font-medium text-kapture-smoke dark:text-white/65 leading-relaxed mb-5">
                        {current.intro}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {current.fields.map((f) => (
                        <div
                          key={f.id}
                          className={
                            f.type === "textarea" || f.type === "signature" || f.type === "checkbox"
                              ? "md:col-span-2"
                              : ""
                          }
                        >
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
                  <p className="text-sm font-medium text-kapture-smoke dark:text-white/65">
                    No fields render for this pathway. Switch pathway above.
                  </p>
                )}
              </div>

              {/* Footer nav */}
              <footer className="flex items-center justify-between gap-3 px-6 sm:px-8 py-4 border-t border-kapture-fog dark:border-white/10 bg-kapture-paper/40 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={sectionIdx === 0}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-kapture-black dark:text-white hover:bg-white dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 bg-kapture-black dark:bg-white text-white dark:text-kapture-black hover:opacity-90 px-5 py-3 rounded-xl font-bold text-sm transition active:scale-[0.99]"
                >
                  {isLast ? "Review & finish →" : "Next section →"}
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── pieces ─────────── */

function FinishedState({
  product,
  onAddToCart,
  onBuyNow,
  buyLoading,
  buyError,
  filled,
  required,
}: {
  product: StoreProduct;
  onAddToCart: () => void;
  onBuyNow: () => void;
  buyLoading: boolean;
  buyError: string | null;
  filled: number;
  required: number;
}) {
  const primary =
    product.options.find((o) => o.primary) ?? product.options[0];
  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-10">
      <div className="max-w-[560px] mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-kapture-yellow text-kapture-black mx-auto mb-5 flex items-center justify-center font-bold text-2xl">
          ✓
        </div>
        <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-kapture-smoke dark:text-white/55 font-bold mb-2">
          DEMO COMPLETE · NOTHING WAS SUBMITTED
        </div>
        <h3 className="font-bold text-2xl sm:text-3xl tracking-[-0.02em] mb-3">
          Looks good. You filled {filled} of {required} required fields.
        </h3>
        <p className="text-sm font-medium text-kapture-smoke dark:text-white/65 leading-relaxed mb-7">
          This was a test pass on the live form. To make it real — collect submissions, get the audit hash, download CSV — add it to your cart or check out now.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-[420px] mx-auto">
          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-white/[0.06] text-kapture-black dark:text-white border-2 border-kapture-black dark:border-white hover:bg-kapture-paper dark:hover:bg-white/[0.12] px-5 py-3.5 rounded-2xl font-bold text-sm transition"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={onBuyNow}
            disabled={buyLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 px-5 py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.99]"
          >
            {buyLoading
              ? "Opening Stripe…"
              : primary?.mode === "preorder"
                ? "Reserve →"
                : primary?.mode === "pass"
                  ? "Start pass →"
                  : "Buy now →"}
          </button>
        </div>
        {buyError && (
          <p className="mt-4 text-xs font-mono text-status-critical">{buyError}</p>
        )}
        <p className="mt-5 text-xs font-medium text-kapture-smoke dark:text-white/55">
          {money(primary?.pricePence ?? 2900)} {primary?.mode === "subscription" || primary?.mode === "pass" ? "/ mo" : "· Stripe checkout · UK VAT auto-applied"}
        </p>
      </div>
    </div>
  );
}

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
  const baseLabel = (
    <label htmlFor={id} className="block font-mono text-[0.6875rem] uppercase tracking-[0.08em] font-bold text-kapture-smoke dark:text-white/70 mb-1.5">
      {field.label}
      {field.required && <span className="text-status-critical ml-1">*</span>}
      {field.regulator && (
        <span className="ml-2 inline-flex items-center bg-kapture-paper dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 text-[0.5625rem] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded">
          {field.regulator}
        </span>
      )}
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
          {baseLabel}
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
          {baseLabel}
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
          {baseLabel}
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
                      : "bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white border-kapture-fog dark:border-white/15 hover:border-kapture-black"
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
            {field.regulator && (
              <span className="ml-2 inline-flex items-center bg-kapture-paper dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 text-[0.5625rem] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded align-middle">
                {field.regulator}
              </span>
            )}
            {error && <span className="block mt-1 text-xs font-mono font-bold text-status-critical">{error}</span>}
            {field.help && <span className="block mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">{field.help}</span>}
          </span>
        </label>
      );
    case "signature":
      return (
        <div>
          {baseLabel}
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
          {baseLabel}
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

function money(pence: number): string {
  const isClean = pence % 100 === 0;
  return `£${(pence / 100).toFixed(isClean ? 0 : 2)}`;
}
