import { Skeleton } from "@/components/ui/Skeleton";

/** Shown instantly while switching tabs; the header and tab bar stay put. */
export default function EventTabLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Se încarcă">
      <Skeleton className="h-40 sm:col-span-2" />
      <Skeleton className="h-40" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  );
}
