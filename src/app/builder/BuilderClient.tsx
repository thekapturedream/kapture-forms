"use client";

/**
 * Kapture Forms · in-browser builder.
 *
 * Three columns:
 *  - PALETTE  — every primitive, grouped by category. Tap to insert.
 *  - EDITOR   — section list, fields per section, inline rename / configure,
 *               up-down reorder, remove. The form's title sits at the top.
 *  - PREVIEW  — re-renders on every keystroke. Same renderer as the runner
 *               so what you see in the builder is what the form looks like
 *               on the real product page's Test Form modal.
 *
 * Persisted to localStorage as "kapture-builder-v1". Export JSON downloads
 * the resulting PackSchema as a `.json` file. Reset clears state.
 *
 * Why this file is bigger than usual: the builder, the field editor, and
 * the preview live together because they share a tight state contract.
 * Splitting them across files would force a context provider that buys
 * nothing — the entire builder is one page-scoped React tree.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@components/Logo";
import { ThemeToggle } from "@components/ThemeToggle";
import { CartButton } from "@components/cart/CartButton";
import { BuilderCheckoutDialog } from "@components/builder/BuilderCheckoutDialog";
import {
  listPrimitives,
  listCategories,
  getPrimitive,
  type PrimitiveCategory,
  type PrimitiveId,
  type FieldInstance,
} from "@lib/primitives";
import {
  toPackSchema,
  type SectionBlock,
} from "@lib/primitives/to-pack-schema";
import type { Field, PackSchema } from "@lib/schemas/types";

/* ─────────── state shape ─────────── */

interface BuilderState {
  title: string;
  pathways: Array<{ id: string; name: string }>;
  sections: SectionBlock[];
}

const STORAGE_KEY = "kapture-builder-v1";

const INITIAL_STATE: BuilderState = {
  title: "My new form",
  pathways: [{ id: "default", name: "Standard" }],
  sections: [
    {
      id: "section-1",
      name: "Section 1",
      intro: "",
      fields: [],
    },
  ],
};

const CATEGORY_LABEL: Record<PrimitiveCategory, string> = {
  identity: "Identity",
  datetime: "Date & time",
  choice: "Choices",
  text: "Text",
  numeric: "Numbers",
  media: "Media",
  payment: "Payment",
  legal: "Legal & consent",
  layout: "Layout",
  advanced: "Advanced",
};

/* ─────────── helpers ─────────── */

