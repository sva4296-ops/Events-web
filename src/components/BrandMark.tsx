import { useId } from "react";

/** The Warm Story 2.0 "story thread" mark — same geometry as the app's utils/brandMark.ts. */
export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 60 36" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5C36B" />
          <stop offset="0.5" stopColor="#E8779E" />
          <stop offset="1" stopColor="#7F77DD" />
        </linearGradient>
      </defs>
      <path d="M5 28C15 28 17 8 29 8S43 30 55 12" fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinecap="round" />
      <circle cx="5" cy="28" r="3.6" fill="#F5C36B" />
      <circle cx="55" cy="12" r="3.6" fill="#7F77DD" />
    </svg>
  );
}

export function BrandHeader() {
  return (
    <div className="flex items-center gap-2">
      <BrandMark className="h-[26px] w-[43px]" />
      <span className="font-display text-xl font-semibold text-ink">PovesteaNoastra</span>
    </div>
  );
}
