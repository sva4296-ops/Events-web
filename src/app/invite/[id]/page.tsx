import { redirect } from "next/navigation";

import { AppBanner } from "@/components/AppBanner";
import { InviteCard } from "@/components/InviteCard";
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
    <div className="flex flex-col gap-8">
      <SiteHeader />
      {view === null ? (
        <div className="mx-auto w-full max-w-lg">
          <EmptyState message="Invitația nu a fost găsită. Verifică dacă ai intrat cu numărul de telefon pe care ai primit invitația." />
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-md items-start gap-6 md:max-w-2xl lg:max-w-none lg:grid-cols-5 lg:gap-10">
          <InviteCard
            className="lg:col-span-3"
            eventName={view.name}
            eventType={view.type}
            eventDate={view.date}
            location={view.location}
            welcomeMessage={view.welcomeMessage}
          />
          <aside className="flex flex-col gap-6 lg:sticky lg:top-10 lg:col-span-2">
            <div className="rounded-3xl lg:border lg:border-surface-border lg:bg-surface lg:p-6 lg:shadow-xl lg:shadow-black/5">
              <p className="mb-4 hidden font-display text-xl font-bold lg:block">Poți ajunge?</p>
              <UserRsvpForm eventId={id} eventName={view.name} status={view.status} />
            </div>
            <AppBanner />
          </aside>
        </div>
      )}
    </div>
  );
}
