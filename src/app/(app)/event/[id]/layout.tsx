import { SiteHeader } from "@/components/SiteHeader";
import { getEventTypeMeta } from "@/lib/eventTypes";
import { getEventContext } from "@/lib/data/eventContext";
import { formatEventDate } from "@/lib/format";

import { TabNav } from "./TabNav";

export async function generateMetadata({ params }: LayoutProps<"/event/[id]">) {
  const { id } = await params;
  const { event } = await getEventContext(id);
  return { title: `${event.name} · PovesteaNoastra`, robots: { index: false, follow: false } };
}

export default async function EventLayout({ children, params }: LayoutProps<"/event/[id]">) {
  const { id } = await params;
  const { event } = await getEventContext(id);
  const type = getEventTypeMeta(event.type);
  const date = formatEventDate(event.date);

  return (
    <div className="flex flex-col gap-6 pb-28 md:gap-8 md:pb-0">
      <SiteHeader />

      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-md sm:h-16 sm:w-16 sm:text-3xl"
          style={{ background: `linear-gradient(135deg, ${type.light[0]}, ${type.light[1]})` }}
          aria-hidden="true"
        >
          {type.emoji}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold sm:text-4xl">{event.name}</h1>
          <p className="truncate text-sm text-muted first-letter:uppercase sm:text-base">
            {date ?? "Data va fi anunțată"}
            {event.location !== null ? ` · ${event.location}` : ""}
            {event.isOwner ? " · Organizator" : ""}
          </p>
        </div>
      </div>

      <TabNav eventId={id} />

      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
