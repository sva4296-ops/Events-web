import { redirect } from "next/navigation";

import { getEventContext } from "@/lib/data/eventContext";
import { getGuestsPageData } from "@/lib/data/guests";

import { GuestsLive } from "./GuestsLive";
import { GuestsManager } from "./GuestsManager";

export default async function GuestsPage({ params }: PageProps<"/event/[id]/guests">) {
  const { id } = await params;
  const { event, capabilities } = await getEventContext(id);
  if (!event.isOwner) redirect(`/event/${id}`);

  const { guests, messageEvent } = await getGuestsPageData(id);
  return (
    <>
      <GuestsLive eventId={id} />
      <GuestsManager eventId={id} guests={guests} messageEvent={messageEvent} maxGuests={capabilities.maxGuests}
        canManageRoles={event.isPrimaryOwner}
      />
    </>
  );
}
