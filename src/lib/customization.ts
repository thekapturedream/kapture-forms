/**
 * Buyer-driven theme overrides applied to the hosted runner.
 * Persisted in licenses.customization (JSONB).
 */

export type FontChoice = "manrope" | "inter" | "space-grotesk";
export type ShapeChoice = "square" | "rounded" | "pill";

export interface Customization {
  headline?: string;
  font?: FontChoice;
  accent?: string; // hex e.g. "#FFD400"
  buttonShape?: ShapeChoice;
  borderRadius?: ShapeChoice;
}

export const DEFAULT_CUSTOMIZATION: Customization = {
  headline: "",
  font: "manrope",
  accent: "#FFD400",
  buttonShape: "rounded",
  borderRadius: "rounded",
};

export const ACCENTS: Array<{ label: string; hex: string }> = [
  { label: "Kapture yellow", hex: "#FFD400" },
  { label: "Black", hex: "#0A0A0A" },
  { label: "Forest", hex: "#0F766E" },
  { label: "Indigo", hex: "#4F46E5" },
  { label: "Crimson", hex: "#B91C1C" },
  { label: "Sun", hex: "#F59E0B" },
];

export const FONTS: Array<{ id: FontChoice; label: string; preview: string }> = [
  { id: "manrope", label: "Manrope", preview: "Aa" },
  { id: "inter", label: "Inter", preview: "Aa" },
  { id: "space-grotesk", label: "Space Grotesk", preview: "Aa" },
];

export const SHAPES: Array<{ id: ShapeChoice; label: string; radius: string }> = [
  { id: "square", label: "Square", radius: "0.25rem" },
  { id: "rounded", label: "Rounded", radius: "0.75rem" },
  { id: "pill", label: "Pill", radius: "999px" },
];
