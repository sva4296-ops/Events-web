import { CalendarHeart, Mail } from "lucide-react";
import { redirect } from "next/navigation";

import { EventListCard } from "@/components/events/EventListCard";
import { SiteHeader } from "@/components/SiteHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProfile, getSessionUser } from "@/lib/auth";
import { getMyEvents } from "@/lib/data/events";

export const metadata = { title: "Evenimentele mele · PovesteaNoastra" };

export default async function EventsPage() {
  const user = await getSessionUser();
  if (user === null) redirect("/login?next=%2Fevents");
  // Name gate and events list in one parallel batch.
  const [profile, events] = await Promise.all([getProfile(user.id), getMyEvents(user.id)]);
  if (!profile?.firstName?.trim()) redirect("/welcome?next=%2Fevents");

  const invitations = events.filter((event) => !event.isOwner);
  const owned = events.filter((event) => event.isOwner);

  return (
    <div className="flex flex-col gap-10">
      <SiteHeader />

      <div className="flex flex-col gap-2">
        <p className="text-muted">Bună{profile?.firstName ? `, ${profile.firstName}` : ""}!</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Mai mult decât o invitație, întreaga poveste.</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section className="flex min-w-0 flex-col gap-4" aria-labelledby="invitations-title">
          <div>
            <h2 id="invitations-title" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Invitațiile mele
            </h2>
            <p className="text-sm text-muted">Evenimente la care ai fost invitat.</p>
          </div>
          {invitations.length === 0 ? (
            <EmptyState icon={Mail} message="Nicio invitație încă. Când cineva te invită, apare aici." />
          ) : (
            invitations.map((event) => (
              <EventListCard
                key={event.id}
                event={event}
                // Same rule as the app's Home: only a confirmed guest enters the event.
                href={event.myGuest?.rsvp_status === "confirmed" ? `/event/${event.id}` : `/invite/${event.id}`}
              />
            ))
          )}
        </section>

        <section className="flex min-w-0 flex-col gap-4" aria-labelledby="owned-title">
          <div>
            <h2 id="owned-title" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Evenimentele tale
            </h2>
            <p className="text-sm text-muted">Evenimente pe care le găzduiești.</p>
          </div>
          {owned.length === 0 ? (
            <EmptyState
              icon={CalendarHeart}
              message="Nu organizezi încă niciun eveniment. Crearea de evenimente vine în curând pe web; până atunci, o poți face din aplicație."
            />
          ) : (
            owned.map((event) => <EventListCard key={event.id} event={event} href={`/event/${event.id}`} />)
          )}
        </section>
      </div>
    </div>
  );
}
