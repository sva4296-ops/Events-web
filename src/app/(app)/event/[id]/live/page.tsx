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
    return <LockedFeature owner={event.isOwner} message="Live nu este inclus în planul acestui eveniment." />;
  }

  return (
    <LiveUploader eventId={id} count={photos.length}>
      {photos.length === 0 ? (
        <EmptyState icon={Camera} message="Nicio poză încă. Fii primul!" />
      ) : (
        <PhotoGrid
          eventId={id}
          photos={photos}
          userId={user.id}
          isOwner={event.isOwner}
          columns="grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          mosaic="md:[&>*:first-child]:col-span-2 md:[&>*:first-child]:row-span-2"
        />
      )}
    </LiveUploader>
  );
}
