"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/data/content";
import { getMyEvent } from "@/lib/data/events";
import { MENU_DEADLINE_CHOICES } from "@/lib/menuDeadline";
import { createClient } from "@/lib/supabase/server";
import type { TableShape } from "@/lib/types";

/**
 * Plan edits (Detalii tab), the app's remoteEventContentRepository writes.
 * Organizer and co-organizers (the app's isOwner); RLS checks it too.
 */
export interface PlanActionResult {
  error: string | null;
}

const SAVE_ERROR = "Nu am putut salva. Încearcă din nou.";
const DELETE_ERROR = "Nu am putut șterge. Încearcă din nou.";

async function authorize(eventId: string) {
  const user = await getSessionUser();
  if (user === null) return { error: "Sesiunea a expirat. Intră din nou în cont.", supabase: null } as const;
  const event = await getMyEvent(eventId, user.id);
  if (event === null || !event.isOwner) return { error: "Doar organizatorii pot edita planul.", supabase: null } as const;
  return { error: null, supabase: await createClient() } as const;
}

function done(eventId: string): PlanActionResult {
  revalidatePath(`/event/${eventId}`, "layout");
  return { error: null };
}

/** Next sort_order: the app uses the current list length. */
async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  eventId: string,
): Promise<number> {
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).eq("event_id", eventId);
  return count ?? 0;
}

/* ---------- Program ---------- */

export async function saveScheduleItem(
  eventId: string,
  item: { id: string | null; time: string; title: string; location: string },
): Promise<PlanActionResult> {
  const title = item.title.trim();
  if (title.length === 0) return { error: "Completează titlul." };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };

  const fields = { time: item.time.trim(), title, location: item.location.trim() };
  const { error } =
    item.id === null
      ? await supabase
          .from("schedule_items")
          .insert({ event_id: eventId, ...fields, sort_order: await nextSortOrder(supabase, "schedule_items", eventId) })
      : await supabase.from("schedule_items").update(fields).eq("id", item.id).eq("event_id", eventId);
  return error ? { error: SAVE_ERROR } : done(eventId);
}

export async function deleteScheduleItem(eventId: string, itemId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase.from("schedule_items").delete().eq("id", itemId).eq("event_id", eventId);
  return error ? { error: DELETE_ERROR } : done(eventId);
}

/* ---------- Locație ---------- */

/** The app's updateVenue. Map coordinates are only set from the app; an upsert
 * that leaves them out keeps whatever point is already saved. */
export async function saveVenue(
  eventId: string,
  venue: { name: string; address: string; notes: string },
): Promise<PlanActionResult> {
  if (venue.name.trim().length === 0) return { error: "Completează numele locației." };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const notes = venue.notes
    .split("\n")
    .map((note) => note.trim())
    .filter((note) => note.length > 0);
  const { error } = await supabase
    .from("venue_info")
    .upsert({ event_id: eventId, name: venue.name.trim(), address: venue.address.trim(), notes }, { onConflict: "event_id" });
  return error ? { error: SAVE_ERROR } : done(eventId);
}

export async function deleteVenue(eventId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase.from("venue_info").delete().eq("event_id", eventId);
  return error ? { error: DELETE_ERROR } : done(eventId);
}

/* ---------- Meniu ---------- */

const MAX_COURSES = 8;

/** Course photos are uploaded from the browser first (`{eventId}/menu/{id}.jpg`), then saved here by path. */
export async function saveMenuOption(
  eventId: string,
  item: {
    id: string | null;
    name: string;
    courses: { name: string; dish: string; photoPath: string | null }[];
  },
): Promise<PlanActionResult> {
  const name = item.name.trim();
  if (name.length === 0) return { error: "Completează numele meniului." };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };

  const prefix = `${eventId}/menu/`;
  const courses = item.courses
    .filter((course) => course.dish.trim().length > 0)
    .slice(0, MAX_COURSES)
    .map((course, index) => ({
      name: course.name.trim().length > 0 ? course.name.trim() : `Felul ${index + 1}`,
      dish: course.dish.trim(),
      photo_path: course.photoPath !== null && course.photoPath.startsWith(prefix) ? course.photoPath : null,
    }));

  let previousPaths: string[] = [];
  if (item.id !== null) {
    const { data } = await supabase.from("menu_options").select("courses").eq("id", item.id).eq("event_id", eventId).maybeSingle();
    const old = Array.isArray(data?.courses) ? (data.courses as { photo_path?: unknown }[]) : [];
    previousPaths = old.flatMap((course) => (typeof course?.photo_path === "string" ? [course.photo_path] : []));
  }

  const { error } =
    item.id === null
      ? await supabase
          .from("menu_options")
          .insert({ event_id: eventId, name, courses, sort_order: await nextSortOrder(supabase, "menu_options", eventId) })
      : await supabase.from("menu_options").update({ name, courses }).eq("id", item.id).eq("event_id", eventId);
  if (error) return { error: SAVE_ERROR };

  // Best effort, like the app's removeMenuPhotos.
  const kept = new Set(courses.map((course) => course.photo_path));
  const stale = previousPaths.filter((path) => !kept.has(path));
  if (stale.length > 0) await supabase.storage.from(PHOTO_BUCKET).remove(stale);
  return done(eventId);
}

/** Guests who picked it fall back to "not chosen" (on delete set null). */
export async function deleteMenuOption(eventId: string, optionId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { data } = await supabase.from("menu_options").select("courses").eq("id", optionId).eq("event_id", eventId).maybeSingle();
  const { error } = await supabase.from("menu_options").delete().eq("id", optionId).eq("event_id", eventId);
  if (error) return { error: DELETE_ERROR };
  const old = Array.isArray(data?.courses) ? (data.courses as { photo_path?: unknown }[]) : [];
  const paths = old.flatMap((course) => (typeof course?.photo_path === "string" ? [course.photo_path] : []));
  if (paths.length > 0) await supabase.storage.from(PHOTO_BUCKET).remove(paths);
  return done(eventId);
}

