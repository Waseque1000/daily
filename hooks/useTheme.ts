"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useSync } from "@/hooks/useSync";

export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setThemeStore = useAppStore((s) => s.setTheme);
  const { syncPreferences } = useSync();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (t: "light" | "dark") => {
    setThemeStore(t);
    syncPreferences({ theme: t });
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggleTheme };
}
