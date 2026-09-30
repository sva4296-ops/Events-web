import { useId } from "react";

/** Same curve and gold → pink → purple stops as the app's utils/brandMark.ts. */
export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 184 136" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#F5C36B" />
          <stop offset="0.5" stopColor="#E8779E" />
          <stop offset="1" stopColor="#7F77DD" />
        </linearGradient>
      </defs>
      <path
        d="M 16 112 C 70 112, 60 24, 168 24"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandHeader() {
  return (
    <div className="flex items-center gap-2">
      <BrandMark className="h-6 w-8" />
      <span className="font-display text-xl font-bold text-ink">
        Povestea<span className="text-accent-text">Noastra</span>
      </span>
    </div>
  );
}
