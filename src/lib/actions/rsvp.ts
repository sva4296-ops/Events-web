"use server";

import { revalidatePath } from "next/cache";

import { getProfile, getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface RsvpState {
  error: string | null;
}

/**
 * Signed-in RSVP — same logic as the app's respondToInviteRow: update the
 * caller's own event_guests row (linked by guest_user_id), or insert one if
 * none exists yet ("guest claims own invite" RLS policy).
 */
export async function respondAsUser(eventId: string, _prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const status = formData.get("status");
  if (status !== "confirmed" && status !== "declined") return { error: "Răspuns invalid." };

  const user = await getSessionUser();
  if (user === null) return { error: "Sesiunea a expirat. Intră din nou în cont." };
  const profile = await getProfile(user.id);
  const guestName = profile?.displayName ?? user.phone ?? "Invitat";

  const supabase = await createClient();
  const respondedAt = new Date().toISOString();

  const { data: existing, error: selectError } = await supabase
    .from("event_guests")
    .select("id")
    .eq("event_id", eventId)
    .eq("guest_user_id", user.id)
    .maybeSingle();
  if (selectError) return { error: "Nu am putut salva răspunsul. Încearcă din nou." };

  const { error } =
    existing === null
      ? await supabase.from("event_guests").insert({
          event_id: eventId,
          guest_user_id: user.id,
          guest_name: guestName,
          rsvp_status: status,
          responded_at: respondedAt,
        })
      : await supabase
          .from("event_guests")
          .update({ rsvp_status: status, responded_at: respondedAt, guest_name: guestName })
          .eq("id", existing.id);
  if (error) return { error: "Nu am putut salva răspunsul. Încearcă din nou." };

  revalidatePath(`/invite/${eventId}`);
  revalidatePath("/events");
  return { error: null };
}
