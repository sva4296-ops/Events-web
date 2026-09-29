import "server-only";

import { getSupabase } from "@/lib/supabase/anon";

export type RsvpStatus = "pending" | "confirmed" | "declined";
export type EventType =
  | "wedding"
  | "baptism"
  | "birthday"
  | "cause"
  | "corporate"
  | "memorial"
  | "other";

/** Row shape of get_invite_by_token(text). */
interface InviteRow {
  event_id: string | null;
  event_name: string;
  event_type: EventType;
  event_date: string | null;
  location: string | null;
  welcome_message: string | null;
  host_name: string | null;
  guest_name: string | null;
  rsvp_status: RsvpStatus;
}

export interface Invite {
  /** Null until 20260929000002 is applied (older function had no event_id). */
  eventId: string | null;
  eventName: string;
  eventType: EventType;
  /** YYYY-MM-DD, or null when the organizer hasn't set a date. */
  eventDate: string | null;
  location: string | null;
  welcomeMessage: string | null;
  hostName: string | null;
  guestName: string | null;
  status: RsvpStatus;
}

/** Tokens are 32 lowercase hex chars (see the migration). Anything else is
 * rejected before it ever reaches the database. */
const TOKEN_PATTERN = /^[0-9a-f]{32}$/;

export function isValidToken(token: string): boolean {
  return TOKEN_PATTERN.test(token);
}

function blankToNull(value: string | null): string | null {
  return value !== null && value.trim().length > 0 ? value.trim() : null;
}

export async function getInvite(token: string): Promise<Invite | null> {
  if (!isValidToken(token)) return null;

  const { data, error } = await getSupabase().rpc("get_invite_by_token", { p_token: token });
  if (error) throw error;

  const row = (data as InviteRow[] | null)?.[0];
  if (row === undefined) return null;

  return {
    eventId: row.event_id ?? null,
    eventName: row.event_name,
    eventType: row.event_type,
    eventDate: row.event_date,
    location: blankToNull(row.location),
    welcomeMessage: blankToNull(row.welcome_message),
    hostName: blankToNull(row.host_name),
    guestName: blankToNull(row.guest_name),
    status: row.rsvp_status,
  };
}

export async function respondToInvite(
  token: string,
  status: Exclude<RsvpStatus, "pending">,
): Promise<RsvpStatus | null> {
  if (!isValidToken(token)) return null;

  const { data, error } = await getSupabase().rpc("respond_to_invite_by_token", {
    p_token: token,
    p_status: status,
  });
  if (error) throw error;
  return (data as RsvpStatus | null) ?? null;
}
