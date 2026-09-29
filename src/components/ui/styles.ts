/** Shared Tailwind class strings, so buttons/cards look the same everywhere. */
export const ui = {
  card: "rounded-3xl border border-surface-border bg-surface shadow-xl shadow-black/5",
  cardPadded: "rounded-3xl border border-surface-border bg-surface p-5 shadow-xl shadow-black/5 sm:p-6",
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  buttonSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-accent/40 px-6 py-3.5 text-base font-semibold text-accent transition hover:bg-accent-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  buttonSoft:
    "inline-flex items-center justify-center gap-2 rounded-full bg-declined-soft px-6 py-3.5 text-base font-semibold text-declined transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  buttonGold:
    "inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-base font-semibold text-[#2B2740] shadow-lg shadow-gold/25 transition hover:brightness-105 active:scale-[0.98]",
  input:
    "w-full min-w-0 rounded-2xl border border-surface-border bg-surface px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent/15",
  label: "text-sm font-semibold text-ink",
  eyebrow: "text-xs font-semibold uppercase tracking-[0.18em] text-muted",
} as const;