function uid(prefix: string): string {
  // 8 chars of base-36 randomness — plenty for client-side ids.
  const r = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${r}`;
}

function defaultLabelFor(primitive: PrimitiveId): string {
  const spec = getPrimitive(primitive);
  return spec.label;
}

function defaultOptionsFor(primitive: PrimitiveId): string[] | undefined {
  // Sensible starter options for choice primitives so the preview isn't empty.
  switch (primitive) {
    case "select-single":
    case "radio":
      return ["Option A", "Option B", "Option C"];
    case "select-multi":
    case "checkbox-group":
      return ["Option 1", "Option 2", "Option 3"];
    default:
      return undefined;
  }
}

/* ─────────── main ─────────── */

export function BuilderClient() {
  const [state, setState] = useState<BuilderState>(INITIAL_STATE);
  const [activeSectionId, setActiveSectionId] = useState<string>(INITIAL_STATE.sections[0].id);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paidBanner, setPaidBanner] = useState(false);
  const hydrated = useRef(false);

  // Show a 'we sent it' banner when the user comes back from Stripe success.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      setPaidBanner(true);
      // Clean the URL so a refresh doesn't replay the banner.
      const url = new URL(window.location.href);
      url.searchParams.delete("paid");
      url.searchParams.delete("order");
      url.searchParams.delete("cancelled");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // Hydrate.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BuilderState;
        if (parsed && Array.isArray(parsed.sections)) {
          setState(parsed);
          setActiveSectionId(parsed.sections[0]?.id ?? "section-1");
        }
      }
    } catch {
      // ignore malformed storage
    }
    hydrated.current = true;
  }, []);

  // Persist.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const previewSchema: PackSchema = useMemo(() => {
    try {
      return toPackSchema({
        productId: "builder-preview",
        title: state.title || "My new form",
        pathways: state.pathways,
        sections: state.sections,
      });
    } catch {
      return {
        productId: "builder-preview",
        title: state.title,
        pathways: state.pathways,
        sections: [],
      };
    }
  }, [state]);

  const totalFields = state.sections.reduce((n, s) => n + s.fields.length, 0);

  /* ── editing actions ── */

  const setSectionField = useCallback(
    (sectionId: string, fieldId: string, patch: Partial<FieldInstance>) => {
      setState((s) => ({
        ...s,
        sections: s.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                fields: sec.fields.map((f) =>
                  f.instanceId === fieldId ? { ...f, ...patch } : f,
                ),
              }
            : sec,
        ),
      }));
    },
    [],
  );

  const moveField = useCallback((sectionId: string, fieldId: string, dir: -1 | 1) => {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const idx = sec.fields.findIndex((f) => f.instanceId === fieldId);
        if (idx === -1) return sec;
        const swap = idx + dir;
        if (swap < 0 || swap >= sec.fields.length) return sec;
        const next = sec.fields.slice();
        [next[idx], next[swap]] = [next[swap], next[idx]];
        return { ...sec, fields: next };
      }),
    }));
  }, []);

  const removeField = useCallback((sectionId: string, fieldId: string) => {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, fields: sec.fields.filter((f) => f.instanceId !== fieldId) }
          : sec,
      ),
    }));
    if (editingFieldId === fieldId) setEditingFieldId(null);
  }, [editingFieldId]);

  const addPrimitive = useCallback((primitive: PrimitiveId) => {
    const spec = getPrimitive(primitive);
    const inst: FieldInstance = {
      instanceId: uid("f"),
      primitive,
      label: defaultLabelFor(primitive),
      required: spec.defaultValidation.required ?? false,
      options: defaultOptionsFor(primitive),
    };
    setState((s) => {
      const targetId = activeSectionId;
      const target = s.sections.find((sec) => sec.id === targetId);
      if (!target) {
        return {
          ...s,
          sections: [
            ...s.sections,
            { id: uid("section"), name: "New section", intro: "", fields: [inst] },
          ],
        };
      }
      return {
        ...s,
        sections: s.sections.map((sec) =>
          sec.id === targetId ? { ...sec, fields: [...sec.fields, inst] } : sec,
        ),
      };
    });
    setEditingFieldId(inst.instanceId);
  }, [activeSectionId]);

  const addSection = useCallback(() => {
    const id = uid("section");
    setState((s) => ({
      ...s,
      sections: [
        ...s.sections,
        { id, name: `Section ${s.sections.length + 1}`, intro: "", fields: [] },
      ],
    }));
    setActiveSectionId(id);
  }, []);

  const updateSection = useCallback(
    (sectionId: string, patch: Partial<SectionBlock>) => {
      setState((s) => ({
        ...s,
        sections: s.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, ...patch } : sec,
        ),
      }));
    },
    [],
  );

  const removeSection = useCallback((sectionId: string) => {
    setState((s) => {
      const next = s.sections.filter((sec) => sec.id !== sectionId);
      if (next.length === 0) {
        return {
          ...s,
          sections: [{ id: uid("section"), name: "Section 1", intro: "", fields: [] }],
        };
      }
      return { ...s, sections: next };
    });
  }, []);

  const moveSection = useCallback((sectionId: string, dir: -1 | 1) => {
    setState((s) => {
      const idx = s.sections.findIndex((sec) => sec.id === sectionId);
      if (idx === -1) return s;
      const swap = idx + dir;
      if (swap < 0 || swap >= s.sections.length) return s;
      const next = s.sections.slice();
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...s, sections: next };
    });
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(previewSchema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileSlug = state.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "kapture-form";
    a.href = url;
    a.download = `${fileSlug}.kapture.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportToast(true);
    window.setTimeout(() => setShowExportToast(false), 2000);
  }, [previewSchema, state.title]);

  const resetBuilder = useCallback(() => {
    if (!window.confirm("Reset the builder? This will clear every field.")) return;
    setState(INITIAL_STATE);
    setActiveSectionId(INITIAL_STATE.sections[0].id);
    setEditingFieldId(null);
  }, []);

  /* ─────────── render ─────────── */

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-kapture-black text-kapture-black dark:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-kapture-black/90 backdrop-blur-md border-b border-kapture-fog dark:border-white/10">
        <div className="kap-shell h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold text-kapture-smoke dark:text-white/55">
              <span className="text-kapture-fog dark:text-white/20">/</span>
              <span className="text-kapture-black dark:text-white">Builder</span>
            </span>
          </div>
          <div className="hidden md:flex items-center text-xs font-mono font-medium text-kapture-smoke dark:text-white/55">
            {state.sections.length} {state.sections.length === 1 ? "section" : "sections"} · {totalFields} {totalFields === 1 ? "field" : "fields"} · auto-saved
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetBuilder}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="hidden sm:inline-flex items-center gap-1.5 border border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40 text-kapture-black dark:text-white px-3.5 py-2 rounded-lg text-xs font-bold transition"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              disabled={totalFields === 0}
              className="inline-flex items-center gap-1.5 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-2 rounded-lg text-xs font-bold transition active:scale-[0.99]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Generate · £2
            </button>
            <CartButton size={32} />
            <ThemeToggle size={32} />
          </div>
        </div>
      </header>

      {/* TITLE BAR */}
      <div className="border-b border-kapture-fog dark:border-white/10 bg-kapture-paper/40 dark:bg-white/[0.02]">
        <div className="kap-shell py-4 sm:py-5 flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={state.title}
            onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
            placeholder="Form title"
            className="flex-1 min-w-0 bg-transparent text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-kapture-black dark:text-white placeholder:text-kapture-mist dark:placeholder:text-white/30 focus:outline-none"
          />
          <Link
            href="/store"
            className="text-xs font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white"
          >
            ← Back to store
          </Link>
        </div>
      </div>

      {/* MAIN — three columns on desktop, single-column accordion on mobile */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_400px]">
        {/* PALETTE */}
        <aside className="border-b lg:border-b-0 lg:border-r border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <PrimitivePalette onAdd={addPrimitive} />
        </aside>

        {/* EDITOR */}
        <section className="border-b lg:border-b-0 lg:border-r border-kapture-fog dark:border-white/10 overflow-y-auto">
          <div className="px-5 sm:px-7 py-6 space-y-5 max-w-[760px] mx-auto">
            {/* Subtle how-it-works strip — three steps, no dismiss noise */}
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap text-[0.6875rem] font-mono font-semibold tracking-wider text-kapture-smoke dark:text-white/55 pb-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kapture-yellow text-kapture-black text-[0.5625rem] font-bold">1</span>
                TAP A PRIMITIVE
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kapture-yellow text-kapture-black text-[0.5625rem] font-bold">2</span>
                CLICK ⚙ TO CONFIGURE
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kapture-yellow text-kapture-black text-[0.5625rem] font-bold">3</span>
                GENERATE · £2
              </span>
            </div>
            {state.sections.map((section, sIdx) => (
              <SectionEditor
                key={section.id}
                section={section}
                index={sIdx}
                total={state.sections.length}
                isActive={section.id === activeSectionId}
                editingFieldId={editingFieldId}
                onActivate={() => setActiveSectionId(section.id)}
                onUpdate={(patch) => updateSection(section.id, patch)}
                onRemove={() => removeSection(section.id)}
                onMove={(dir) => moveSection(section.id, dir)}
                onFieldEdit={setEditingFieldId}
                onFieldUpdate={(fieldId, patch) =>
                  setSectionField(section.id, fieldId, patch)
                }
                onFieldMove={(fieldId, dir) => moveField(section.id, fieldId, dir)}
                onFieldRemove={(fieldId) => removeField(section.id, fieldId)}
              />
            ))}
            <button
              type="button"
              onClick={addSection}
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-dashed border-kapture-fog dark:border-white/15 hover:border-kapture-black dark:hover:border-white/40 hover:bg-kapture-paper dark:hover:bg-white/[0.04] rounded-2xl py-5 text-sm font-bold text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white transition"
            >
              + Add section
            </button>
          </div>
        </section>

        {/* PREVIEW */}
        <aside className="bg-kapture-paper/40 dark:bg-white/[0.02] lg:max-h-[calc(100vh-7.5rem)] lg:sticky lg:top-[7.5rem] overflow-y-auto">
          <LivePreview
            schema={previewSchema}
            onGenerate={() => setShowCheckout(true)}
            canGenerate={totalFields > 0}
          />
        </aside>
      </main>

      {/* PAID BANNER — appears after Stripe success bounce */}
      {paidBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[480px] w-[calc(100vw-2rem)] bg-kapture-black text-white dark:bg-white dark:text-kapture-black rounded-2xl shadow-2xl z-50 px-5 py-4 flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-kapture-yellow text-kapture-black font-bold text-sm shrink-0">✓</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm tracking-[-0.005em]">Payment received. Your form is on the way.</div>
            <div className="mt-0.5 text-xs font-medium opacity-75 leading-relaxed">
              Watch your inbox — usually under a minute. Check the spam folder if it's not there in 5.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaidBanner(false)}
            aria-label="Dismiss"
            className="opacity-60 hover:opacity-100 shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* TOAST */}
      {showExportToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-kapture-black text-white dark:bg-white dark:text-kapture-black px-5 py-3 rounded-xl shadow-2xl font-bold text-sm z-50">
          Schema exported · check your downloads
        </div>
      )}

      {/* GENERATE-AND-SEND DIALOG */}
      <BuilderCheckoutDialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        schema={previewSchema}
        title={state.title}
      />
    </div>
  );
}

