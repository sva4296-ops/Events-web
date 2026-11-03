import type { CSSProperties } from "react";

import { getCoverTheme } from "@/lib/coverThemes";

const DARK_INK = "#1E1A30";
const WHITE = "#FFFFFF";

function luminance(hex: string): number {
  const lin = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Inside an event, the accent follows its picked cover theme (the app's
 * utils/eventAccent.ts; the mixes live in globals.css under .event-accent).
 * No picked theme: the site's own accent.
 */
export function eventAccentProps(coverTheme: string | null): { className: string; style?: CSSProperties } {
  const theme = getCoverTheme(coverTheme);
  if (theme === null) return { className: "" };
  const fill = theme.accent;
  return {
    className: "event-accent",
    style: {
      "--event-accent": fill,
      "--on-accent": contrast(fill, WHITE) >= contrast(fill, DARK_INK) ? WHITE : DARK_INK,
    } as CSSProperties,
  };
}
