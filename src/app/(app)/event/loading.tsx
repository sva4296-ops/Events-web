import { Skeleton } from "@/components/ui/Skeleton";

/** Shown instantly when opening an event from the list, before its layout resolves. */
export default function EventLoading() {
  return (
    <div className="flex flex-col gap-8" role="status" aria-label="Se încarcă evenimentul">
      <Skeleton className="h-8 w-48" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-8 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-sm" />
        </div>
      </div>
      <Skeleton className="hidden h-14 rounded-full md:block" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 sm:col-span-2" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
