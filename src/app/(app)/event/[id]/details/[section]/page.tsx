import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DietaryPills } from "@/components/event/DietaryPills";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getDetails, getTableCompanions } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { isLocked, isSectionKey, SECTIONS } from "@/lib/details";
import { pluralRo } from "@/lib/format";

function vendorIcon(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("foto") || c.includes("video")) return "📷";
  if (c.includes("muz") || c.includes("dj")) return "🎵";
  if (c.includes("catering") || c.includes("mânc") || c.includes("manc")) return "🍽️";
  if (c.includes("flor")) return "💐";
  if (c.includes("tort") || c.includes("cofet")) return "🎂";
  if (c.includes("transport") || c.includes("mașin") || c.includes("masin")) return "🚗";
  if (c.includes("decor")) return "🎈";
  return "🏷️";
}

const EMPTY_GUEST: Record<string, string> = {
  schedule: "Programul nu a fost publicat încă.",
  location: "Locația nu a fost publicată încă.",
  menu: "Meniul nu a fost publicat încă.",
  seating: "Așezarea la mese nu a fost publicată încă.",
  lodging: "Opțiunile de cazare nu au fost publicate încă.",
  vendors: "Niciun furnizor publicat încă.",
};

export default async function DetaliiSectionPage({ params }: PageProps<"/event/[id]/details/[section]">) {
  const { id, section } = await params;
  if (!isSectionKey(section)) notFound();

  const [{ event, capabilities }, details] = await Promise.all([getEventContext(id), getDetails(id)]);
  if (isLocked(section, capabilities)) redirect(`/event/${id}/details`);
  const meta = SECTIONS[section];
  const owner = event.isOwner;
  const empty = (
    <EmptyState
      message={owner ? "Nu ai adăugat încă nimic aici. Editarea se face deocamdată din aplicație." : EMPTY_GUEST[section]}
    />
  );

  let body: ReactNode = null;

  switch (section) {
    case "schedule":
      body =
        details.schedule.length === 0 ? (
          empty
        ) : (
          <ol className={`${ui.cardPadded} flex flex-col`}>
            {details.schedule.map((item, index) => (
              <li key={item.id} className="relative flex gap-5 pb-6 last:pb-0">
                {index < details.schedule.length - 1 ? (
                  <span className="absolute left-[3.35rem] top-8 h-[calc(100%-1.5rem)] w-px bg-surface-border" aria-hidden="true" />
                ) : null}
                <span className="w-12 shrink-0 pt-0.5 text-right font-display text-lg font-bold text-accent">
                  {item.time}
                </span>
                <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-accent ring-4 ring-accent-soft" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="font-semibold">{item.title}</span>
                  {item.location.length > 0 ? <span className="text-sm text-muted">{item.location}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        );
      break;

    case "location": {
      const { name, address, notes } = details.venue;
      const has = name.trim().length > 0 || address.trim().length > 0;
      const query = encodeURIComponent([name, address].filter((part) => part.trim().length > 0).join(", "));
      body = !has ? (
        empty
      ) : (
        <div className={`${ui.cardPadded} flex flex-col gap-5`}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <MapPin size={20} aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              {name.trim().length > 0 ? <span className="text-lg font-bold">{name}</span> : null}
              {address.trim().length > 0 ? <span className="text-muted">{address}</span> : null}
            </div>
          </div>
          {notes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <li key={note} className="flex gap-2 text-sm">
                  <span className="text-accent" aria-hidden="true">•</span>
                  {note}
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ui.buttonPrimary} self-start`}
          >
            Deschide în hartă
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      );
      break;
    }

    case "menu":
      body =
        details.menu === null ? (
          empty
        ) : (
          <div className="flex flex-col gap-5">
            <div className={`${ui.cardPadded} grid gap-5 sm:grid-cols-3`}>
              {(
                [
                  ["Antreu", details.menu.starter],
                  ["Fel principal", details.menu.main],
                  ["Desert", details.menu.dessert],
                ] as const
              ).map(([course, dish]) => (
                <div key={course} className="flex flex-col gap-1">
                  <span className={ui.eyebrow}>{course}</span>
                  <span className="font-display text-lg">{dish.trim().length > 0 ? dish : "—"}</span>
                </div>
              ))}
            </div>
            {!owner && event.myGuest !== null ? (
              <div className={ui.cardPadded}>
                <DietaryPills eventId={id} selected={event.myGuest.dietary_preferences} />
              </div>
            ) : null}
          </div>
        );
      break;

    case "seating": {
      if (details.seatingTables.length === 0) {
        body = empty;
        break;
      }
      const myTableId = owner ? null : (event.myGuest?.table_id ?? null);
      const companions = myTableId !== null ? await getTableCompanions(id) : [];
      body = (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.seatingTables.map((table) => {
            const mine = table.id === myTableId;
            const assigned = owner ? event.guests.filter((guest) => guest.table_id === table.id).length : 0;
            return (
              <div
                key={table.id}
                className={`flex flex-col gap-1 rounded-3xl border p-5 shadow-lg shadow-black/5 ${
                  mine ? "border-2 border-accent bg-accent-soft" : "border-surface-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-lg font-bold">{table.name}</span>
                  {mine ? (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                      Ești aici
                    </span>
                  ) : null}
                </div>
                {table.label.length > 0 ? <span className="text-sm text-muted">{table.label}</span> : null}
                <span className="text-sm text-muted">
                  {table.seatCount} {pluralRo(table.seatCount, "loc", "locuri", "de locuri")}
                </span>
                {owner && assigned > 0 ? (
                  <span className="text-sm font-semibold text-accent">
                    {assigned} / {table.seatCount} locuri ocupate
                  </span>
                ) : null}
                {mine && companions.length > 0 ? (
                  <span className="mt-2 text-sm">Alături de tine: {companions.join(", ")}</span>
                ) : null}
              </div>
            );
          })}
        </div>
      );
      break;
    }

    case "lodging":
      body =
        details.accommodations.length === 0 ? (
          empty
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {details.accommodations.map((item) => (
              <div key={item.id} className={`${ui.cardPadded} flex flex-col gap-1`}>
                <span className="text-lg font-bold">{item.name}</span>
                {item.detailLine.length > 0 ? <span className="text-muted">{item.detailLine}</span> : null}
                {item.priceLine.length > 0 ? (
                  <span className="mt-1 font-semibold text-accent">{item.priceLine}</span>
                ) : null}
              </div>
            ))}
          </div>
        );
      break;

    case "vendors":
      body =
        details.vendors.length === 0 ? (
          empty
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.vendors.map((vendor) => (
                <div key={vendor.id} className={`${ui.cardPadded} flex items-center gap-4`}>
                  <span className="text-3xl" aria-hidden="true">
                    {vendorIcon(vendor.category)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-bold">{vendor.name}</span>
                    <span className="truncate text-sm text-muted">
                      {[vendor.category, vendor.handle].filter((part) => part.length > 0).join(" · ")}
                    </span>
                  </span>
                  {vendor.externalUrl.length > 0 ? (
                    <a
                      href={vendor.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent"
                    >
                      Vezi
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="text-center text-sm italic text-muted">
              Furnizorii tag-uiți își promovează serviciile — fiecare aduce clienți noi pe platformă.
            </p>
          </div>
        );
      break;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <Link
          href={`/event/${id}/details`}
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface transition hover:text-accent"
          aria-label="Înapoi la detalii"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{meta.title}</h2>
          {meta.description !== undefined ? <p className="text-muted">{meta.description}</p> : null}
        </div>
      </div>
      {body}
    </div>
  );
}
