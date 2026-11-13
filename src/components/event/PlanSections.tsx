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
import { MenuDeadlinePicker } from "@/components/event/plan/MenuDeadlinePicker";
import { PlanEditButton, type PlanEditTarget, type SeatableGuest } from "@/components/event/plan/PlanEditor";
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

/** What the organizer's table dialog needs: everyone on the list, by table. */
export function seatableGuests(event: MyEvent): SeatableGuest[] {
  return event.guests.map((guest) => ({
    id: guest.id,
    name: guest.guest_name?.trim() || guest.guest_phone || "Invitat",
    confirmed: guest.rsvp_status === "confirmed",
    tableId: guest.table_id,
  }));
}

/** The "add" target for a section, for the organizer's header button and empty state. */
export function addTarget(key: string, details: Details, event: MyEvent): PlanEditTarget {
  switch (key) {
    case "schedule":
      return { kind: "schedule" };
    case "location":
      return {
        kind: "venue",
        venue: details.venue,
        fallbackAddress: event.location ?? "",
        hasSaved: details.venue.name.trim().length > 0 || details.venue.address.trim().length > 0,
      };
    case "menu":
      return { kind: "menu" };
    case "seating":
      return {
        kind: "table",
        guests: seatableGuests(event),
        tables: details.seatingTables.map((table) => ({ id: table.id, name: table.name })),
      };
    case "lodging":
      return { kind: "lodging" };
    default:
      return { kind: "vendor" };
  }
}

/** Each section's body inside its Plan card. `editId` (the event id) turns on the organizer's edit pencils. */
const row = "flex items-center gap-3 border-t border-surface-border py-3 first:border-t-0 first:pt-0 last:pb-0";

