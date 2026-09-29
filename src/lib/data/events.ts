import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { AppEvent, EventRow, MyEvent, PlanCapabilities } from "@/lib/types";

const SELECT_WITH_GUESTS =
  "id, organizer_id, type, name, event_date, location, welcome_message, plan_tier, album_status, event_guests(id, event_id, guest_user_id, guest_phone, guest_name, rsvp_status, dietary_preferences, table_id)";

function mapEvent(row: EventRow): AppEvent {
  return {
    id: row.id,
    ownerId: row.organizer_id,
    type: row.type,
    name: row.name,
    date: row.event_date,
    location: row.location?.trim() || null,
    welcomeMessage: row.welcome_message?.trim() || null,
    planTier: row.plan_tier,
    albumStatus: row.album_status,
    guests: row.event_guests,
  };
}

function toMyEvent(event: AppEvent, userId: string): MyEvent {
  const isOwner = event.ownerId === userId;
  return {
    ...event,
    isOwner,
    // RLS scopes a non-owner's event_guests to their own row (same as the app's
    // `event.guests[0]`), but match on the user id anyway to be explicit.
    myGuest: isOwner
      ? null
      : (event.guests.find((guest) => guest.guest_user_id === userId) ?? event.guests[0] ?? null),
  };
}

/** Every event the user organizes or is a guest of (RLS-scoped, like fetchEvents in the app). */
export const getMyEvents = cache(async (userId: string): Promise<MyEvent[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SELECT_WITH_GUESTS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as EventRow[]).map((row) => toMyEvent(mapEvent(row), userId));
});

export const getMyEvent = cache(async (eventId: string, userId: string): Promise<MyEvent | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SELECT_WITH_GUESTS)
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  return data === null ? null : toMyEvent(mapEvent(data as unknown as EventRow), userId);
});

/** Fallback for a guest whose row isn't linked to their account yet — same
 * get_invite_preview RPC the app's invite screen falls back to. */
export async function getInvitePreviewEventId(eventId: string): Promise<{
  guestId: string;
  status: "pending" | "confirmed" | "declined";
} | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_invite_preview", { p_event_id: eventId });
  if (error) return null;
  const row = (data as { guest_id: string; rsvp_status: "pending" | "confirmed" | "declined" }[] | null)?.[0];
  return row === undefined ? null : { guestId: row.guest_id, status: row.rsvp_status };
}

/** Matches the Esențial row; used when plan_tier is null (same rule as the
 * app's usePlanGate and the server-side gating migration). */
const ESENTIAL: PlanCapabilities = {
  maxGuests: 50,
  contributionsEnabled: false,
  liveScreenEnabled: false,
  chatEnabled: false,
  lodgingTransportEnabled: false,
  vendorTaggingEnabled: false,
};

interface PlanRow {
  plan_key: string;
  max_guests: number | null;
  contributions_enabled: boolean;
  live_screen_enabled: boolean;
  chat_enabled: boolean;
  lodging_transport_enabled: boolean;
  vendor_tagging_enabled: boolean;
}

/** All plan_features rows (a handful, public config). Fetched in parallel
 * with the event instead of after it, then picked by plan_tier. */
export const getPlanCatalog = cache(async (): Promise<PlanRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plan_features")
    .select(
      "plan_key, max_guests, contributions_enabled, live_screen_enabled, chat_enabled, lodging_transport_enabled, vendor_tagging_enabled",
    );
  return (data ?? []) as PlanRow[];
});

export function pickCapabilities(catalog: PlanRow[], planTier: string | null): PlanCapabilities {
  const row = catalog.find((plan) => plan.plan_key === (planTier ?? "esential"));
  if (row === undefined) return ESENTIAL;
  return {
    maxGuests: row.max_guests,
    contributionsEnabled: row.contributions_enabled,
    liveScreenEnabled: row.live_screen_enabled,
    chatEnabled: row.chat_enabled,
    lodgingTransportEnabled: row.lodging_transport_enabled,
    vendorTaggingEnabled: row.vendor_tagging_enabled,
  };
}
