"use client";

import { useEffect, useState } from "react";
import type { StoreProduct } from "@lib/store-product";

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
    <div className="relative w-[200px] sm:w-[230px] h-[420px] sm:h-[480px] rounded-[40px] bg-kapture-black dark:bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] p-[5px]">
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-kapture-black dark:bg-white rounded-full z-10" />
      <div className="w-full h-full rounded-[35px] bg-white dark:bg-kapture-coal overflow-hidden">
        <div className="pt-7 px-3.5 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
          <FormPreview {...props} compact />
        </div>
      </div>
    </div>
  );
}

function Tablet(props: DeviceShowcaseProps) {
  return (
    <div className="relative w-[340px] sm:w-[400px] h-[440px] sm:h-[500px] rounded-[28px] bg-kapture-black dark:bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] p-[7px]">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-kapture-paper rounded-full z-10" />
      <div className="w-full h-full rounded-[22px] bg-white dark:bg-kapture-coal overflow-hidden">
        <div className="pt-6 px-6 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
          <FormPreview {...props} />
        </div>
      </div>
    </div>
  );
}

function Laptop(props: DeviceShowcaseProps) {
  return (
    <div className="w-[400px] sm:w-[480px] shrink-0">
      {/* Screen */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-t-2xl bg-kapture-black dark:bg-white p-[7px] shadow-[0_-20px_40px_-30px_rgba(0,0,0,0.25)]">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-kapture-paper rounded-full z-10" />
        <div className="w-full h-full rounded-md bg-white dark:bg-kapture-coal overflow-hidden">
          <div className="pt-4 px-6 h-full overflow-hidden" style={{ fontFamily: props.fontFamily }}>
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
    ? "text-[10px] leading-tight"
    : wide
      ? "text-sm leading-tight"
      : "text-xs leading-tight";
  const kickerClass = compact ? "text-[7px]" : "text-[8px]";
  const fieldHeight = compact ? "h-5" : "h-6";
  const buttonClass = compact ? "text-[9px] py-1.5" : wide ? "text-xs py-2" : "text-[10px] py-1.5";

  return (
    <div className="h-full flex flex-col">
      <div className={`font-mono uppercase tracking-widest text-kapture-mist dark:text-white/40 ${kickerClass} mb-1.5`}>
        {product.industry}
      </div>
      <h4 className={`font-bold text-kapture-black dark:text-white ${titleClass} mb-3`}>
        {headline || product.title}
      </h4>
      <div className="space-y-1.5 flex-1">
        {(compact ? ["Name", "Email", "DOB"] : ["Full legal name", "Email", "Date of birth", "Mobile"]).map((l) => (
          <div key={l}>
            <div className={`font-mono uppercase tracking-widest text-kapture-mist dark:text-white/40 ${kickerClass} mb-0.5`}>
              {l}
            </div>
            <div className={`${fieldHeight} bg-kapture-paper dark:bg-white/[0.05] rounded-md border border-kapture-fog dark:border-white/10`} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className={`mt-3 w-full font-semibold rounded-lg ${buttonClass}`}
        style={{
          backgroundColor: accent,
          color: parseInt(accent.slice(1), 16) > 0x888888 ? "#0A0A0A" : "#FFFFFF",
        }}
      >
        Submit & sign
      </button>
    </div>
  );
}
