"use client";

import { Moon, Sun } from "lucide-react";

import { toggleTheme } from "@/lib/theme";

/** The round moon/sun button; which icon shows comes from CSS, so it can't mismatch on load. */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Schimbă tema: închis / deschis"
      title="Temă închisă / deschisă"
      className={className ?? "flex size-10 shrink-0 items-center justify-center rounded-full border border-surface-border text-ink transition hover:border-ink"}
    >
      <Moon size={18} className="hidden dark:block" aria-hidden="true" />
      <Sun size={18} className="dark:hidden" aria-hidden="true" />
    </button>
  );
}
