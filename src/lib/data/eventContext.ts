import "server-only";

import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { getProfile, getSessionUser, type SessionUser } from "@/lib/auth";
import { getMyEvent, getPlanCatalog, pickCapabilities } from "@/lib/data/events";
import type { MyEvent, PlanCapabilities } from "@/lib/types";

export interface EventContext {
  user: SessionUser;
  event: MyEvent;
  capabilities: PlanCapabilities;
}

/**
 * Everything an /event/[id] page needs, with the same access rule as the app:
 * the owner always gets in; a guest only once they've confirmed. Cached per
 * request, so the layout and the page share one fetch.
 */
export const getEventContext = cache(async (eventId: string): Promise<EventContext> => {
  const nextPath = `/event/${eventId}`;
  const user = await getSessionUser();
  if (user === null) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  // One parallel batch instead of a waterfall: name gate, the event, the plan catalog.
  const [profile, event, catalog] = await Promise.all([
    getProfile(user.id),
    getMyEvent(eventId, user.id),
    getPlanCatalog(),
  ]);

  if (!profile?.firstName?.trim()) redirect(`/welcome?next=${encodeURIComponent(nextPath)}`);
  if (event === null) {
    // Maybe an invite not linked to this account yet: the RSVP page handles that.
    redirect(`/invite/${eventId}`);
  }
  if (!event.isOwner && event.myGuest?.rsvp_status !== "confirmed") {
    redirect(`/invite/${eventId}`);
  }
  return { user, event, capabilities: pickCapabilities(catalog, event.planTier) };
});

export function assertEvent(event: MyEvent | null): asserts event is MyEvent {
  if (event === null) notFound();
}
