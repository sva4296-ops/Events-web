"use client";

import { CalendarHeart, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EventCover } from "@/components/EventCover";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { eventDateParts } from "@/lib/format";
import type { EventType, RsvpStatus } from "@/lib/types";

export interface AgendaItem {
  id: string;
  href: string;
  type: EventType;
  name: string;
  date: string | null;
  location: string | null;
  coverTheme: string | null;
  coverPhotoUrl: string | null;
  isOwner: boolean;
  status: RsvpStatus | null;
}

const BADGE = "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold";
const STATUS: Record<RsvpStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmat", className: "bg-confirmed-soft text-confirmed" },
  pending: { label: "În așteptare", className: "bg-pending-soft text-pending" },
  declined: { label: "Refuzat", className: "bg-declined-soft text-declined" },
};
const FILTERS = [
  { id: "all", label: "Toate" },
  { id: "owner", label: "Organizez" },
  { id: "guest", label: "Invitat" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

function AgendaRow({ item }: { item: AgendaItem }) {
  const parts = eventDateParts(item.date);
  return (
    <Link href={item.href} className="group flex items-center gap-3 border-t border-surface-border py-4 sm:gap-5">
      <span className="flex w-11 shrink-0 flex-col items-center sm:w-14">
        <span className="font-theme text-[28px] leading-9 sm:text-[32px]">{parts?.day ?? "–"}</span>
        <span className="text-xs text-muted">{parts?.weekday}</span>
      </span>
      <EventCover
        type={item.type}
        coverTheme={item.coverTheme}
        photoUrl={item.coverPhotoUrl}
        plain
        className="hidden h-[68px] w-[92px] shrink-0 rounded-2xl sm:block"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-theme text-[19px] leading-7 transition group-hover:text-accent-text sm:text-[21px]">
          {item.name}
        </span>
        {item.location !== null ? <span className="truncate text-sm text-muted">{item.location}</span> : null}
      </span>
      {item.status !== null ? (
        <span className={`${BADGE} ${STATUS[item.status].className}`}>{STATUS[item.status].label}</span>
      ) : item.isOwner ? (
        <span className={`${BADGE} bg-accent-tint text-accent-text`}>Organizezi</span>
      ) : null}
    </Link>
  );
}

/** Every coming event in one chronological list, by month; the app's Mine/Invited/All filter on top. */
export function EventAgenda({ items, hasOwned, hasInvitations }: { items: AgendaItem[]; hasOwned: boolean; hasInvitations: boolean }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = items.filter((item) => filter === "all" || item.isOwner === (filter === "owner"));

  const months: { name: string; items: AgendaItem[] }[] = [];
  for (const item of visible) {
    const name = eventDateParts(item.date)?.month ?? "Fără dată";
    const month = months.find((entry) => entry.name === name);
    if (month !== undefined) month.items.push(item);
    else months.push({ name, items: [item] });
  }

  return (
    <section aria-labelledby="agenda-title" className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="agenda-title" className={ui.title1}>
          Agenda ta
        </h2>
        <div role="group" aria-label="Filtrează" className="flex gap-1 rounded-full border border-surface-border bg-surface p-1">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition ${
                filter === id ? "bg-ink text-surface" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {months.map((month) => (
        <div key={month.name} className="flex flex-col">
          <h3 className={`${ui.eyebrow} mb-2`}>{month.name}</h3>
          {month.items.map((item) => (
            <AgendaRow key={item.id} item={item} />
          ))}
        </div>
      ))}

      {visible.length === 0 ? (
        filter === "guest" || (filter === "all" && !hasInvitations && hasOwned) ? (
          <EmptyState icon={Mail} message="Nicio invitație încă. Când cineva te invită, apare aici." />
        ) : (
          <EmptyState
            icon={CalendarHeart}
            message="Nu organizezi încă niciun eveniment. Crearea de evenimente vine în curând pe web; până atunci, o poți face din aplicație."
          />
        )
      ) : null}
    </section>
  );
}
