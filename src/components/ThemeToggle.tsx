"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { KaptureSun } from "./Logo";

/**
 * Yellow Kapture-sun disc → flips light/dark theme.
 * The exact UI affordance from kapture · logistics. Hydration-safe.
 */
export function ThemeToggle({ size = 36 }: { size?: number }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${mounted && resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title="Toggle theme"
      className="inline-flex items-center justify-center rounded-full bg-kapture-yellow text-kapture-black hover:bg-kapture-amber active:scale-[0.97] transition shrink-0"
      style={{ width: size, height: size }}
    >
      <KaptureSun size={Math.round(size * 0.55)} />
    </button>
  );
}
