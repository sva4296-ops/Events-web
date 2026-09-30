/** Landing-only class strings; buttons and cards reuse components/ui/styles. */
export const lp = {
  wrap: "mx-auto w-full max-w-6xl px-4 sm:px-7",
  section: "scroll-mt-20 py-16 sm:py-[74px]",
  eyebrow: "mb-3.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-text",
  title: "font-display text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-tight",
  lead: "mt-3.5 max-w-2xl text-lg text-muted",
  gradText: "bg-linear-to-r from-gold via-pink to-accent bg-clip-text text-transparent",
  gradBg: "bg-linear-to-br from-gold via-pink to-accent",
  darkCard: "bg-[#1E1A30] text-white ring-1 ring-white/10",
  card: "rounded-2xl border border-surface-border bg-surface",
  /** Faded in by <RevealObserver /> once scrolled into view. */
  reveal: "opacity-0 transition-all duration-500 data-[in]:opacity-100 motion-reduce:opacity-100",
  hoverLift: "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5",
} as const;
