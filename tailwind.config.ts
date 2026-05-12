import type { Config } from "tailwindcss";

// Kapture Forms — locked design tokens.
// Mirror of kapture-care/tailwind.config.ts so the brand stays consistent
// across products. See ../BRAND.md for the rationale.

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        kapture: {
          black: "#0A0A0A",
          ink: "#111111",
          coal: "#1A1A1A",
          ash: "#2A2A2A",
          smoke: "#3A3A3A",
          mist: "#9A9A9A",
          fog: "#D4D4D4",
          paper: "#F5F5F5",
          white: "#FFFFFF",
          yellow: "#FFD400",
          amber: "#F5B400",
        },
        // Status layer — used on submission queues, audit views, refund flows.
        status: {
          critical: "#E5484D",
          warning: "#FFD400",
          ok: "#10B981",
          neutral: "#D4D4D4",
        },
        // Industry sector accents — Forms-only. See BRAND.md.
        industry: {
          healthcare: "#FFD400",
          hr: "#A5B4FC",
          finance: "#10B981",
          legal: "#1F4E53",
          education: "#FDA4AF",
          hospitality: "#F5B400",
          realestate: "#86EFAC",
          construction: "#FCD34D",
          public: "#0A0A0A",
          logistics: "#5B21B6",
        },
        // Format export badges — fixed colours per format.
        format: {
          pdf: "#B42318",
          docx: "#1E40AF",
          html: "#0A0A0A",
          csv: "#047857",
          gforms: "#5B21B6",
          web: "#FFD400",
        },
      },
      fontFamily: {
        // Manrope is the locked brand typeface for Kapture Forms — used for
        // both display and body. JetBrains Mono for numbers and tags.
        display: ["var(--font-sans)", "Manrope", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Manrope", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
        serif: ["var(--font-sans)", "Manrope", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "hero-xl": ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "hero-lg": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
        section: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      borderRadius: {
        kapture: "10px",
      },
      boxShadow: {
        "kapture-soft": "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)",
        "kapture-yellow": "0 18px 40px -20px rgba(255,212,0,0.45)",
        "kapture-card": "0 12px 24px -16px rgba(0,0,0,0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
