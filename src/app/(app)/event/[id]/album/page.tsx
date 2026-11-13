import { Images } from "lucide-react";

import { PhotoGrid } from "@/components/event/PhotoGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getPhotos } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { pluralRo } from "@/lib/format";

import { DownloadAll } from "./DownloadAll";

export default async function AlbumPage({ params }: PageProps<"/event/[id]/album">) {
  const { id } = await params;
  const [{ user, event }, photos] = await Promise.all([getEventContext(id), getPhotos(id)]);
  const fullUrls = photos.map((photo) => photo.fullUrl).filter((url): url is string => url !== null);
  const canDownload = event.albumStatus === "ready" && fullUrls.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className={ui.title1}>Album</h2>
          <p className="text-[13px] text-muted">
            {photos.length} {pluralRo(photos.length, "poză", "poze", "de poze")}
            {event.albumStatus !== "ready" && photos.length > 0 ? " · descărcare după eveniment" : ""}
          </p>
        </div>
        {canDownload ? <DownloadAll urls={fullUrls} eventName={event.name} /> : null}
      </div>

      {photos.length === 0 ? (
        <EmptyState icon={Images} message="Nicio poză încă." />
      ) : (
        <PhotoGrid
          eventId={id}
          photos={photos}
          userId={user.id}
          isOwner={event.isOwner}
          columns="grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          mosaic="md:[&>*:nth-child(7n+1)]:col-span-2 md:[&>*:nth-child(7n+1)]:row-span-2"
        />
      )}
    </div>
  );
}
