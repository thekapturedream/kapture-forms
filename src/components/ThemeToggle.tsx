"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Sun / moon theme toggle with a satisfying cross-rotate animation.
 * Sun is visible in light mode (click → go dark). Moon is visible in
 * dark mode (click → go light). The press is rewarded with a brief
 * scale-down + 180° spin.
 */
export function ThemeToggle({ size = 36 }: { size?: number }) {
  const { theme, toggleTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);

  function handleClick() {
    setSpinning(true);
    toggleTheme();
    window.setTimeout(() => setSpinning(false), 450);
  }

  const isDark = theme === "dark";
  const iconSize = Math.round(size * 0.5);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex items-center justify-center rounded-full border border-kapture-fog dark:border-white/15 bg-white dark:bg-white/[0.06] hover:border-kapture-black dark:hover:border-white/40 active:scale-90 transition-all duration-300 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          spinning ? "rotate-180" : "rotate-0"
        }`}
      >
        {/* Sun — visible in light */}
        <Sun
          size={iconSize}
          strokeWidth={2}
          className={`absolute text-kapture-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? "opacity-0 -rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        {/* Moon — visible in dark */}
        <Moon
          size={iconSize}
          strokeWidth={2}
          className={`absolute text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          }`}
        />
      </span>
    </button>
  );
}
