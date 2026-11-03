import { redirect } from "next/navigation";

import { AppBanner } from "@/components/AppBanner";
import { InviteSplit } from "@/components/InviteSplit";
import { SiteHeader } from "@/components/SiteHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth";
import { getMyEvent } from "@/lib/data/events";
import { createClient } from "@/lib/supabase/server";
import type { EventType, RsvpStatus } from "@/lib/types";

import { UserRsvpForm } from "./UserRsvpForm";

export const metadata = { title: "Invitație · PovesteaNoastra" };

interface PreviewRow {
  event_id: string;
  name: string;
  type: EventType;
  event_date: string | null;
  location: string | null;
  welcome_message: string | null;
  rsvp_status: RsvpStatus;
}

/** Signed-in RSVP screen — the web twin of the app's app/invite/[id].tsx. */
export default async function SignedInInvitePage({ params }: PageProps<"/invite/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/invite/${id}`);
  const event = await getMyEvent(id, user.id);

  if (event?.isOwner) redirect(`/event/${id}`);

  let view:
    | {
        name: string;
        type: EventType;
        date: string | null;
        location: string | null;
        welcomeMessage: string | null;
        status: RsvpStatus;
      }
    | null = null;

  if (event !== null) {
    view = {
      name: event.name,
      type: event.type,
      date: event.date,
      location: event.location,
      welcomeMessage: event.welcomeMessage,
      status: event.myGuest?.rsvp_status ?? "pending",
    };
  } else {
    // Not linked to this account yet — same get_invite_preview fallback as the app.
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_invite_preview", { p_event_id: id });
    const row = (data as PreviewRow[] | null)?.[0];
    if (row !== undefined) {
      view = {
        name: row.name,
        type: row.type,
        date: row.event_date,
        location: row.location?.trim() || null,
        welcomeMessage: row.welcome_message?.trim() || null,
        status: row.rsvp_status,
      };
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      {view === null ? (
        <div className="mx-auto mt-8 w-full max-w-lg">
          <EmptyState message="Invitația nu a fost găsită. Verifică dacă ai intrat cu numărul de telefon pe care ai primit invitația." />
        </div>
      ) : (
        <InviteSplit
          underHeader
          eventName={view.name}
          eventType={view.type}
          eventDate={view.date}
          location={view.location}
          welcomeMessage={view.welcomeMessage}
        >
          <UserRsvpForm eventId={id} eventName={view.name} status={view.status} />
          <AppBanner />
        </InviteSplit>
      )}
    </div>
  );
}