/* ─────────── palette ─────────── */

function PrimitivePalette({ onAdd }: { onAdd: (id: PrimitiveId) => void }) {
  const categories = listCategories();
  return (
    <div className="h-full lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto py-5">
      <div className="px-5 mb-4">
        <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55 mb-2">
          PRIMITIVES · 40 ATOMS
        </div>
        <p className="text-xs font-medium text-kapture-smoke dark:text-white/65 leading-relaxed">
          Tap any atom to drop it into the active section.
        </p>
      </div>
      {categories.map((cat) => {
        const items = listPrimitives().filter((p) => p.category === cat);
        return (
          <div key={cat} className="mb-5">
            <div className="px-5 mb-1.5">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-kapture-mist dark:text-white/45">
                {CATEGORY_LABEL[cat]}
              </div>
            </div>
            <ul>
              {items.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onAdd(p.id)}
                    className="w-full text-left px-5 py-2 hover:bg-kapture-paper dark:hover:bg-white/[0.06] transition group"
                  >
                    <div className="text-sm font-bold text-kapture-black dark:text-white">
                      {p.label}
                    </div>
                    <div className="text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55 mt-0.5 leading-snug">
                      {p.summary}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── section editor ─────────── */

function SectionEditor({
  section,
  index,
  total,
  isActive,
  editingFieldId,
  onActivate,
  onUpdate,
  onRemove,
  onMove,
  onFieldEdit,
  onFieldUpdate,
  onFieldMove,
  onFieldRemove,
}: {
  section: SectionBlock;
  index: number;
  total: number;
  isActive: boolean;
  editingFieldId: string | null;
  onActivate: () => void;
  onUpdate: (patch: Partial<SectionBlock>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onFieldEdit: (id: string | null) => void;
  onFieldUpdate: (fieldId: string, patch: Partial<FieldInstance>) => void;
  onFieldMove: (fieldId: string, dir: -1 | 1) => void;
  onFieldRemove: (fieldId: string) => void;
}) {
  return (
    <div
      onClick={onActivate}
      className={`rounded-2xl border bg-white dark:bg-white/[0.04] transition ${
        isActive
          ? "border-kapture-black dark:border-kapture-yellow ring-1 ring-kapture-black/40 dark:ring-kapture-yellow/40"
          : "border-kapture-fog dark:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3 p-4 border-b border-kapture-fog dark:border-white/10">
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55 mb-1.5">
            SECTION {index + 1}
          </div>
          <input
            type="text"
            value={section.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Section name"
            className="w-full bg-transparent text-lg font-bold tracking-[-0.01em] text-kapture-black dark:text-white placeholder:text-kapture-mist dark:placeholder:text-white/30 focus:outline-none"
          />
          <textarea
            value={section.intro ?? ""}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdate({ intro: e.target.value })}
            placeholder="Optional intro paragraph for this section."
            rows={2}
            className="mt-1.5 w-full bg-transparent text-sm font-medium text-kapture-smoke dark:text-white/70 placeholder:text-kapture-mist dark:placeholder:text-white/30 focus:outline-none resize-none"
          />
        </div>
        <div className="flex flex-col items-stretch gap-1 shrink-0">
          <div className="flex gap-1">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onMove(-1);
              }}
              disabled={index === 0}
              aria-label="Move section up"
              title="Move up"
            >
              ↑
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onMove(1);
              }}
              disabled={index === total - 1}
              aria-label="Move section down"
              title="Move down"
            >
              ↓
            </IconButton>
          </div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove section"
            title="Remove"
            danger
          >
            ×
          </IconButton>
        </div>
      </div>

      <div className="p-4">
        {section.fields.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-kapture-fog dark:border-white/15 px-4 py-7 text-center">
            <p className="text-xs font-medium text-kapture-smoke dark:text-white/55">
              {isActive
                ? "Tap a primitive on the left to drop it in here."
                : "Click to select this section, then add primitives."}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {section.fields.map((field, idx) => (
              <li key={field.instanceId}>
                <FieldRow
                  field={field}
                  index={idx}
                  total={section.fields.length}
                  editing={field.instanceId === editingFieldId}
                  onToggleEdit={() =>
                    onFieldEdit(
                      field.instanceId === editingFieldId ? null : field.instanceId,
                    )
                  }
                  onUpdate={(patch) => onFieldUpdate(field.instanceId, patch)}
                  onMove={(dir) => onFieldMove(field.instanceId, dir)}
                  onRemove={() => onFieldRemove(field.instanceId)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─────────── field row ─────────── */

function FieldRow({
  field,
  index,
  total,
  editing,
  onToggleEdit,
  onUpdate,
  onMove,
  onRemove,
}: {
  field: FieldInstance;
  index: number;
  total: number;
  editing: boolean;
  onToggleEdit: () => void;
  onUpdate: (patch: Partial<FieldInstance>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const spec = getPrimitive(field.primitive);
  const supportsOptions =
    field.primitive === "select-single" ||
    field.primitive === "select-multi" ||
    field.primitive === "radio" ||
    field.primitive === "checkbox-group";

  return (
    <div
      className={`rounded-xl border bg-white dark:bg-white/[0.04] transition ${
        editing
          ? "border-kapture-black dark:border-kapture-yellow"
          : "border-kapture-fog dark:border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 p-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="flex-1 min-w-0 bg-transparent text-sm font-bold tracking-[-0.005em] text-kapture-black dark:text-white focus:outline-none"
        />
        <span className="hidden sm:inline-flex items-center bg-kapture-paper dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 text-[0.625rem] font-mono font-bold tracking-wider px-2 py-0.5 rounded shrink-0 text-kapture-smoke dark:text-white/65">
          {spec.label.toUpperCase()}
        </span>
        <label
          className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold text-kapture-smoke dark:text-white/65 cursor-pointer shrink-0"
          title="Required"
        >
          <input
            type="checkbox"
            checked={field.required ?? spec.defaultValidation.required ?? false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-3.5 w-3.5 rounded accent-kapture-yellow"
          />
          REQ
        </label>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton onClick={() => onMove(-1)} disabled={index === 0} title="Move up" aria-label="Move field up">↑</IconButton>
          <IconButton onClick={() => onMove(1)} disabled={index === total - 1} title="Move down" aria-label="Move field down">↓</IconButton>
          <IconButton onClick={onToggleEdit} title={editing ? "Done" : "Configure"} aria-label="Configure field">
            {editing ? "✓" : "⚙"}
          </IconButton>
          <IconButton onClick={onRemove} danger title="Remove" aria-label="Remove field">×</IconButton>
        </div>
      </div>
      {editing && (
        <div
          className="px-3 pb-3 pt-1 border-t border-kapture-fog dark:border-white/10 space-y-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ConfigRow label="Placeholder">
            <input
              type="text"
              value={field.placeholder ?? ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Optional placeholder hint"
              className="field-input"
            />
          </ConfigRow>
          <ConfigRow label="Helper text">
            <input
              type="text"
              value={field.help ?? ""}
              onChange={(e) => onUpdate({ help: e.target.value })}
              placeholder="Optional short helper printed under the field"
              className="field-input"
            />
          </ConfigRow>
          <ConfigRow label="Regulator citation">
            <input
              type="text"
              value={field.regulator ?? ""}
              onChange={(e) => onUpdate({ regulator: e.target.value })}
              placeholder="e.g. UK GDPR · Art. 6(1)(a) — printed in the audit footer"
              className="field-input"
            />
          </ConfigRow>
          {supportsOptions && (
            <ConfigRow label="Options (one per line)">
              <textarea
                value={(field.options ?? []).join("\n")}
                onChange={(e) =>
                  onUpdate({
                    options: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={Math.max(3, (field.options ?? []).length)}
                className="field-input"
                placeholder="Option A&#10;Option B&#10;Option C"
              />
            </ConfigRow>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────── live preview ─────────── */

function LivePreview({
  schema,
  onGenerate,
  canGenerate,
}: {
  schema: PackSchema;
  onGenerate: () => void;
  canGenerate: boolean;
}) {
  const totalFields = schema.sections.reduce((n, s) => n + s.fields.length, 0);
  return (
    <div className="p-5 sm:p-7">
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-yellow mb-2">
        LIVE PREVIEW · UPDATES ON EVERY KEYSTROKE
      </div>
      <h2 className="font-bold text-xl tracking-[-0.015em] mb-1">
        {schema.title || "Untitled form"}
      </h2>
      <p className="text-xs font-medium text-kapture-smoke dark:text-white/55 mb-5">
        {schema.sections.length} {schema.sections.length === 1 ? "section" : "sections"} · {totalFields} {totalFields === 1 ? "field" : "fields"}
      </p>
      {schema.sections.length === 0 || totalFields === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-kapture-fog dark:border-white/15 p-8 text-center">
          <p className="text-xs font-medium text-kapture-smoke dark:text-white/55 leading-relaxed">
            Drop primitives into a section to see the form take shape here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {schema.sections.map((sec) => (
            <div key={sec.id} className="rounded-xl border border-kapture-fog dark:border-white/10 bg-white dark:bg-white/[0.04] p-4">
              <h3 className="font-bold text-sm tracking-[-0.005em] mb-1">
                {sec.name}
              </h3>
              {sec.intro && (
                <p className="text-xs font-medium text-kapture-smoke dark:text-white/65 leading-relaxed mb-3">
                  {sec.intro}
                </p>
              )}
              <div className="space-y-3">
                {sec.fields.map((f) => (
                  <PreviewField key={f.id} field={f} />
                ))}
              </div>
            </div>
          ))}
          {/* Preview submit → opens the £2 Generate dialog. This is the
              same action as the header 'Generate · £2' button, surfaced
              where the form's submit button visually lives. */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full inline-flex items-center justify-center gap-2 bg-kapture-yellow text-kapture-black hover:bg-kapture-amber disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 rounded-xl text-sm font-bold transition active:scale-[0.99]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Generate this form · £2
          </button>
          <p className="text-center text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">
            Pay £2 → we email the file in your chosen format.
          </p>
        </div>
      )}
    </div>
  );
}

function PreviewField({ field }: { field: Field }) {
  const label = (
    <label className="block font-mono text-[0.6875rem] uppercase tracking-[0.08em] font-bold text-kapture-smoke dark:text-white/70 mb-1.5">
      {field.label}
      {field.required && <span className="text-status-critical ml-1">*</span>}
      {field.regulator && (
        <span className="ml-2 inline-flex items-center bg-kapture-paper dark:bg-white/[0.06] border border-kapture-fog dark:border-white/15 text-[0.5625rem] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded">
          {field.regulator}
        </span>
      )}
    </label>
  );
  switch (field.type) {
    case "textarea":
      return (
        <div>
          {label}
          <textarea className="field-input" placeholder={field.placeholder} rows={3} readOnly />
          {field.help && <p className="mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">{field.help}</p>}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select className="field-select" defaultValue="">
            <option value="" disabled>Choose…</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {field.help && <p className="mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">{field.help}</p>}
        </div>
      );
    case "multi-select":
      return (
        <div>
          {label}
          <div className="flex flex-wrap gap-1.5">
            {(field.options ?? []).map((opt) => (
              <span
                key={opt}
                className="px-2.5 py-1 rounded-full text-[0.6875rem] font-bold border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.04] text-kapture-black dark:text-white"
              >
                {opt}
              </span>
            ))}
          </div>
          {field.help && <p className="mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">{field.help}</p>}
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-start gap-2 text-xs font-medium text-kapture-black dark:text-white leading-relaxed cursor-not-allowed">
          <input type="checkbox" disabled className="mt-0.5 h-3.5 w-3.5 rounded accent-kapture-yellow shrink-0" />
          <span>{field.label}{field.required && <span className="text-status-critical ml-1">*</span>}</span>
        </label>
      );
    case "signature":
      return (
        <div>
          {label}
          <div className="field-input flex items-center justify-center min-h-[72px] bg-kapture-paper/60 dark:bg-white/[0.04]">
            <span className="text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">
              Canvas signature on the live form
            </span>
          </div>
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
          {label}
          <input
            type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
            className="field-input"
            placeholder={field.placeholder}
            readOnly
          />
          {field.help && <p className="mt-1 text-[0.6875rem] font-medium text-kapture-smoke dark:text-white/55">{field.help}</p>}
        </div>
      );
  }
}

/* ─────────── tiny pieces ─────────── */

function IconButton({
  children,
  onClick,
  disabled,
  danger,
  title,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`w-7 h-7 inline-flex items-center justify-center rounded-md text-sm font-bold transition ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : danger
            ? "text-status-critical hover:bg-status-critical/10"
            : "text-kapture-smoke dark:text-white/65 hover:text-kapture-black dark:hover:text-white hover:bg-kapture-paper dark:hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[0.625rem] uppercase tracking-widest font-bold text-kapture-smoke dark:text-white/65 mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}
