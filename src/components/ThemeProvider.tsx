"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theme provider for Kapture Forms.
 *
 * - Class-based (so Tailwind's `dark:` modifier works)
 * - Default: dark (matches kapture · logistics)
 * - Persisted in localStorage by next-themes
 * - Disables system-pref override so the explicit toggle wins
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemes>
  );
}
