import "server-only";

import { getSupabase } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import { isValidToken } from "@/lib/invites";

/**
 * Venue nights ("Local") on the website: the bar/restaurant's public link
 * https://<site>/i/<public_token>. Same /i/ path as personal invites; the
 * page tries the personal token first, then this. Schema lives in the app
 * repo: supabase/migrations/20261023000002_venue_events.sql (+ 000004 for
 * get_venue_public).
 */

export interface VenueZone {
  id: string;
  name: string;
  detail: string;
  capacity: number;
  booked: number;
}

export interface VenueNight {
  eventId: string;
  agencyId: string | null;
  name: string;
  hostName: string | null;
  eventDate: string | null;
  startTime: string | null;
  location: string | null;
  welcomeMessage: string | null;
  priceInfo: string | null;
  bookingTimes: string[];
  maxPartySize: number;
  zones: VenueZone[];
  lineup: { time: string; title: string }[];
  bookedPeople: number;
}

export interface MyVenueBooking {
  guestId: string;
  status: "pending" | "confirmed" | "declined" | "maybe";
  partySize: number | null;
  zoneId: string | null;
  bookingTime: string | null;
  bookingCode: string | null;
  checkedInAt: string | null;
}

interface VenueRow {
  event_id: string;
  agency_id: string | null;
  name: string;
  host_name: string | null;
  event_date: string | null;
  start_time: string | null;
  location: string | null;
  welcome_message: string | null;
  price_info: string | null;
  booking_times: string[] | null;
  max_party_size: number;
  zones: { id: string; name: string; detail: string; capacity: number; booked: number | string }[];
  lineup: { time: string; title: string }[];
  booked_people: number | string;
}

function blankToNull(value: string | null): string | null {
  return value !== null && value.trim().length > 0 ? value.trim() : null;
}

/** Public data, no session needed. Null for an unknown token or a non-venue event. */
export async function getVenueByToken(token: string): Promise<VenueNight | null> {
  if (!isValidToken(token)) return null;
  const { data, error } = await getSupabase().rpc("get_venue_public", { p_token: token });
  // Unknown function (migration 20261023000004 not applied yet) reads as "no
  // such venue", so the page shows "not found" instead of crashing.
  if (error) {
    console.warn("get_venue_public failed", error.message);
    return null;
  }
  const row = data as VenueRow | null;
  if (row === null) return null;
  return {
    eventId: row.event_id,
    agencyId: row.agency_id,
    name: row.name,
    hostName: blankToNull(row.host_name),
    eventDate: row.event_date,
    startTime: blankToNull(row.start_time),
    location: blankToNull(row.location),
    welcomeMessage: blankToNull(row.welcome_message),
    priceInfo: blankToNull(row.price_info),
    bookingTimes: row.booking_times ?? [],
    maxPartySize: row.max_party_size,
    zones: row.zones.map((zone) => ({ ...zone, booked: Number(zone.booked) })),
    lineup: row.lineup,
    bookedPeople: Number(row.booked_people),
  };
}

/** The signed-in visitor's own booking for this night, and whether they follow the venue. */
export async function getMyVenueBooking(
  eventId: string,
  token: string,
): Promise<{ booking: MyVenueBooking | null; following: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_venue_booking", { p_event_id: eventId, p_token: token });
  if (error) throw error;
  const row = data as {
    my_booking: {
      guest_id: string;
      rsvp_status: MyVenueBooking["status"];
      party_size: number | null;
      zone_id: string | null;
      booking_time: string | null;
      booking_code: string | null;
      checked_in_at: string | null;
    } | null;
    following: boolean;
  } | null;
  if (row === null || row.my_booking === null) return { booking: null, following: row?.following ?? false };
  const b = row.my_booking;
  return {
    booking: {
      guestId: b.guest_id,
      status: b.rsvp_status,
      partySize: b.party_size,
      zoneId: b.zone_id,
      bookingTime: b.booking_time,
      bookingCode: b.booking_code,
      checkedInAt: b.checked_in_at,
    },
    following: row.following,
  };
}
