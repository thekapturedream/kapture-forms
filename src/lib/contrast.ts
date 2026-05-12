/**
 * WCAG 2.1 contrast utilities.
 *
 * The previous heuristic `parseInt(hex.slice(1), 16) > 0x888888` is wrong:
 * it treats the whole RGB hex as one integer, so #FF0000 (red) registers as
 * "bright" and gets black text on it, while #00FF00 (vivid green) registers
 * as "dark" and gets white text. Both are wrong.
 *
 * The correct path is sRGB → linear → relative luminance → contrast ratio.
 * Spec: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *       https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

const KAPTURE_BLACK = "#0A0A0A";
const KAPTURE_WHITE = "#FFFFFF";

export type TextOnAccent = typeof KAPTURE_BLACK | typeof KAPTURE_WHITE;

/** Parse "#FFD400" / "FFD400" / "#FFF" → [r, g, b] in 0–255. */
export function parseHex(hex: string): [number, number, number] {
  let h = hex.replace(/^#/, "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) {
    // Safe fallback — treat malformed input as kapture-paper.
    return [0xfa, 0xfa, 0xf7];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** sRGB 0–255 channel → linear 0–1 channel. */
function srgbToLinear(c8: number): number {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of a hex colour, in 0–1. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * WCAG contrast ratio between two hex colours. 1 (no contrast) → 21 (max).
 * AA passes at ≥ 4.5 for body text, ≥ 3 for large text.
 * AAA passes at ≥ 7 for body text, ≥ 4.5 for large text.
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const La = relativeLuminance(hexA);
  const Lb = relativeLuminance(hexB);
  const lighter = Math.max(La, Lb);
  const darker = Math.min(La, Lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick the text colour (Kapture black or white) that has the highest contrast
 * against a given background. This is the right move at every spot where an
 * accent colour meets text — buttons, badges, pills, check icons over swatches.
 */
export function getContrastText(bgHex: string): TextOnAccent {
  const onBlack = contrastRatio(bgHex, KAPTURE_BLACK);
  const onWhite = contrastRatio(bgHex, KAPTURE_WHITE);
  return onBlack >= onWhite ? KAPTURE_BLACK : KAPTURE_WHITE;
}

/** WCAG compliance verdict for body text on a given background. */
export type WcagVerdict = "AAA" | "AA" | "AA-large" | "fail";

export function wcagVerdict(fgHex: string, bgHex: string): WcagVerdict {
  const r = contrastRatio(fgHex, bgHex);
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  if (r >= 3) return "AA-large";
  return "fail";
}

/**
 * Convenience: tailwind class name for the high-contrast text colour on a
 * given accent. Mirrors getContrastText but emits a class instead of a hex.
 */
export function getContrastTextClass(bgHex: string): "text-kapture-black" | "text-white" {
  return getContrastText(bgHex) === KAPTURE_BLACK ? "text-kapture-black" : "text-white";
}
