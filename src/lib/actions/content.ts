"use server";

import { revalidatePath } from "next/cache";

import { getProfile, getSessionUser } from "@/lib/auth";
import { photoStoragePaths, PHOTO_BUCKET } from "@/lib/data/content";
import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/lib/types";

async function requireSession() {
  const user = await getSessionUser();
  if (user === null) throw new Error("not signed in");
  return user;
}

/* ---------- Acasă: reactions ---------- */

export async function toggleReaction(
  eventId: string,
  momentId: string,
  type: ReactionType,
  active: boolean,
): Promise<void> {
  const user = await requireSession();
  const supabase = await createClient();
  if (active) {
    await supabase
      .from("moment_reactions")
      .delete()
      .eq("moment_id", momentId)
      .eq("user_id", user.id)
      .eq("reaction_type", type);
  } else {
    await supabase.from("moment_reactions").insert({ moment_id: momentId, user_id: user.id, reaction_type: type });
  }
  revalidatePath(`/event/${eventId}`);
}

/* ---------- Chat ---------- */

export async function sendMessage(eventId: string, content: string): Promise<{ error: string | null }> {
  const text = content.trim();
  if (text.length === 0) return { error: null };
  const user = await requireSession();
  const profile = await getProfile(user.id);
  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    event_id: eventId,
    sender_id: user.id,
    sender_label: profile?.displayName ?? user.phone ?? "Tu",
    content: text,
  });
  // Realtime pushes the new row to everyone, sender included.
  return { error: error ? "Mesajul nu a putut fi trimis." : null };
}

export async function deleteMessage(messageId: string): Promise<void> {
  await requireSession();
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", messageId);
}

/* ---------- Live: photos ---------- */

/**
 * Inserts the photos row after the browser already uploaded both JPEGs to
 * Storage (same order as the app's addPhoto: files first, then the row).
 */
export async function registerPhoto(eventId: string, photoId: string): Promise<{ error: string | null }> {
  const user = await requireSession();
  const profile = await getProfile(user.id);
  const supabase = await createClient();
  const { error } = await supabase.from("photos").insert({
    id: photoId,
    event_id: eventId,
    uploaded_by: user.id,
    uploaded_by_label: profile?.displayName ?? user.phone ?? "Invitat",
  });
  if (error) {
    const { thumb, full } = photoStoragePaths(eventId, photoId);
    await supabase.storage.from(PHOTO_BUCKET).remove([thumb, full]);
    return { error: "Poza nu a putut fi salvată." };
  }
  revalidatePath(`/event/${eventId}/live`);
  revalidatePath(`/event/${eventId}/album`);
  return { error: null };
}

export async function deletePhoto(eventId: string, photoId: string): Promise<void> {
  await requireSession();
  const supabase = await createClient();
  const { thumb, full } = photoStoragePaths(eventId, photoId);
  await supabase.storage.from(PHOTO_BUCKET).remove([thumb, full]);
  await supabase.from("photos").delete().eq("id", photoId);
  revalidatePath(`/event/${eventId}/live`);
  revalidatePath(`/event/${eventId}/album`);
}

/* ---------- Detalii: dietary preferences ---------- */

export async function updateDietaryPreferences(eventId: string, preferences: string[]): Promise<void> {
  const user = await requireSession();
  const supabase = await createClient();
  await supabase
    .from("event_guests")
    .update({ dietary_preferences: preferences })
    .eq("event_id", eventId)
    .eq("guest_user_id", user.id);
  revalidatePath(`/event/${eventId}/details/meniu`);
}
