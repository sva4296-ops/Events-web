"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/data/content";
import { getMyEvent } from "@/lib/data/events";
import { isMomentIconId } from "@/lib/momentIcons";
import { createClient } from "@/lib/supabase/server";

/**
 * Moments in Acasă, the app's createMoment / updateMoment / deleteMoment.
 * The photo is uploaded from the browser first, to `{eventId}/moments/{momentId}.jpg`
 * (the app's path), then the row points at it. Organizers and co-organizers
 * post; someone else's moment is the primary owner's to edit (moments RLS).
 */
export interface MomentActionResult {
  error: string | null;
}

const MAX_TITLE = 120;

function momentPath(eventId: string, momentId: string) {
  return `${eventId}/moments/${momentId}.jpg`;
}

async function authorize(eventId: string) {
  const user = await getSessionUser();
  if (user === null) return { error: "Sesiunea a expirat. Intră din nou în cont." } as const;
  const event = await getMyEvent(eventId, user.id);
  if (event === null || !event.isOwner) return { error: "Doar organizatorii pot posta momente." } as const;
  return { error: null, user, event, supabase: await createClient() } as const;
}

export async function createMoment(
  eventId: string,
  momentId: string,
  input: { title: string; icon: string | null; hasPhoto: boolean },
): Promise<MomentActionResult> {
  const title = input.title.trim().slice(0, MAX_TITLE);
  if (title.length === 0) return { error: "Completează titlul." };
  if (!/^[0-9a-f-]{36}$/i.test(momentId)) return { error: "Nu am putut publica momentul." };
  const auth = await authorize(eventId);
  if (auth.error !== null) return { error: auth.error };

  const photoPath = input.hasPhoto ? momentPath(eventId, momentId) : null;
  const { error } = await auth.supabase.from("moments").insert({
    id: momentId,
    event_id: eventId,
    organizer_id: auth.user.id,
    title,
    photo_url: photoPath,
    icon: isMomentIconId(input.icon) ? input.icon : null,
  });
  if (error) {
    if (photoPath !== null) await auth.supabase.storage.from(PHOTO_BUCKET).remove([photoPath]);
    return { error: "Nu am putut publica momentul. Încearcă din nou." };
  }
  revalidatePath(`/event/${eventId}`);
  return { error: null };
}

export async function updateMoment(
  eventId: string,
  momentId: string,
  input: { title: string; icon: string | null; newPhoto: boolean },
): Promise<MomentActionResult> {
  const title = input.title.trim().slice(0, MAX_TITLE);
  if (title.length === 0) return { error: "Completează titlul." };
  const auth = await authorize(eventId);
  if (auth.error !== null) return { error: auth.error };

  const patch: { title: string; icon: string | null; photo_url?: string } = {
    title,
    icon: isMomentIconId(input.icon) ? input.icon : null,
  };
  if (input.newPhoto) patch.photo_url = momentPath(eventId, momentId);
  const { data, error } = await auth.supabase
    .from("moments")
    .update(patch)
    .eq("id", momentId)
    .eq("event_id", eventId)
    .select("id");
  if (error || data.length === 0) return { error: "Nu am putut salva momentul." };
  revalidatePath(`/event/${eventId}`);
  return { error: null };
}

export async function deleteMoment(eventId: string, momentId: string): Promise<MomentActionResult> {
  const auth = await authorize(eventId);
  if (auth.error !== null) return { error: auth.error };
  const { data, error } = await auth.supabase
    .from("moments")
    .delete()
    .eq("id", momentId)
    .eq("event_id", eventId)
    .select("id");
  if (error || data.length === 0) return { error: "Nu am putut șterge momentul." };
  // Best effort, like the app: a photo-less moment has nothing at this path.
  await auth.supabase.storage.from(PHOTO_BUCKET).remove([momentPath(eventId, momentId)]);
  revalidatePath(`/event/${eventId}`);
  return { error: null };
}
