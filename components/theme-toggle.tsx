"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-8 place-items-center rounded border border-transparent text-fg-subtle transition-colors hover:border-line hover:text-accent"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && !isDark ? (
        <Sun className="size-4" strokeWidth={1.75} />
      ) : (
        <Moon className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
