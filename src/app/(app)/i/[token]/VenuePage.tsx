import { Clock, MapPin, Store } from "lucide-react";
import Link from "next/link";

import { AppBanner } from "@/components/AppBanner";
import { BrandHeader } from "@/components/BrandMark";
import { ui } from "@/components/ui/styles";
import { getSessionUser } from "@/lib/auth";
import { formatEventDate } from "@/lib/format";
import { getMyVenueBooking, type VenueNight } from "@/lib/venues";

import { VenueBookingForm } from "./VenueBookingForm";

/** "duminică, 22 noiembrie 2026 · 21:00" */
export function venueWhen(venue: VenueNight): string | null {
  const date = formatEventDate(venue.eventDate);
  if (date === null) return venue.startTime;
  return venue.startTime !== null ? `${date} · ${venue.startTime}` : date;
}

/**
 * A venue night's public page (the bar/restaurant's link). Anyone sees the
 * night, its areas with free spots and the programme; booking needs the same
 * phone sign-in as the rest of the site, then comes back here.
 */
export async function VenuePage({ token, venue }: { token: string; venue: VenueNight }) {
  const user = await getSessionUser();
  const mine = user !== null ? await getMyVenueBooking(venue.eventId, token) : { booking: null, following: false };
  const when = venueWhen(venue);
  const capacity = venue.zones.reduce((sum, zone) => sum + zone.capacity, 0);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 md:max-w-2xl lg:max-w-none lg:gap-10">
      <BrandHeader />

      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-10">
        <section className="flex flex-col gap-5 lg:col-span-3">
          <div className="rounded-[26px] bg-[linear-gradient(135deg,#1A1A2E_0%,#5F2B84_55%,#D6336C_100%)] p-6 text-white shadow-card">
            {venue.hostName !== null ? (
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] opacity-90">{venue.hostName} te invită</p>
            ) : null}
            <h1 className="mt-1 font-display text-[32px] font-bold leading-tight">{venue.name}</h1>
            {when !== null ? <p className="mt-1 text-sm opacity-90">{when}</p> : null}
            <span className="mt-4 inline-flex h-7 items-center rounded-full bg-white/90 px-3 text-[13px] font-bold text-[#2B2740]">
              {venue.priceInfo ?? "Intrare liberă"}
            </span>
          </div>

          {venue.welcomeMessage !== null ? <p className="text-[15px] leading-relaxed">{venue.welcomeMessage}</p> : null}

          {venue.bookedPeople > 0 ? (
            <p className={ui.eyebrow}>
              Au rezervat deja {venue.bookedPeople} {venue.bookedPeople === 1 ? "persoană" : "persoane"}
              {capacity > 0 ? ` din ${capacity}` : ""}
            </p>
          ) : null}

          {venue.lineup.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className={ui.eyebrow}>Programul serii</p>
              {venue.lineup.map((item) => (
                <div key={`${item.time}-${item.title}`} className={`${ui.card} flex items-center gap-4 p-4`}>
                  <span className="flex w-14 items-center gap-1 font-bold text-accent-text">
                    <Clock size={14} aria-hidden="true" />
                    {item.time}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                </div>
              ))}
            </div>
          ) : null}

          {venue.hostName !== null || venue.location !== null ? (
            <div className={`${ui.card} flex items-center gap-3 p-4`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-tint text-accent-text">
                <Store size={22} aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">{venue.hostName ?? venue.location}</span>
                {venue.hostName !== null && venue.location !== null ? (
                  <span className="flex items-center gap-1 text-[13px] text-muted">
                    <MapPin size={13} aria-hidden="true" />
                    {venue.location}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-10 lg:col-span-2">
          {user === null ? (
            <div className={`${ui.cardPadded} flex flex-col gap-4`}>
              <p className="font-display text-xl font-bold">Rezervă-ți locul</p>
              <ul className="flex flex-col gap-2 text-sm">
                {venue.zones.map((zone) => {
                  const left = Math.max(0, zone.capacity - zone.booked);
                  return (
                    <li key={zone.id} className="flex items-center justify-between gap-3">
                      <span>
                        <span className="font-semibold">{zone.name}</span>
                        {zone.detail ? <span className="text-muted"> · {zone.detail}</span> : null}
                      </span>
                      <span className={left > 0 ? "font-bold text-confirmed" : "font-bold text-declined"}>
                        {left > 0 ? `${left} libere` : "plin"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Link href={`/login?next=${encodeURIComponent(`/i/${token}`)}`} className={ui.buttonPrimary}>
                Intră cu telefonul ca să rezervi
              </Link>
              <p className="text-center text-xs text-muted">Primești un cod prin SMS. Nu plătești nimic acum.</p>
            </div>
          ) : (
            <VenueBookingForm token={token} venue={venue} booking={mine.booking} following={mine.following} />
          )}
          <AppBanner />
        </aside>
      </div>
    </div>
  );
}
