"use client";

/**
 * ProductHighlights — single visual section that replaces the old
 * "In the pack" bullet list AND "Specs · At a glance" stats table. The
 * two were carrying the same data, just rendered twice.
 *
 *   • Top: numeric specs pulled from product.specs render as animated
 *     counters in a responsive grid (2/4/4 cols). Numbers tick up from
 *     zero with easeOutCubic when the section scrolls into view. Non-
 *     numeric specs ("SHA-256", "Lifetime") drop down into the feature
 *     grid where their context belongs.
 *
 *   • Bottom: every product.whatsIncluded line is parsed into a card
 *     with a yellow editorial number kicker (01 / 02 / 03…), a bold
 *     title (text before the first · or — separator), and a muted
 *     body line (everything after). Three columns on lg, two on sm,
 *     one on mobile.
 *
 * This is a client component because the counters animate.
 */

import { useEffect, useRef, useState } from "react";
import type { StoreProduct } from "@lib/store-product";

interface Props {
  product: StoreProduct;
}

interface NumericSpec {
  label: string;
  num: number;
  suffix: string;
}

interface Feature {
  num: number;
  title: string;
  body: string;
}

export function ProductHighlights({ product }: Props) {
  const { counters, fallbackSpecs } = splitSpecs(product.specs);
  const features = product.whatsIncluded.map((line, i) => parseFeature(line, i + 1));

  return (
    <section className="border-t border-kapture-fog dark:border-white/5 bg-kapture-paper/40 dark:bg-white/[0.02]">
      <div className="kap-shell py-14 sm:py-20 lg:py-24">
        <SectionTitle pre="In the pack." post="The full breakdown." />

        {counters.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {counters.map((c) => (
              <CounterCard key={c.label} {...c} />
            ))}
          </div>
        )}

        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f) => (
            <FeatureCard key={f.num} {...f} />
          ))}
          {fallbackSpecs.map((s) => (
            <FeatureCard
              key={`spec-${s.label}`}
              num={0}
              title={s.value}
              body={s.label}
              kicker="SPEC"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── section title ─────────── */

function SectionTitle({ pre, post }: { pre: string; post: string }) {
  return (
    <h2 className="font-bold text-2xl sm:text-3xl lg:text-[2rem] tracking-[-0.025em] leading-[1.15]">
      <span className="text-kapture-black dark:text-white">{pre}</span>{" "}
      <span className="text-kapture-mist dark:text-white/40">{post}</span>
    </h2>
  );
}

/* ─────────── counter card ─────────── */

function CounterCard({ label, num, suffix }: NumericSpec) {
  const [val, setVal] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    // Respect reduced-motion preference — snap to final value, no animation.
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setVal(num);
      setHasAnimated(true);
      return;
    }
    const node = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);
        const start = performance.now();
        const duration = 1200;
        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(num * eased));
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [num, hasAnimated]);

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white dark:bg-white/[0.04] border border-kapture-fog dark:border-white/10 px-5 py-6 sm:px-6 sm:py-7"
    >
      <div className="flex items-baseline gap-0.5 font-bold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] text-kapture-black dark:text-white tabular-nums leading-none">
        <span>{val}</span>
        {suffix && (
          <span className="font-bold text-2xl sm:text-3xl lg:text-4xl text-kapture-yellow leading-none">
            {suffix}
          </span>
        )}
      </div>
      <div className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-smoke dark:text-white/55">
        {label}
      </div>
    </div>
  );
}

/* ─────────── feature card ─────────── */

function FeatureCard({
  num,
  title,
  body,
  kicker,
}: Feature & { kicker?: string }) {
  const kickerText = kicker ?? String(num).padStart(2, "0");
  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-kapture-fog dark:border-white/10 p-5 sm:p-6 flex flex-col">
      <div className="font-mono text-[0.625rem] uppercase tracking-[0.18em] font-bold text-kapture-yellow mb-3">
        {kickerText}
      </div>
      <h3 className="font-bold text-base sm:text-[1.0625rem] text-kapture-black dark:text-white tracking-[-0.005em] leading-snug">
        {title}
      </h3>
      {body && (
        <p className="mt-2 text-sm font-medium text-kapture-smoke dark:text-white/65 leading-relaxed">
          {body}
        </p>
      )}
    </div>
  );
}

/* ─────────── parsing helpers ─────────── */

/**
 * Split product specs into:
 *  - counters: values that lead with digits (e.g. "4", "60+", "5 + hosted")
 *  - fallbackSpecs: text-only ("SHA-256", "Lifetime", "Cross-sector") which
 *    keep their context as feature cards instead of stranded labels.
 */
function splitSpecs(specs: StoreProduct["specs"]): {
  counters: NumericSpec[];
  fallbackSpecs: StoreProduct["specs"];
} {
  const counters: NumericSpec[] = [];
  const fallbackSpecs: StoreProduct["specs"] = [];
  for (const s of specs) {
    const match = /^(\d+)(.*)$/.exec(s.value.trim());
    if (match && counters.length < 4) {
      counters.push({
        label: s.label,
        num: parseInt(match[1], 10),
        suffix: match[2].trim(),
      });
    } else {
      fallbackSpecs.push(s);
    }
  }
  return { counters, fallbackSpecs };
}

/**
 * Parse a whatsIncluded line into a feature card. Splits on the first
 * '·' or '—' separator; anything before becomes the bold title, the
 * remainder becomes the body. Lines without a separator render as a
 * title-only card.
 */
function parseFeature(line: string, num: number): Feature {
  const trimmed = line.trim();
  const idx = findFirstSeparator(trimmed);
  if (idx === -1) {
    return { num, title: trimmed, body: "" };
  }
  return {
    num,
    title: trimmed.slice(0, idx).trim(),
    body: trimmed.slice(idx + 1).trim(),
  };
}

function findFirstSeparator(line: string): number {
  // Prefer the em-dash split (used as a major break) over the middot
  // (which serves as both a major break and a list separator).
  const dashIdx = line.indexOf("—");
  if (dashIdx !== -1) return dashIdx;
  const dotIdx = line.indexOf("·");
  return dotIdx;
}
