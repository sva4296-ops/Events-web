"use client";

import { Minus, Plus } from "lucide-react";
import { useActionState, useState } from "react";

import { ui } from "@/components/ui/styles";
import type { MyVenueBooking, VenueNight } from "@/lib/venues";

import { bookVenue, cancelVenueBooking, type VenueActionState } from "./venueActions";

const INITIAL: VenueActionState = { error: null };

function peopleLabel(count: number): string {
  if (count === 1) return "1 persoană";
  return count < 20 ? `${count} persoane` : `${count} de persoane`;
}

function freeLabel(count: number): string {
  if (count === 1) return "1 loc liber";
  return count < 20 ? `${count} locuri libere` : `${count} de locuri libere`;
}

/** Booking form for a signed-in visitor, or their ticket once booked. */
export function VenueBookingForm({
  token,
  venue,
  booking,
  following,
}: {
  token: string;
  venue: VenueNight;
  booking: MyVenueBooking | null;
  following: boolean;
}) {
  const mine = booking !== null && booking.status === "confirmed" ? booking : null;
  const [editing, setEditing] = useState(false);
  const firstOpen = venue.zones.find((zone) => zone.capacity - zone.booked > 0) ?? venue.zones[0];
  const [partySize, setPartySize] = useState(mine?.partySize ?? Math.min(2, venue.maxPartySize));
  const [zoneId, setZoneId] = useState(mine?.zoneId ?? firstOpen?.id ?? "");
  const [time, setTime] = useState(mine?.bookingTime ?? venue.bookingTimes[0] ?? "");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(async (previous: VenueActionState, formData: FormData) => {
    const next = await bookVenue(token, venue.eventId, previous, formData);
    if (next.error === null) setEditing(false);
    return next;
  }, INITIAL);

  const free = (zone: VenueNight["zones"][number]) =>
    zone.capacity - zone.booked + (mine !== null && mine.zoneId === zone.id ? (mine.partySize ?? 0) : 0);
  const zone = venue.zones.find((z) => z.id === zoneId) ?? null;
  const fits = zone !== null && free(zone) >= partySize;

  if (mine !== null && !editing) {
    const zoneName = venue.zones.find((z) => z.id === mine.zoneId)?.name;
    return (
      <div className="flex flex-col gap-4">
        <div className={`${ui.card} overflow-hidden`}>
          <div className="bg-[linear-gradient(135deg,#1A1A2E_0%,#5F2B84_55%,#D6336C_100%)] p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-90">Biletul meu</p>
            <p className="font-display text-xl font-bold">{venue.name}</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-5">
            <p className="text-3xl font-extrabold tracking-[0.12em] tabular-nums">{mine.bookingCode ?? "—"}</p>
            <p className="text-sm text-muted">{mine.checkedInAt !== null ? "Ai intrat ✓" : "Arată codul la intrare"}</p>
            <dl className="mt-3 grid w-full grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted">Persoane</dt>
              <dd className="text-right font-semibold">{mine.partySize ?? "—"}</dd>
              {zoneName !== undefined ? (
                <>
                  <dt className="text-muted">Zona</dt>
                  <dd className="text-right font-semibold">{zoneName}</dd>
                </>
              ) : null}
              {mine.bookingTime ? (
                <>
                  <dt className="text-muted">Sosire</dt>
                  <dd className="text-right font-semibold">{mine.bookingTime}</dd>
                </>
              ) : null}
              <dt className="text-muted">Intrare</dt>
              <dd className="text-right font-semibold">{venue.priceInfo ?? "Intrare liberă"}</dd>
            </dl>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className={ui.buttonSecondary} onClick={() => setEditing(true)}>
            Modifică
          </button>
          <button
            type="button"
            className={ui.buttonSoft}
            onClick={async () => {
              if (!window.confirm("Anulezi rezervarea? Locurile tale se eliberează pentru alți clienți.")) return;
              const result = await cancelVenueBooking(token, mine.guestId);
              setCancelError(result.error);
            }}
          >
            Anulează
          </button>
        </div>
        {cancelError !== null ? <p className="text-center text-sm text-declined">{cancelError}</p> : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="partySize" value={partySize} />
      <input type="hidden" name="zoneId" value={zoneId} />
      <input type="hidden" name="time" value={time} />

      <div className={`${ui.cardPadded} flex flex-col gap-3`}>
        <p className="font-bold">Câte persoane?</p>
        <div className="flex items-center justify-between rounded-2xl bg-accent-tint p-1.5">
          <button
            type="button"
            aria-label="Mai puține persoane"
            disabled={partySize <= 1}
            onClick={() => setPartySize((n) => Math.max(1, n - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-accent-text shadow-card disabled:opacity-40"
          >
            <Minus size={20} aria-hidden="true" />
          </button>
          <p className="font-display text-xl font-bold">{peopleLabel(partySize)}</p>
          <button
            type="button"
            aria-label="Mai multe persoane"
            disabled={partySize >= venue.maxPartySize}
            onClick={() => setPartySize((n) => Math.min(venue.maxPartySize, n + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-accent-text shadow-card disabled:opacity-40"
          >
            <Plus size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`${ui.cardPadded} flex flex-col gap-3`}>
        <p className="font-bold">Unde vreți să stați?</p>
        {venue.zones.map((z) => {
          const left = free(z);
          const selected = z.id === zoneId;
          return (
            <button
              key={z.id}
              type="button"
              disabled={left <= 0}
              onClick={() => setZoneId(z.id)}
              aria-pressed={selected}
              className={`flex items-center gap-3 rounded-2xl p-4 text-left transition disabled:opacity-45 ${
                selected ? "border-2 border-accent" : "border border-surface-border"
              }`}
            >
              <span className="flex-1">
                <span className="block font-semibold">{z.name}</span>
                {z.detail ? <span className="block text-[13px] text-muted">{z.detail}</span> : null}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[13px] font-bold ${
                  left <= 0 ? "bg-declined-soft text-declined" : "bg-accent-tint text-accent-text"
                }`}
              >
                {left <= 0 ? "plin" : freeLabel(left)}
              </span>
            </button>
          );
        })}
        {zone !== null && !fits && free(zone) > 0 ? (
          <p className="text-sm text-declined">Mai sunt doar {freeLabel(free(zone))} în zona asta.</p>
        ) : null}
      </div>

      {venue.bookingTimes.length > 0 ? (
        <div className={`${ui.cardPadded} flex flex-col gap-3`}>
          <p className="font-bold">Ora de sosire</p>
          <div className="flex flex-wrap gap-2">
            {venue.bookingTimes.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                aria-pressed={slot === time}
                className={`h-10 min-w-16 rounded-full border-[1.5px] px-4 text-sm font-semibold ${
                  slot === time ? "border-accent-fill bg-accent-fill text-on-accent" : "border-surface-border"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-3xl border border-accent bg-surface p-5 shadow-card">
        <p className="text-sm text-muted">
          {[peopleLabel(partySize), zone?.name, time].filter((part) => part !== undefined && part !== "").join(" · ")}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-bold">Intrare</p>
          <p className="text-right font-display text-xl font-bold text-accent-text">{venue.priceInfo ?? "Intrare liberă"}</p>
        </div>
        {mine === null && venue.agencyId !== null && !following ? (
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="follow" className="mt-0.5 h-5 w-5 accent-accent-fill" />
            <span>Vreau să primesc invitații de la {venue.hostName ?? "acest local"} (pot renunța oricând)</span>
          </label>
        ) : null}
        <button type="submit" className={ui.buttonPrimary} disabled={pending || !fits || (venue.bookingTimes.length > 0 && time === "")}>
          {pending ? "Se rezervă..." : mine !== null ? "Salvează modificarea" : "Rezervă-ți locul"}
        </button>
        {editing ? (
          <button type="button" className="min-h-11 text-sm font-semibold text-accent-text" onClick={() => setEditing(false)}>
            Renunță
          </button>
        ) : null}
        {state.error !== null ? <p className="text-center text-sm text-declined">{state.error}</p> : null}
        <p className="text-center text-xs text-muted">Nu plătești nimic acum. Intrarea se achită la local.</p>
      </div>
    </form>
  );
}
