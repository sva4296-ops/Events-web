import {
  Cake,
  Camera,
  Car,
  ExternalLink,
  Flower,
  MapPin,
  Music,
  Sparkles,
  Tag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { DietaryPills } from "@/components/event/DietaryPills";
import { ui } from "@/components/ui/styles";
import type { Details } from "@/lib/data/content";
import { pluralRo } from "@/lib/format";
import type { MyEvent } from "@/lib/types";

function vendorIcon(category: string): LucideIcon {
  const c = category.toLowerCase();
  if (c.includes("foto") || c.includes("video")) return Camera;
  if (c.includes("muz") || c.includes("dj")) return Music;
  if (c.includes("catering") || c.includes("mânc") || c.includes("manc")) return UtensilsCrossed;
  if (c.includes("flor")) return Flower;
  if (c.includes("tort") || c.includes("cofet")) return Cake;
  if (c.includes("transport") || c.includes("mașin") || c.includes("masin")) return Car;
  if (c.includes("decor")) return Sparkles;
  return Tag;
}

/** Each section of the Plan tab. Drawn on the wide Plan page and on the phone's per-section pages. */
export function ScheduleSection({ details }: { details: Details }) {
  return (
    <ol className="flex flex-col">
      {details.schedule.map((item) => (
        <li key={item.id} className="flex items-baseline gap-5 border-t border-surface-border py-4 md:gap-7">
          <span className="w-[72px] shrink-0 font-theme text-2xl text-accent-text md:w-[92px] md:text-[30px] md:leading-9">{item.time}</span>
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold">{item.title}</span>
            {item.location.length > 0 ? <span className="text-sm text-muted">{item.location}</span> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The venue to show: no venue set yet falls back to the location typed when the event was created. */
function venueOf(details: Details, eventLocation: string | null) {
  const fromEvent = details.venue.name.trim().length === 0 && details.venue.address.trim().length === 0;
  return {
    name: fromEvent ? (eventLocation ?? "") : details.venue.name,
    address: fromEvent ? "" : details.venue.address,
    fromEvent,
    notes: details.venue.notes,
  };
}

export function LocationSection({ details, eventLocation }: { details: Details; eventLocation: string | null }) {
  const { name, address, fromEvent, notes } = venueOf(details, eventLocation);
  const query = encodeURIComponent([name, address].filter((part) => part.trim().length > 0).join(", "));
  return (
    <div className={`${ui.cardPadded} flex flex-col gap-4`}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent-tint text-accent-text">
          <MapPin size={20} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col">
          {name.trim().length > 0 ? <span className="font-theme text-2xl leading-[30px]">{name}</span> : null}
          {address.trim().length > 0 ? <span className="text-[15px] text-muted">{address}</span> : null}
          {fromEvent ? <span className="text-sm text-muted">Din detaliile evenimentului</span> : null}
        </div>
      </div>
      {notes.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {notes.map((note) => (
            <li key={note} className="flex gap-2 text-sm">
              <span className="text-accent-text" aria-hidden="true">•</span>
              {note}
            </li>
          ))}
        </ul>
      ) : null}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ui.buttonPrimary} min-h-12`}
      >
        Deschide în hartă
        <ExternalLink size={16} aria-hidden="true" />
      </a>
    </div>
  );
}

export function MenuSection({ details, event }: { details: Details; event: MyEvent }) {
  const owner = event.isOwner;
  return (
    <div className="flex flex-col gap-5">
      {!owner ? <p className="text-sm text-muted">Alegerea meniului se face din aplicația PovesteaNoastra.</p> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        {details.menuOptions.map((option) => {
          const mine = !owner && event.myGuest?.menu_option_id === option.id;
          return (
            <div key={option.id} className={`${ui.cardPadded} flex flex-col gap-4 ${mine ? "border-2 border-accent" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-theme text-[22px] leading-7">{option.name}</h3>
                {mine ? (
                  <span className="shrink-0 rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-semibold text-accent-text">Alegerea ta</span>
                ) : null}
              </div>
              {option.courses.map((course, index) => (
                <div key={index} className="flex flex-col">
                  {course.photoUrl !== null ? (
                    // Signed Storage URL, expires; next/image would need remotePatterns for it.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.photoUrl} alt={course.dish} className="mb-2 aspect-[16/10] w-full rounded-2xl object-cover" />
                  ) : null}
                  <span className="text-[13px] text-muted">{course.name}</span>
                  <span className="text-[15px]">{course.dish}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {!owner && event.myGuest !== null ? (
        <DietaryPills eventId={event.id} selected={event.myGuest.dietary_preferences} />
      ) : null}
    </div>
  );
}

export function SeatingSection({ details, event, companions }: { details: Details; event: MyEvent; companions: string[] }) {
  const owner = event.isOwner;
  const myTableId = owner ? null : (event.myGuest?.table_id ?? null);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {details.seatingTables.map((table) => {
        const mine = table.id === myTableId;
        const assigned = owner ? event.guests.filter((guest) => guest.table_id === table.id).length : 0;
        return (
          <div
            key={table.id}
            className={`flex flex-col gap-0.5 rounded-3xl p-5 ${mine ? "border-2 border-accent bg-accent-tint" : "border border-surface-border bg-surface"}`}
          >
            <span className="truncate font-theme text-[22px] leading-7">{table.name}</span>
            {table.label.length > 0 ? <span className="text-sm text-muted">{table.label}</span> : null}
            <span className="text-[13px] text-muted">
              {table.seatCount} {pluralRo(table.seatCount, "loc", "locuri", "de locuri")}
              {mine ? " · Ești aici" : ""}
            </span>
            {owner && assigned > 0 ? (
              <span className="text-[13px] font-semibold text-accent-text">
                {assigned} / {table.seatCount} locuri ocupate
              </span>
            ) : null}
            {mine && companions.length > 0 ? <span className="mt-2 text-sm">Alături de tine: {companions.join(", ")}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

export function LodgingSection({ details }: { details: Details }) {
  return (
    <div className="flex flex-col">
      {details.accommodations.map((item) => (
        <div key={item.id} className="flex flex-col border-t border-surface-border py-3">
          <span className="font-semibold">{item.name}</span>
          <span className="text-sm text-muted">
            {[item.detailLine, item.priceLine].filter((part) => part.length > 0).join(" · ")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function VendorsSection({ details }: { details: Details }) {
  return (
    <div className="flex flex-col">
      {details.vendors.map((vendor) => {
        const Icon = vendorIcon(vendor.category);
        return (
          <div key={vendor.id} className="flex items-center gap-3 border-t border-surface-border py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-accent-tint text-accent-text" aria-hidden="true">
              <Icon size={18} strokeWidth={1.8} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold">{vendor.name}</span>
              <span className="truncate text-sm text-muted">
                {[vendor.category, vendor.handle].filter((part) => part.length > 0).join(" · ")}
              </span>
            </span>
            {vendor.externalUrl.length > 0 ? (
              <a
                href={vendor.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-9 shrink-0 items-center rounded-full bg-accent-tint px-3.5 text-sm font-semibold text-accent-text"
              >
                Vezi
              </a>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
