"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getBrowserClient } from "@/lib/supabase/browser";

/**
 * Keeps the organizer's guest list live: when a guest confirms or declines
 * (from the app, the web invite or the RSVP link), the server-rendered list is
 * refreshed in place, with no loader. RLS limits the stream to events this user
 * organizes. Several changes close together (a batch import) cause one refresh.
 */
export function GuestsLive({ eventId }: { eventId: string }) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refreshSoon = () => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 400);
    };

    const supabase = getBrowserClient();
    const channel = supabase
      .channel(`event_guests:${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_guests", filter: `event_id=eq.${eventId}` },
        refreshSoon,
      )
      .subscribe();

    return () => {
      if (timer !== null) clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [eventId, router]);

  return null;
}
