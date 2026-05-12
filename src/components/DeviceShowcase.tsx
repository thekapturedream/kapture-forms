"use client";

import { useEffect, useState } from "react";
import type { StoreProduct } from "@lib/store-product";
import { getContrastText } from "@lib/contrast";

type DeviceId = "phone" | "tablet" | "laptop";

interface DeviceShowcaseProps {
  product: StoreProduct;
  /** Buyer-side preview overrides — fed from the inline accent/font picker. */
  accent: string;
  fontFamily: string;
  headline?: string;
}

const DEVICES: DeviceId[] = ["phone", "tablet", "laptop"];

/**
 * Apple-style multi-device showcase.
 *
 * Phone → tablet → laptop, each rendering the form preview inside the
 * device frame. Auto-rotates every 5s; user can click pagination dots
 * to override. All SVG-based so it scales cleanly to any width.
 */
export function DeviceShowcase({ product, accent, fontFamily, headline }: DeviceShowcaseProps) {
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setDeviceIdx((i) => (i + 1) % DEVICES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  const device = DEVICES[deviceIdx];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full h-full flex flex-col items-center justify-center"
    >
      {/* Device frame */}
      <div className="relative w-full max-w-[520px] aspect-[4/5] flex items-center justify-center">
        <div
          key={device}
          className="w-full h-full flex items-center justify-center transition-all duration-500"
          style={{ animation: "kaptureFadeIn 0.5s ease-out" }}
        >
          {device === "phone" && <Phone product={product} accent={accent} fontFamily={fontFamily} headline={headline} />}
          {device === "tablet" && <Tablet product={product} accent={accent} fontFamily={fontFamily} headline={headline} />}
          {device === "laptop" && <Laptop product={product} accent={accent} fontFamily={fontFamily} headline={headline} />}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex items-center gap-2">
        {DEVICES.map((d, i) => (
          <button
            key={d}
            type="button"
            onClick={() => setDeviceIdx(i)}
            aria-label={`Show on ${d}`}
            className={`h-1.5 rounded-full transition-all ${
              i === deviceIdx
                ? "w-6 bg-kapture-black dark:bg-white"
                : "w-1.5 bg-kapture-fog dark:bg-white/25 hover:bg-kapture-mist"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes kaptureFadeIn {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─────────── device frames ─────────── */

function Phone(props: DeviceShowcaseProps) {
  return (
    <div className="relative w-[210px] sm:w-[240px] h-[430px] sm:h-[490px] rounded-[44px] bg-kapture-black dark:bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] p-[6px]">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-kapture-black dark:bg-white rounded-full z-10" />
      <div className="w-full h-full rounded-[38px] bg-white dark:bg-kapture-coal overflow-hidden">
        <div className="pt-9 px-5 pb-5 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
          <FormPreview {...props} compact />
        </div>
      </div>
    </div>
  );
}

function Tablet(props: DeviceShowcaseProps) {
  return (
    <div className="relative w-[360px] sm:w-[420px] h-[450px] sm:h-[520px] rounded-[32px] bg-kapture-black dark:bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] p-[8px]">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-kapture-paper rounded-full z-10" />
      <div className="w-full h-full rounded-[24px] bg-white dark:bg-kapture-coal overflow-hidden">
        <div className="pt-9 px-9 pb-7 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
          <FormPreview {...props} />
        </div>
      </div>
    </div>
  );
}

function Laptop(props: DeviceShowcaseProps) {
  return (
    <div className="w-[420px] sm:w-[500px] shrink-0">
      {/* Screen */}
      <div className="relative w-full h-[290px] sm:h-[330px] rounded-t-2xl bg-kapture-black dark:bg-white p-[8px] shadow-[0_-20px_40px_-30px_rgba(0,0,0,0.25)]">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-kapture-paper rounded-full z-10" />
        <div className="w-full h-full rounded-md bg-white dark:bg-kapture-coal overflow-hidden">
          <div className="pt-7 px-10 pb-6 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
            <FormPreview {...props} wide />
          </div>
        </div>
      </div>
      {/* Hinge */}
      <div className="relative h-3 bg-kapture-fog dark:bg-white/20 rounded-b-2xl">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-1 bg-kapture-mist dark:bg-white/40 rounded-b-md" />
      </div>
    </div>
  );
}

/* ─────────── form preview ─────────── */

function FormPreview({
  product,
  accent,
  fontFamily: _font,
  headline,
  compact,
  wide,
}: DeviceShowcaseProps & { compact?: boolean; wide?: boolean }) {
  const titleClass = compact
    ? "text-[11px] leading-tight"
    : wide
      ? "text-[15px] leading-tight"
      : "text-[13px] leading-tight";
  const kickerClass = compact ? "text-[7px]" : "text-[8px]";
  const fieldHeight = compact ? "h-5" : wide ? "h-7" : "h-6";
  const buttonClass = compact ? "text-[10px] py-2" : wide ? "text-xs py-2.5" : "text-[11px] py-2";
  const fields = compact ? ["Name", "Email", "DOB"] : wide ? ["Full legal name", "Email", "Date of birth"] : ["Full legal name", "Email", "Date of birth", "Mobile"];

  return (
    <div className="h-full flex flex-col">
      <div className={`font-mono uppercase tracking-widest font-bold text-kapture-smoke dark:text-white/55 ${kickerClass} mb-2`}>
        {product.industry}
      </div>
      <h4 className={`font-bold text-kapture-black dark:text-white tracking-[-0.005em] ${titleClass} mb-4`}>
        {headline || product.title}
      </h4>
      <div className={`flex-1 ${compact ? "space-y-2" : "space-y-2.5"}`}>
        {fields.map((l) => (
          <div key={l}>
            <div className={`font-mono uppercase tracking-widest font-bold text-kapture-smoke dark:text-white/55 ${kickerClass} mb-1`}>
              {l}
            </div>
            <div className={`${fieldHeight} bg-kapture-paper dark:bg-white/[0.05] rounded-md border border-kapture-fog dark:border-white/10`} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className={`mt-4 w-full font-bold rounded-lg ${buttonClass}`}
        style={{
          backgroundColor: accent,
          color: getContrastText(accent),
        }}
      >
        Submit &amp; sign
      </button>
    </div>
  );
}
