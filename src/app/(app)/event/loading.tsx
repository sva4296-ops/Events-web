import { Skeleton } from "@/components/ui/Skeleton";

/** Shown instantly when opening an event from the list, before its layout resolves. */
export default function EventLoading() {
  return (
    <div className="flex flex-col gap-8" role="status" aria-label="Se încarcă evenimentul">
      <Skeleton className="full-bleed -mt-8 h-[340px] rounded-none md:h-[440px] lg:-mt-12" />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
