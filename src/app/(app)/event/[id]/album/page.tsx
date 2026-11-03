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
  // Only the owner's session can see every guest row (RLS), so only they get a real count.
  const attendees = event.isOwner ? event.guests.filter((guest) => guest.rsvp_status === "confirmed").length : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className={ui.eyebrow}>Povestea s-a întâmplat</p>
          <h2 className="font-theme text-[34px] leading-[42px] tracking-[-0.5px] md:text-[44px] md:leading-[52px]">A fost minunat</h2>
          <p className="text-[15px] text-muted">
            {photos.length} {pluralRo(photos.length, "poză", "poze", "de poze")}
            {attendees !== null ? ` · ${attendees} ${pluralRo(attendees, "invitat prezent", "invitați prezenți", "de invitați prezenți")}` : ""}
          </p>
        </div>
        {event.albumStatus !== "ready" ? (
          <p className="max-w-xs text-sm text-muted">Albumul complet va putea fi descărcat la 3 zile după eveniment.</p>
        ) : fullUrls.length > 0 ? (
          <div className="w-full sm:w-auto">
            <DownloadAll urls={fullUrls} eventName={event.name} />
          </div>
        ) : null}
      </div>

      {photos.length === 0 ? (
        <EmptyState message="Nicio poză încă. Pozele adăugate în Live apar aici." />
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
