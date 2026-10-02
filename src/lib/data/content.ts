import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  Accommodation,
  Fund,
  MenuOption,
  Message,
  Moment,
  MomentReaction,
  Photo,
  ReactionType,
  ScheduleItem,
  SeatingTable,
  Vendor,
  Venue,
} from "@/lib/types";

export const PHOTO_BUCKET = "event-photos";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export function photoStoragePaths(eventId: string, photoId: string) {
  return { thumb: `${eventId}/${photoId}/thumb.jpg`, full: `${eventId}/${photoId}/full.jpg` };
}

/* ---------- Acasă ---------- */

export const getMoments = cache(
  async (eventId: string): Promise<{ moments: Moment[]; reactions: MomentReaction[] }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("moments")
      .select("id, title, photo_url, created_at, moment_reactions(user_id, reaction_type)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    type Row = {
      id: string;
      title: string;
      photo_url: string | null;
      created_at: string;
      moment_reactions: { user_id: string; reaction_type: ReactionType }[];
    };
    const rows = (data ?? []) as Row[];

    // The app stores a Storage path ({eventId}/moments/{id}.jpg) in photo_url;
    // older rows hold a device-local URI that only rendered on the organizer's phone.
    const isStoragePath = (value: string | null): value is string =>
      value !== null && value.startsWith(`${eventId}/moments/`);
    const paths = rows.map((row) => row.photo_url).filter(isStoragePath);
    const signedByPath = new Map<string, string>();
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
      for (const entry of signed ?? []) {
        if (entry.path !== null && entry.signedUrl) signedByPath.set(entry.path, entry.signedUrl);
      }
    }

    return {
      moments: rows.map((row) => ({
        id: row.id,
        title: row.title,
        photoUrl: isStoragePath(row.photo_url)
          ? (signedByPath.get(row.photo_url) ?? null)
          : row.photo_url !== null && /^https?:\/\//.test(row.photo_url)
            ? row.photo_url
            : null,
        createdAt: row.created_at,
      })),
      reactions: rows.flatMap((row) =>
        row.moment_reactions.map((r) => ({ momentId: row.id, userId: r.user_id, type: r.reaction_type })),
      ),
    };
  },
);

/* ---------- Chat ---------- */

export const getMessages = cache(async (eventId: string): Promise<Message[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, sender_label, content, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    senderId: row.sender_id,
    senderLabel: row.sender_label,
    content: row.content,
    createdAt: row.created_at,
  }));
});

/* ---------- Live / Album ---------- */

export const getPhotos = cache(async (eventId: string): Promise<Photo[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("id, event_id, uploaded_by, uploaded_by_label, url, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  type Row = {
    id: string;
    event_id: string;
    uploaded_by: string;
    uploaded_by_label: string | null;
    url: string | null;
    created_at: string;
  };
  const rows = (data ?? []) as Row[];
  if (rows.length === 0) return [];

  const paths = rows.flatMap((row) => Object.values(photoStoragePaths(row.event_id, row.id)));
  const { data: signed } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  const byPath = new Map((signed ?? []).map((entry) => [entry.path, entry.signedUrl]));

  const legacy = (url: string | null) => (url !== null && /^https?:\/\//.test(url) ? url : null);

  return rows.map((row) => {
    const { thumb, full } = photoStoragePaths(row.event_id, row.id);
    return {
      id: row.id,
      uploadedBy: row.uploaded_by,
      uploadedByLabel: row.uploaded_by_label,
      thumbUrl: byPath.get(thumb) ?? legacy(row.url),
      fullUrl: byPath.get(full) ?? legacy(row.url),
      createdAt: row.created_at,
    };
  });
});

/* ---------- Detalii + Fond ---------- */

export interface Details {
  fund: Fund | null;
  contributorCount: number;
  schedule: ScheduleItem[];
  venue: Venue;
  menuOptions: MenuOption[];
  seatingTables: SeatingTable[];
  accommodations: Accommodation[];
  vendors: Vendor[];
}

export const getDetails = cache(async (eventId: string): Promise<Details> => {
  const supabase = await createClient();
  const [schedule, venue, fund, menuOptions, seating, accommodations, vendors] = await Promise.all([
    supabase.from("schedule_items").select("*").eq("event_id", eventId).order("sort_order"),
    supabase.from("venue_info").select("*").eq("event_id", eventId).maybeSingle(),
    supabase.from("fund").select("*").eq("event_id", eventId).maybeSingle(),
    supabase.from("menu_options").select("*").eq("event_id", eventId).order("sort_order"),
    supabase.from("seating_tables").select("*").eq("event_id", eventId).order("sort_order"),
    supabase.from("accommodations").select("*").eq("event_id", eventId).order("sort_order"),
    supabase.from("vendors").select("*").eq("event_id", eventId).order("sort_order"),
  ]);
  for (const res of [schedule, venue, fund, menuOptions, seating, accommodations, vendors]) {
    if (res.error) throw res.error;
  }

  // Course photos: paths inside menu_options.courses, signed in one call.
  const rawCourses = (menuOptions.data ?? []).map((row) =>
    Array.isArray(row.courses) ? (row.courses as { name?: unknown; dish?: unknown; photo_path?: unknown }[]) : [],
  );
  const coursePaths = rawCourses.flat().flatMap((c) => (typeof c?.photo_path === "string" ? [c.photo_path] : []));
  const coursePhotoUrl = new Map<string, string>();
  if (coursePaths.length > 0) {
    const { data: signed } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(coursePaths, SIGNED_URL_TTL_SECONDS);
    for (const entry of signed ?? []) if (entry.path && entry.signedUrl) coursePhotoUrl.set(entry.path, entry.signedUrl);
  }

  let contributorCount = 0;
  if (fund.data !== null) {
    const { count } = await supabase
      .from("contributions")
      .select("id", { count: "exact", head: true })
      .eq("fund_id", fund.data.id);
    contributorCount = count ?? 0;
  }

  return {
    fund:
      fund.data === null
        ? null
        : {
            id: fund.data.id,
            title: fund.data.title,
            description: fund.data.description ?? "",
            targetAmount: Number(fund.data.target_amount),
            currentAmount: Number(fund.data.current_amount),
            currency: fund.data.currency,
          },
    contributorCount,
    schedule: (schedule.data ?? []).map((row) => ({
      id: row.id,
      time: row.time,
      title: row.title,
      location: row.location ?? "",
    })),
    venue: {
      name: venue.data?.name ?? "",
      address: venue.data?.address ?? "",
      notes: venue.data?.notes ?? [],
    },
    menuOptions: (menuOptions.data ?? []).map((row, index) => ({
      id: row.id,
      name: row.name,
      courses: rawCourses[index].flatMap((course) =>
        typeof course?.dish === "string"
          ? [
              {
                name: typeof course.name === "string" ? course.name : "",
                dish: course.dish,
                photoUrl: typeof course.photo_path === "string" ? (coursePhotoUrl.get(course.photo_path) ?? null) : null,
              },
            ]
          : [],
      ),
    })),
    seatingTables: (seating.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      label: row.label ?? "",
      seatCount: row.seat_count,
    })),
    accommodations: (accommodations.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      detailLine: row.detail_line ?? "",
      priceLine: row.price_line ?? "",
    })),
    vendors: (vendors.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category ?? "",
      handle: row.handle ?? "",
      externalUrl: row.external_url ?? "",
    })),
  };
});

/** The caller's confirmed table-mates (get_table_companions RPC). */
export async function getTableCompanions(eventId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_table_companions", { p_event_id: eventId });
  if (error) return [];
  return ((data as { name: string }[] | null) ?? []).map((row) => row.name);
}
