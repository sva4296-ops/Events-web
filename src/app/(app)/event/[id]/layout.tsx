import { countdownFor } from "@/components/event/StoryTimeline";
import { EventCover } from "@/components/EventCover";
import { getEventContext } from "@/lib/data/eventContext";
import { eventAccentProps } from "@/lib/eventAccent";
import { daysUntilEvent, formatEventDate } from "@/lib/format";

import { ChatBubble } from "./chat/ChatBubble";
import { EventChrome } from "./EventChrome";
import { TabNav } from "./TabNav";

export async function generateMetadata({ params }: LayoutProps<"/event/[id]">) {
  const { id } = await params;
  const { event } = await getEventContext(id);
  return { title: `${event.name} · PovesteaNoastra`, robots: { index: false, follow: false } };
}

export default async function EventLayout({ children, params }: LayoutProps<"/event/[id]">) {
  const { id } = await params;
  const { user, event, capabilities } = await getEventContext(id);
  const accent = eventAccentProps(event.coverTheme);
  const meta = [
    formatEventDate(event.date) ?? "Data va fi anunțată",
    event.location,
    event.isPrimaryOwner ? "Organizator" : event.isOwner ? "Co-organizator" : null,
  ]
    .filter((part) => part !== null)
    .join(" · ");

  return (
    <div className={`flex flex-col pb-28 md:pb-0 ${accent.className}`} style={accent.style}>
      <EventChrome
        name={event.name}
        meta={meta}
        countdown={countdownFor(daysUntilEvent(event.date), event.type)}
        cover={
          <EventCover
            type={event.type}
            coverTheme={event.coverTheme}
            photoUrl={event.coverPhotoUrl}
            className="absolute! inset-0"
          />
        }
      />

      <TabNav eventId={id} isOwner={event.isOwner} />

      <div className="flex flex-col gap-6 pt-6 md:pt-10">{children}</div>

      {capabilities.chatEnabled ? <ChatBubble eventId={id} userId={user.id} ownerId={event.ownerId} /> : null}
    </div>
  );
}
