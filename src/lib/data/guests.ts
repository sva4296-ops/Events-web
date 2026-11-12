import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  InviteMessageEvent,
  SpontaneousTemplate,
} from "@/lib/inviteMessage";
import type { RsvpStatus } from "@/lib/types";

export interface ManagedGuest {
  id: string;
  name: string | null;
  phone: string | null;
  status: RsvpStatus;
  inviteToken: string;
  /** When the organizer last sent the invite (WhatsApp or SMS); the app's queue flag. */
  sentAt: string | null;
  createdAt: string;
  /** Co-organizers are event_members rows matched to this guest (by account or phone), like the app's. */
  role: "guest" | "co_organizer";
  memberId: string | null;
}

export interface GuestsPageData {
  guests: ManagedGuest[];
  messageEvent: InviteMessageEvent;
}

/** The organizer's guest list with what invites need (tokens, sent flags), like the app's event.guests. */
export async function getGuestsPageData(
  eventId: string,
): Promise<GuestsPageData> {
  const supabase = await createClient();
  const [eventResult, guestsResult, membersResult] = await Promise.all([
    supabase
      .from("events")
      .select(
        "type, name, event_date, location, invite_intro, template, start_time, reply_by",
      )
      .eq("id", eventId)
      .single(),
    supabase
      .from("event_guests")
      .select(
        "id, guest_user_id, guest_name, guest_phone, rsvp_status, invite_token, whatsapp_sent_at, invited_at",
      )
      .eq("event_id", eventId)
      .order("invited_at", { ascending: false }),
    supabase
      .from("event_members")
      .select("id, user_id, role, invited_phone")
      .eq("event_id", eventId),
  ]);
  if (eventResult.error) throw eventResult.error;
  if (guestsResult.error) throw guestsResult.error;
  if (membersResult.error) throw membersResult.error;
  const members = (
    membersResult.data as {
      id: string;
      user_id: string | null;
      role: string;
      invited_phone: string | null;
    }[]
  ).filter((member) => member.role === "co_organizer");

  const event = eventResult.data as {
    type: string;
    name: string;
    event_date: string | null;
    location: string | null;
    invite_intro: string | null;
    template: SpontaneousTemplate | null;
    start_time: string | null;
    reply_by: string | null;
  };
  const rows = guestsResult.data as {
    id: string;
    guest_user_id: string | null;
    guest_name: string | null;
    guest_phone: string | null;
    rsvp_status: RsvpStatus;
    invite_token: string;
    whatsapp_sent_at: string | null;
    invited_at: string;
  }[];

  return {
    messageEvent: {
      type: event.type,
      name: event.name,
      date: event.event_date,
      location: event.location,
      inviteIntro: event.invite_intro,
      template: event.template ?? null,
      startTime: event.start_time,
      replyBy: event.reply_by,
    },
    guests: rows.map((row) => {
      const member = members.find(
        (m) =>
          (m.user_id !== null && m.user_id === row.guest_user_id) ||
          (m.invited_phone !== null && m.invited_phone === row.guest_phone),
      );
      return {
        id: row.id,
        name: row.guest_name?.trim() || null,
        phone: row.guest_phone,
        status: row.rsvp_status,
        inviteToken: row.invite_token,
        sentAt: row.whatsapp_sent_at,
        createdAt: row.invited_at,
        role:
          member !== undefined ? ("co_organizer" as const) : ("guest" as const),
        memberId: member?.id ?? null,
      };
    }),
  };
}
