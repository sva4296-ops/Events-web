import { Skeleton } from "@/components/ui/Skeleton";

/** Shown instantly when opening the list, same shape as the page below. */
export default function EventsLoading() {
  return (
    <div className="flex flex-col gap-10 pt-16" role="status" aria-label="Se încarcă evenimentele">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-[340px] rounded-4xl lg:h-[400px]" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
