"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Kapture Forms theme context.
 *
 * Behaviour by request:
 *   - Every page load / refresh / new tab starts in LIGHT mode.
 *   - The user can toggle to dark. The choice is ephemeral — it lives in
 *     React state only, never localStorage. The moment the page reloads
 *     we're back to light.
 *   - The `dark` class is applied/removed on `<html>` so Tailwind's
 *     `dark:` modifier works.
 */

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Apply class to <html> whenever theme changes.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState((cur) => (cur === "dark" ? "light" : "dark"));
  }, []);

  return <Ctx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  return useContext(Ctx);
}
