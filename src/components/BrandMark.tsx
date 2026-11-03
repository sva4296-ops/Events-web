/** The "story thread with a heart", same geometry as the app's utils/brandMark.ts.
 * Drawn in the theme's accent, like the app's BrandMark; `className` can recolor it via text-*. */
export function BrandMark({ className, color = "text-accent" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 20 100 68" className={`${color} ${className ?? ""}`} aria-hidden="true">
      <path
        d="M8 66C22 66 38 72 50 82C26 64 20 40 32 30C40 23 50 28 50 38C50 28 60 23 68 30C80 40 74 64 50 82C62 72 78 66 92 66"
        fill="none"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="66" r="6" fill="currentColor" />
      <circle cx="92" cy="66" r="6" fill="currentColor" />
    </svg>
  );
}

/** `compact`: only the mark on phones, for a nav that also has to fit a long button. `onCover`: all white. */
export function BrandHeader({ compact = false, onCover = false }: { compact?: boolean; onCover?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <BrandMark className="h-[29px] w-[43px]" color={onCover ? "text-white" : undefined} />
      <span className={`font-display text-[19px] font-semibold ${onCover ? "text-white" : "text-ink"} ${compact ? "max-sm:sr-only" : ""}`}>
        Povestea<span className={onCover ? undefined : "text-accent"}>Noastra</span>
      </span>
    </div>
  );
}
