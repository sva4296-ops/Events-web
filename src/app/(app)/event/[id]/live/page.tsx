import { Camera } from "lucide-react";

import { LockedFeature } from "@/components/event/LockedFeature";
import { PhotoGrid } from "@/components/event/PhotoGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPhotos } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";

import { LiveUploader } from "./LiveUploader";

export default async function LivePage({ params }: PageProps<"/event/[id]/live">) {
  const { id } = await params;
  const [{ user, event, capabilities }, photos] = await Promise.all([getEventContext(id), getPhotos(id)]);

  if (!capabilities.liveScreenEnabled) {
    return <LockedFeature owner={event.isOwner} message="Ecranul Live nu este inclus în planul curent al acestui eveniment." />;
  }


  return (
    <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-8 lg:order-2">
        <div className="flex flex-col gap-4 rounded-3xl bg-[#1B2237] p-6 text-white shadow-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8524F] opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#E8524F]" />
            </span>
            <span className="text-sm font-bold tracking-widest">LIVE</span>
          </div>
          <p className="font-display text-2xl font-bold">{photos.length} poze adunate</p>
          <p className="text-sm text-white/70">
            Toți invitații adaugă poze în timp real. Le vezi aici imediat, iar după eveniment ajung în album.
          </p>
        </div>
        <LiveUploader eventId={id} />
      </aside>

      <section className="min-w-0 lg:order-1 lg:col-span-2">
        {photos.length === 0 ? (
          <EmptyState icon={Camera} message="Nicio poză încă. Fii primul care adaugă una!" />
        ) : (
          <PhotoGrid eventId={id} photos={photos} userId={user.id} isOwner={event.isOwner} />
        )}
      </section>
    </div>
  );
}
