/** Landing-only class strings; buttons and cards reuse components/ui/styles. */
export const lp = {
  wrap: "mx-auto w-full max-w-6xl px-4 sm:px-7",
  section: "scroll-mt-20 py-16 sm:py-[74px]",
  eyebrow: "mb-3.5 text-[13px] leading-[18px] font-semibold uppercase tracking-[1px] text-accent-text",
  title: "font-display text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-tight",
  lead: "mt-3.5 max-w-2xl text-lg text-muted",
  gradText: "text-accent-text not-italic",
  /** Teracotă in both modes: white text sits on it, and the phone mockups stay light. */
  gradBg: "bg-[#A54E36]",
  darkCard: "bg-[#2A211C] text-white ring-1 ring-white/10",
  card: "rounded-3xl border border-surface-border bg-surface shadow-card",
  /** Faded in by <RevealObserver /> once scrolled into view. */
  reveal: "opacity-0 transition-all duration-500 data-[in]:opacity-100 motion-reduce:opacity-100",
  hoverLift: "hover:-translate-y-0.5",
} as const;