/** Upserts only the deadline, like the app's saveMenuDeadline. */
export async function saveMenuDeadline(eventId: string, days: number): Promise<PlanActionResult> {
  if (!(MENU_DEADLINE_CHOICES as readonly number[]).includes(days)) return { error: SAVE_ERROR };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase
    .from("menu")
    .upsert({ event_id: eventId, choice_deadline_days: days }, { onConflict: "event_id" });
  return error ? { error: SAVE_ERROR } : done(eventId);
}

/* ---------- Mese ---------- */

/** Must match the app's utils/floorPlan.ts gridSlot (and its backfill migration). */
function gridSlot(index: number): { x: number; y: number } {
  return { x: 110 + (index % 3) * 170, y: 110 + Math.floor(index / 3) * 170 };
}

/** The app's saveSeatingTable: the table, then this table's guests (clear, then set). */
export async function saveSeatingTable(
  eventId: string,
  item: { id: string | null; name: string; label: string; seatCount: number; shape: TableShape; guestIds: string[] },
): Promise<PlanActionResult> {
  const name = item.name.trim();
  if (name.length === 0) return { error: "Completează numele mesei." };
  const seatCount = Number.isFinite(item.seatCount) && item.seatCount > 0 ? Math.floor(item.seatCount) : 0;
  const shape: TableShape = item.shape === "rect" ? "rect" : "round";
  const guestIds = seatCount > 0 ? item.guestIds.slice(0, seatCount) : item.guestIds;
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };

  let tableId = item.id;
  const fields = { name, label: item.label.trim(), seat_count: seatCount, shape };
  if (tableId === null) {
    const sortOrder = await nextSortOrder(supabase, "seating_tables", eventId);
    const slot = gridSlot(sortOrder);
    const { data, error } = await supabase
      .from("seating_tables")
      .insert({ event_id: eventId, ...fields, sort_order: sortOrder, pos_x: slot.x, pos_y: slot.y })
      .select("id")
      .single();
    if (error) return { error: SAVE_ERROR };
    tableId = data.id as string;
  } else {
    const { error } = await supabase.from("seating_tables").update(fields).eq("id", tableId).eq("event_id", eventId);
    if (error) return { error: SAVE_ERROR };
  }

  const { error: clearError } = await supabase
    .from("event_guests")
    .update({ table_id: null })
    .eq("table_id", tableId)
    .eq("event_id", eventId);
  if (clearError) return { error: SAVE_ERROR };
  if (guestIds.length > 0) {
    const { error: assignError } = await supabase
      .from("event_guests")
      .update({ table_id: tableId })
      .in("id", guestIds)
      .eq("event_id", eventId);
    if (assignError) return { error: SAVE_ERROR };
  }
  return done(eventId);
}

export async function deleteSeatingTable(eventId: string, tableId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase.from("seating_tables").delete().eq("id", tableId).eq("event_id", eventId);
  return error ? { error: DELETE_ERROR } : done(eventId);
}

/* ---------- Cazare ---------- */

export async function saveAccommodation(
  eventId: string,
  item: { id: string | null; name: string; detailLine: string; priceLine: string; location: string },
): Promise<PlanActionResult> {
  const name = item.name.trim();
  if (name.length === 0) return { error: "Completează numele." };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const fields = {
    name,
    detail_line: item.detailLine.trim(),
    price_line: item.priceLine.trim(),
    location: item.location.trim(),
  };
  const { error } =
    item.id === null
      ? await supabase
          .from("accommodations")
          .insert({ event_id: eventId, ...fields, sort_order: await nextSortOrder(supabase, "accommodations", eventId) })
      : await supabase.from("accommodations").update(fields).eq("id", item.id).eq("event_id", eventId);
  return error ? { error: SAVE_ERROR } : done(eventId);
}

export async function deleteAccommodation(eventId: string, itemId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase.from("accommodations").delete().eq("id", itemId).eq("event_id", eventId);
  return error ? { error: DELETE_ERROR } : done(eventId);
}

/* ---------- Furnizori ---------- */

export async function saveVendor(
  eventId: string,
  item: { id: string | null; name: string; category: string; handle: string; externalUrl: string },
): Promise<PlanActionResult> {
  const name = item.name.trim();
  if (name.length === 0) return { error: "Completează numele." };
  const url = item.externalUrl.trim();
  if (url.length > 0 && !/^https?:\/\//i.test(url)) return { error: "Linkul trebuie să înceapă cu https://" };
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const fields = {
    name,
    category: item.category.trim(),
    handle: item.handle.trim(),
    external_url: url.length > 0 ? url : null,
  };
  const { error } =
    item.id === null
      ? await supabase
          .from("vendors")
          .insert({ event_id: eventId, ...fields, sort_order: await nextSortOrder(supabase, "vendors", eventId) })
      : await supabase.from("vendors").update(fields).eq("id", item.id).eq("event_id", eventId);
  return error ? { error: SAVE_ERROR } : done(eventId);
}

export async function deleteVendor(eventId: string, vendorId: string): Promise<PlanActionResult> {
  const { error: denied, supabase } = await authorize(eventId);
  if (supabase === null) return { error: denied };
  const { error } = await supabase.from("vendors").delete().eq("id", vendorId).eq("event_id", eventId);
  return error ? { error: DELETE_ERROR } : done(eventId);
}
