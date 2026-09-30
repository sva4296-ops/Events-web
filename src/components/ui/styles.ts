/** Shared Tailwind class strings, so buttons/cards look the same everywhere (Warm Story 2.0). */
export const ui = {
  card: "rounded-3xl border border-surface-border bg-surface shadow-card",
  cardPadded: "rounded-3xl border border-surface-border bg-surface p-5 shadow-card sm:p-6",
  buttonPrimary:
    "inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-accent-fill px-6 text-base font-semibold text-on-accent shadow-[0_8px_20px_rgba(106,97,209,0.28)] transition hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:bg-surface-2 disabled:text-faint disabled:shadow-none dark:shadow-none",
  buttonSecondary:
    "inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border-[1.5px] border-surface-border bg-surface px-6 text-base font-semibold text-ink transition hover:bg-surface-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  buttonSoft:
    "inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-declined-soft px-6 text-base font-semibold text-declined transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  buttonGold:
    "inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-accent-tint px-6 text-base font-semibold text-accent-text transition hover:brightness-105 active:scale-[0.98]",
  input:
    "w-full min-w-0 min-h-[54px] rounded-2xl border-[1.5px] border-surface-border bg-surface px-4 text-base text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent-tint",
  label: "text-[13px] font-semibold text-muted",
  eyebrow: "text-[13px] font-bold uppercase tracking-[0.08em] text-accent-text",
} as const;
