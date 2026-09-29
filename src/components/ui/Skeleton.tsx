/** Pulsing placeholder block — same idea as the app's Skeleton. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/15 ${className}`} aria-hidden="true" />;
}
