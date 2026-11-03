/** Shared Tailwind class strings, so buttons/cards look the same everywhere (the app's Button, Field, Card). */
const button =
  "inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full px-[22px] text-base font-semibold transition active:scale-[0.98] disabled:pointer-events-none";

export const ui = {
  card: "rounded-3xl border border-surface-border bg-surface shadow-card",
  cardPadded: "rounded-3xl border border-surface-border bg-surface p-5 shadow-card sm:p-6",
  buttonPrimary: `${button} bg-accent-fill text-on-accent shadow-accent hover:brightness-105 disabled:bg-surface-2 disabled:text-faint disabled:shadow-none`,
  buttonSecondary: `${button} border-[1.5px] border-surface-border bg-surface text-ink hover:bg-surface-2 disabled:bg-surface-2 disabled:text-faint`,
  /** The app's "neutral" variant: a recorded-but-neutral outcome, not red. */
  buttonSoft: `${button} bg-surface-2 text-muted hover:brightness-95 disabled:text-faint`,
  /** The app's "tonal" variant. */
  buttonGold: `${button} bg-accent-tint text-accent-text hover:brightness-95 disabled:bg-surface-2 disabled:text-faint`,
  /** The app's "danger" variant. */
  buttonDanger: `${button} min-h-12 bg-danger-soft text-[15px] text-danger hover:brightness-95 disabled:bg-surface-2 disabled:text-faint`,
  input:
    "w-full min-w-0 min-h-[54px] rounded-2xl border-[1.5px] border-surface-border bg-surface px-4 text-base text-ink outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent-tint",
  label: "text-[13px] leading-[18px] font-semibold text-muted",
  /** typography.overline */
  eyebrow: "text-[13px] leading-[18px] font-semibold uppercase tracking-[1px] text-muted",
  /** typography.title1 / title2 / subtitle */
  title1: "font-display text-2xl leading-[30px] font-semibold tracking-[-0.2px]",
  title2: "font-display text-[19px] leading-[25px] font-semibold tracking-[-0.1px]",
  subtitle: "text-[17px] leading-6 font-semibold",
  /** typography.quote */
  quote: "text-[17px] leading-[25px]",
} as const;
