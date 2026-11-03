import { Camera } from "lucide-react";

import { LockedFeature } from "@/components/event/LockedFeature";
import { PhotoGrid } from "@/components/event/PhotoGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getPhotos } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { pluralRo } from "@/lib/format";

import { LiveUploader } from "./LiveUploader";

export default async function LivePage({ params }: PageProps<"/event/[id]/live">) {
  const { id } = await params;
  const [{ user, event, capabilities }, photos] = await Promise.all([getEventContext(id), getPhotos(id)]);

  if (!capabilities.liveScreenEnabled) {
    return <LockedFeature owner={event.isOwner} message="Ecranul Live nu este inclus în planul curent al acestui eveniment." />;
  }


  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
      <section className="flex min-w-0 flex-col gap-5" aria-labelledby="live-title">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8524F] opacity-60" />
            <span className="relative inline-flex size-3 rounded-full bg-[#E8524F]" />
          </span>
          <h2 id="live-title" className={ui.title1}>
            Live · {photos.length} {pluralRo(photos.length, "poză", "poze", "de poze")}
          </h2>
        </div>
        {photos.length === 0 ? (
          <EmptyState icon={Camera} message="Nicio poză încă. Fii primul care adaugă una!" />
        ) : (
          <PhotoGrid
            eventId={id}
            photos={photos}
            userId={user.id}
            isOwner={event.isOwner}
            columns="grid-cols-3 md:grid-cols-4"
            mosaic="md:[&>*:first-child]:col-span-2 md:[&>*:first-child]:row-span-2"
          />
        )}
      </section>

      <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-20 lg:order-none">
        <LiveUploader eventId={id} />
        <p className="text-sm leading-5 text-muted">
          Toți invitații adaugă poze în timp real. Le vezi aici imediat, iar după eveniment ajung în album.
        </p>
      </aside>
    </div>
  );
}
