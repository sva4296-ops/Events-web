"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface VenueActionState {
  error: string | null;
}

function messageOf(error: unknown): string {
  return typeof error === "object" && error !== null && "message" in error ? String((error as { message: unknown }).message) : "";
}

/** Books (or changes) the signed-in visitor's spot — book_venue_event checks capacity. */
export async function bookVenue(
  token: string,
  eventId: string,
  _previous: VenueActionState,
  formData: FormData,
): Promise<VenueActionState> {
  if ((await getSessionUser()) === null) return { error: "Intră în cont ca să rezervi." };

  const partySize = Number(formData.get("partySize"));
  const zoneId = formData.get("zoneId");
  const time = formData.get("time");
  const follow = formData.get("follow") === "on";
  if (!Number.isInteger(partySize) || partySize < 1 || typeof zoneId !== "string" || zoneId.length === 0) {
    return { error: "Alege câte persoane și zona." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("book_venue_event", {
    p_event_id: eventId,
    p_token: token,
    p_party_size: partySize,
    p_zone_id: zoneId,
    p_time: typeof time === "string" ? time : "",
    p_follow: follow,
  });
  if (error) {
    const message = messageOf(error);
    if (message.includes("zone_full")) return { error: "Zona s-a umplut între timp. Alege altă zonă sau mai puține persoane." };
    if (message.includes("organizer_cannot_book")) return { error: "Ești organizatorul: nu poți rezerva la propria seară." };
    return { error: "Nu am putut face rezervarea. Încearcă din nou." };
  }

  revalidatePath(`/i/${token}`);
  return { error: null };
}

/** Cancels the visitor's own booking (their event_guests row → declined). */
export async function cancelVenueBooking(token: string, guestId: string): Promise<VenueActionState> {
  if ((await getSessionUser()) === null) return { error: "Intră în cont." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_guests")
    .update({ rsvp_status: "declined", responded_at: new Date().toISOString() })
    .eq("id", guestId);
  if (error) return { error: "Nu am putut anula rezervarea. Încearcă din nou." };
  revalidatePath(`/i/${token}`);
  return { error: null };
}
