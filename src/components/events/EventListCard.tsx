import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getEventTypeMeta } from "@/lib/eventTypes";
import { formatEventDate } from "@/lib/format";
import type { MyEvent, RsvpStatus } from "@/lib/types";

const STATUS: Record<RsvpStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmat", className: "bg-confirmed-soft text-confirmed" },
  pending: { label: "În așteptare", className: "bg-gold/20 text-[#B7862A] dark:text-gold" },
  declined: { label: "Refuzat", className: "bg-declined-soft text-declined" },
};

export function EventListCard({ event, href }: { event: MyEvent; href: string }) {
  const type = getEventTypeMeta(event.type);
  const date = formatEventDate(event.date) ?? "Data va fi anunțată";
  const status = event.myGuest?.rsvp_status;

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-surface-border bg-surface p-4 shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:shadow-xl sm:p-5"
    >
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
        style={{ background: `linear-gradient(135deg, ${type.light[0]}, ${type.light[1]})` }}
        aria-hidden="true"
      >
        {type.emoji}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-lg font-bold">{event.name}</span>
        <span className="truncate text-sm text-muted first-letter:uppercase">
          {date}
          {event.location !== null ? ` · ${event.location}` : ""}
        </span>
      </span>
      {status !== undefined ? (
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS[status].className}`}>
          {STATUS[status].label}
        </span>
      ) : null}
      <ChevronRight size={20} className="shrink-0 text-muted transition group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