export function ScheduleSection({ details, editId }: { details: Details; editId?: string }) {
  return (
    <ol className="flex flex-col">
      {details.schedule.map((item) => (
        <li key={item.id} className={row}>
          <span className="w-14 shrink-0 font-theme text-xl leading-7 text-accent-text tabular-nums">{item.time || "—"}</span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold">{item.title}</span>
            {item.location.length > 0 ? <span className="truncate text-[13px] text-muted">{item.location}</span> : null}
          </span>
          {editId !== undefined ? <PlanEditButton eventId={editId} variant="edit" target={{ kind: "schedule", item }} /> : null}
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
    notes: details.venue.notes,
  };
}

export function LocationSection({ details, eventLocation }: { details: Details; eventLocation: string | null }) {
  const { name, address, notes } = venueOf(details, eventLocation);
  const query = encodeURIComponent([name, address].filter((part) => part.trim().length > 0).join(", "));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          {name.trim().length > 0 ? <span className="font-semibold">{name}</span> : null}
          {address.trim().length > 0 ? <span className="text-sm text-muted">{address}</span> : null}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent-tint px-3.5 text-sm font-semibold text-accent-text"
        >
          <MapPin size={14} aria-hidden="true" />
          Hartă
        </a>
      </div>
      {notes.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {notes.map((note) => (
            <li key={note} className="flex gap-2 text-sm text-muted">
              <span className="text-accent-text" aria-hidden="true">•</span>
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function MenuSection({ details, event, editId }: { details: Details; event: MyEvent; editId?: string }) {
  const owner = event.isOwner;
  // Organizer: who picked what, among confirmed guests (the app's summary).
  const confirmed = owner ? event.guests.filter((guest) => guest.rsvp_status === "confirmed") : [];
  const optionIds = new Set(details.menuOptions.map((option) => option.id));
  const notChosen = confirmed.filter((guest) => !guest.menu_option_id || !optionIds.has(guest.menu_option_id));
  return (
    <div className="flex flex-col gap-4">
      {owner && confirmed.length > 0 ? (
        <p className="text-sm text-muted" title={notChosen.map((guest) => guest.guest_name?.trim() || "Invitat").join(", ")}>
          <span className="font-semibold text-ink">
            {confirmed.length - notChosen.length}/{confirmed.length}
          </span>{" "}
          invitați au ales meniul
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {details.menuOptions.map((option) => {
          const mine = !owner && event.myGuest?.menu_option_id === option.id;
          const picks = owner ? confirmed.filter((guest) => guest.menu_option_id === option.id).length : 0;
          return (
            <div
              key={option.id}
              className={`flex flex-col gap-3 rounded-2xl p-4 ${mine ? "border-2 border-accent bg-accent-tint" : "bg-surface-2"}`}
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 truncate font-theme text-xl leading-7">{option.name}</h3>
                {mine ? <span className="shrink-0 text-xs font-semibold text-accent-text">Alegerea ta</span> : null}
                {owner && picks > 0 ? <span className="shrink-0 text-xs text-muted">{picks} au ales</span> : null}
                {editId !== undefined ? <PlanEditButton eventId={editId} variant="edit" target={{ kind: "menu", item: option }} /> : null}
              </div>
              {option.courses.map((course, index) => (
                <div key={index} className="flex items-center gap-3">
                  {course.photoUrl !== null ? (
                    // Signed Storage URL, expires; next/image would need remotePatterns for it.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.photoUrl} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
                  ) : null}
                  <span className="flex min-w-0 flex-col">
                    <span className="text-xs text-muted">{course.name}</span>
                    <span className="text-[15px] leading-5">{course.dish}</span>
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {editId !== undefined && details.menuOptions.length > 0 ? (
        <MenuDeadlinePicker eventId={editId} eventDate={event.date} days={details.menuDeadlineDays} />
      ) : null}
      {!owner && event.myGuest !== null ? (
        <DietaryPills eventId={event.id} selected={event.myGuest.dietary_preferences} />
      ) : null}
    </div>
  );
}

export function SeatingSection({
  details,
  event,
  companions,
  editId,
}: {
  details: Details;
  event: MyEvent;
  companions: string[];
  editId?: string;
}) {
  const owner = event.isOwner;
  const guests = editId !== undefined ? seatableGuests(event) : [];
  const tables = details.seatingTables.map((table) => ({ id: table.id, name: table.name }));
  const myTableId = owner ? null : (event.myGuest?.table_id ?? null);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {details.seatingTables.map((table) => {
        const mine = table.id === myTableId;
        const seated = owner ? event.guests.filter((guest) => guest.table_id === table.id) : [];
        return (
          <div
            key={table.id}
            className={`flex flex-col gap-1 rounded-2xl p-4 ${mine ? "border-2 border-accent bg-accent-tint" : "bg-surface-2"}`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-semibold">{table.name}</span>
              <span className="shrink-0 text-xs text-muted tabular-nums">
                {owner ? `${seated.length}/${table.seatCount}` : `${table.seatCount} ${pluralRo(table.seatCount, "loc", "locuri", "de locuri")}`}
              </span>
              {editId !== undefined ? (
                <PlanEditButton eventId={editId} variant="edit" target={{ kind: "table", item: table, guests, tables }} />
              ) : null}
            </div>
            {table.label.length > 0 ? <span className="text-[13px] text-muted">{table.label}</span> : null}
            {seated.length > 0 ? (
              <span className="text-[13px] leading-[18px]">{seated.map((guest) => guest.guest_name?.trim() || "Invitat").join(", ")}</span>
            ) : null}
            {mine ? (
              <span className="text-[13px] font-semibold text-accent-text">
                Ești aici{companions.length > 0 ? ` · cu ${companions.join(", ")}` : ""}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function LodgingSection({ details, editId }: { details: Details; editId?: string }) {
  return (
    <div className="flex flex-col">
      {details.accommodations.map((item) => (
        <div key={item.id} className={row}>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-semibold">{item.name}</span>
            {item.detailLine.length > 0 || item.priceLine.length > 0 ? (
              <span className="text-[13px] text-muted">
                {[item.detailLine, item.priceLine].filter((part) => part.length > 0).join(" · ")}
              </span>
            ) : null}
          </span>
          {item.location.length > 0 ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-text"
              aria-label={`${item.name} pe hartă`}
              title={item.location}
            >
              <MapPin size={15} aria-hidden="true" />
            </a>
          ) : null}
          {editId !== undefined ? <PlanEditButton eventId={editId} variant="edit" target={{ kind: "lodging", item }} /> : null}
        </div>
      ))}
    </div>
  );
}

export function VendorsSection({ details, editId }: { details: Details; editId?: string }) {
  return (
    <div className="flex flex-col">
      {details.vendors.map((vendor) => {
        const Icon = vendorIcon(vendor.category);
        return (
          <div key={vendor.id} className={row}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-muted" aria-hidden="true">
              <Icon size={16} strokeWidth={1.8} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold">{vendor.name}</span>
              {vendor.category.length > 0 || vendor.handle.length > 0 ? (
                <span className="truncate text-[13px] text-muted">
                  {[vendor.category, vendor.handle].filter((part) => part.length > 0).join(" · ")}
                </span>
              ) : null}
            </span>
            {vendor.externalUrl.length > 0 ? (
              <a
                href={vendor.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-text"
                aria-label={`Vezi ${vendor.name}`}
              >
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : null}
            {editId !== undefined ? <PlanEditButton eventId={editId} variant="edit" target={{ kind: "vendor", item: vendor }} /> : null}
          </div>
        );
      })}
    </div>
  );
}
