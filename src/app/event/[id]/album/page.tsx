import { PhotoGrid } from "@/components/event/PhotoGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getPhotos } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";

import { DownloadAll } from "./DownloadAll";

export default async function AlbumPage({ params }: PageProps<"/event/[id]/album">) {
  const { id } = await params;
  const [{ user, event }, photos] = await Promise.all([getEventContext(id), getPhotos(id)]);
  const fullUrls = photos.map((photo) => photo.fullUrl).filter((url): url is string => url !== null);
  // Only the owner's session can see every guest row (RLS), so only they get a real count.
  const attendees = event.isOwner ? event.guests.filter((guest) => guest.rsvp_status === "confirmed").length : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <p className={ui.eyebrow}>Povestea s-a întâmplat</p>
        <h2 className="font-display text-4xl italic sm:text-5xl">A fost minunat</h2>
      </div>

      <div className={`mx-auto grid w-full max-w-xl gap-4 ${attendees !== null ? "grid-cols-2" : "grid-cols-1"}`}>
        {attendees !== null ? (
          <div className={`${ui.cardPadded} text-center`}>
            <p className="font-display text-4xl font-bold text-accent">{attendees}</p>
            <p className="text-sm text-muted">invitați prezenți</p>
          </div>
        ) : null}
        <div className={`${ui.cardPadded} text-center`}>
          <p className="font-display text-4xl font-bold text-accent">{photos.length}</p>
          <p className="text-sm text-muted">poze adunate</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-2xl font-bold">Albumul vostru</h3>
        {photos.length === 0 ? (
          <EmptyState message="Nicio poză încă. Pozele adăugate în Live apar aici." />
        ) : (
          <PhotoGrid eventId={id} photos={photos} userId={user.id} isOwner={event.isOwner} />
        )}
      </section>

      <div className="mx-auto w-full max-w-md">
        {event.albumStatus !== "ready" ? (
          <p className="text-center text-sm text-muted">
            Albumul complet va putea fi descărcat la 3 zile după eveniment.
          </p>
        ) : fullUrls.length > 0 ? (
          <DownloadAll urls={fullUrls} eventName={event.name} />
        ) : null}
      </div>
    </div>
  );
}
