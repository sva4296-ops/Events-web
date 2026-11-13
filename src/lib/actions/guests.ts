"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth";
import { getMyEvent } from "@/lib/data/events";
import type { ParsedGuest } from "@/lib/guestImport";
import { isPlausibleStoredPhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export interface GuestActionResult {
  error: string | null;
  /** addGuest: the new row, so the page can offer to send right away. */
  guestId?: string;
  added?: number;
}

const LIMIT_MESSAGE =
  "Ai atins numărul maxim de invitați pentru planul acestui eveniment. Schimbă planul din aplicație ca să adaugi mai mulți.";

/**
 * Same gate as the app's add-guest screens: the organizer and co-organizers edit
 * the list (RLS checks it too). `primary` = events.organizer_id only, for what
 * event_members RLS (is_event_owner) keeps from co-organizers: changing roles.
 */
async function assertOwner(eventId: string, primary = false): Promise<string | null> {
  const user = await getSessionUser();
  if (user === null) return "Sesiunea a expirat. Intră din nou în cont.";
  const event = await getMyEvent(eventId, user.id);
  if (event === null || !event.isOwner) return "Doar organizatorii pot gestiona invitații.";
  if (primary && !event.isPrimaryOwner) return "Doar organizatorul principal poate schimba co-organizatorii.";
  return null;
}

/** P0001 = enforce_guest_cap (the plan's max_guests), 23505 = number already on the list. */
function messageFor(error: { code?: string }): string {
  if (error.code === "P0001") return LIMIT_MESSAGE;
  if (error.code === "23505") return "Numărul acesta e deja pe lista de invitați.";
  return "Nu am putut salva invitatul. Încearcă din nou.";
}

/** The app's insertGuestInvitePhone. */
export async function addGuest(eventId: string, name: string, phone: string): Promise<GuestActionResult> {
  if (!isPlausibleStoredPhone(phone)) return { error: "Introdu un număr de telefon valid." };
  const denied = await assertOwner(eventId);
  if (denied !== null) return { error: denied };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_guests")
    .insert({
      event_id: eventId,
      guest_phone: phone,
      guest_name: name.trim().length > 0 ? name.trim() : null,
      rsvp_status: "pending",
    })
    .select("id")
    .single();
  if (error) return { error: messageFor(error) };

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null, guestId: data.id };
}

/** The app's upsertGuestInvitesBatch: one round trip; a number already invited only gets its name filled in. */
export async function addGuestsBatch(eventId: string, guests: ParsedGuest[]): Promise<GuestActionResult> {
  const valid = guests.filter((guest) => isPlausibleStoredPhone(guest.phone));
  if (valid.length === 0) return { error: "Nu am găsit niciun număr de telefon valid." };
  const denied = await assertOwner(eventId);
  if (denied !== null) return { error: denied };

  const supabase = await createClient();
  const { error } = await supabase.rpc("upsert_event_guests_batch", {
    p_event_id: eventId,
    p_guests: valid.map((guest) => ({ phone: guest.phone, name: guest.name.trim() })),
  });
  if (error) return { error: messageFor(error) };

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null, added: valid.length };
}

/** The app's markGuestWhatsAppSent — also used for SMS, it's the queue's "invite sent" flag. */
export async function markInviteSent(eventId: string, guestId: string): Promise<GuestActionResult> {
  const denied = await assertOwner(eventId);
  if (denied !== null) return { error: denied };

  const supabase = await createClient();
  const { error } = await supabase
    .from("event_guests")
    .update({ whatsapp_sent_at: new Date().toISOString() })
    .eq("id", guestId)
    .eq("event_id", eventId);
  if (error) return { error: "Nu am putut marca invitația ca trimisă." };

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null };
}

/** Name and phone, like editing a guest in the app. A co-organizer's member row follows, so the auto-link still matches. */
export async function updateGuest(
  eventId: string,
  guestId: string,
  name: string,
  phone: string,
  memberId: string | null,
): Promise<GuestActionResult> {
  if (!isPlausibleStoredPhone(phone)) return { error: "Introdu un număr de telefon valid." };
  const denied = await assertOwner(eventId);
  if (denied !== null) return { error: denied };

  const supabase = await createClient();
  const guestName = name.trim().length > 0 ? name.trim() : null;
  const { data, error } = await supabase
    .from("event_guests")
    .update({ guest_name: guestName, guest_phone: phone })
    .eq("id", guestId)
    .eq("event_id", eventId)
    .select("id");
  if (error) return { error: messageFor(error) };
  if (data.length === 0) return { error: "Invitatul nu mai există." };

  if (memberId !== null) {
    await supabase
      .from("event_members")
      .update({ invited_name: guestName, invited_phone: phone })
      .eq("id", memberId)
      .eq("event_id", eventId);
  }

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null };
}

/** The app's removeGuestRow; a co-organizer loses that role too, or the guest row would come back. */
export async function removeGuest(eventId: string, guestId: string, memberId: string | null): Promise<GuestActionResult> {
  const denied = await assertOwner(eventId, memberId !== null);
  if (denied !== null) return { error: denied };

  const supabase = await createClient();
  if (memberId !== null) {
    const { error } = await supabase.from("event_members").delete().eq("id", memberId).eq("event_id", eventId);
    if (error) return { error: "Nu am putut șterge invitatul. Încearcă din nou." };
  }
  // .select() so an RLS-filtered delete (0 rows) shows up instead of passing silently.
  const { data, error } = await supabase
    .from("event_guests")
    .delete()
    .eq("id", guestId)
    .eq("event_id", eventId)
    .select("id");
  if (error || data.length === 0) return { error: "Nu am putut șterge invitatul. Încearcă din nou." };

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null };
}

/**
 * Invitat ↔ co-organizator, the app's insertCoOrganizer / removeCoOrganizerRow.
 * Adding the member row confirms their guest row (sync_member_guest trigger);
 * removing it leaves them a guest, same as the app.
 */
export async function setGuestRole(
  eventId: string,
  guestId: string,
  role: "guest" | "co_organizer",
  memberId: string | null,
): Promise<GuestActionResult> {
  const denied = await assertOwner(eventId, true);
  if (denied !== null) return { error: denied };
  const supabase = await createClient();

  if (role === "guest") {
    if (memberId === null) return { error: null };
    const { error } = await supabase.from("event_members").delete().eq("id", memberId).eq("event_id", eventId);
    if (error) return { error: "Nu am putut schimba rolul. Încearcă din nou." };
  } else {
    if (memberId !== null) return { error: null };
    const { data: guest, error: readError } = await supabase
      .from("event_guests")
      .select("guest_phone, guest_name, guest_user_id")
      .eq("id", guestId)
      .eq("event_id", eventId)
      .single();
    if (readError) return { error: "Invitatul nu mai există." };
    if (guest.guest_phone === null && guest.guest_user_id === null) {
      return { error: "Adaugă-i întâi un număr de telefon: co-organizatorul intră în aplicație cu el." };
    }
    const { error } = await supabase.from("event_members").insert({
      event_id: eventId,
      role: "co_organizer",
      invited_phone: guest.guest_phone,
      invited_name: guest.guest_name,
      user_id: guest.guest_phone === null ? guest.guest_user_id : null,
      relation: null,
    });
    if (error) {
      return {
        error: error.code === "23505" ? "E deja co-organizator." : "Nu am putut schimba rolul. Încearcă din nou.",
      };
    }
  }

  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null };
}
