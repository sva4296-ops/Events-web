import { Skeleton } from "@/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <div className="flex flex-col gap-10" role="status" aria-label="Se încarcă evenimentele">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-3/4 max-w-xl" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {[0, 1].map((column) => (
          <div key={column} className="flex flex-col gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
