import { useId } from "react";

/** The Warm Story 2.0 "story thread with a heart" mark — same geometry as the app's utils/brandMark.ts. */
export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 20 100 68" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5C36B" />
          <stop offset="0.5" stopColor="#E8779E" />
          <stop offset="1" stopColor="#7F77DD" />
        </linearGradient>
      </defs>
      <path
        d="M8 66C22 66 38 72 50 82C26 64 20 40 32 30C40 23 50 28 50 38C50 28 60 23 68 30C80 40 74 64 50 82C62 72 78 66 92 66"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="66" r="6" fill="#F5C36B" />
      <circle cx="92" cy="66" r="6" fill="#7F77DD" />
    </svg>
  );
}

export function BrandHeader() {
  return (
    <div className="flex items-center gap-2">
      <BrandMark className="h-[29px] w-[43px]" />
      <span className="font-display text-xl font-semibold text-ink">PovesteaNoastra</span>
    </div>
  );
}
