import Link from "next/link";
import { redirect } from "next/navigation";

import { EventAgenda, type AgendaItem } from "@/components/events/EventAgenda";
import { NextEventCard } from "@/components/events/EventListCard";
import { SiteHeader } from "@/components/SiteHeader";
import { ui } from "@/components/ui/styles";
import { getProfile, getSessionUser } from "@/lib/auth";
import { getMyEvents } from "@/lib/data/events";
import { compareEventsByDate, daysUntilEvent, formatEventDate, todayLabel } from "@/lib/format";
import type { MyEvent } from "@/lib/types";

export const metadata = { title: "Evenimentele mele · PovesteaNoastra" };

/** Same rule as the app's Home: only the owner or a confirmed guest enters the event. */
function eventHref(event: MyEvent): string {
  return event.isOwner || event.myGuest?.rsvp_status === "confirmed" ? `/event/${event.id}` : `/invite/${event.id}`;
}

function isPast(event: MyEvent): boolean {
  const days = daysUntilEvent(event.date);
  return days !== null && days < 0;
}

/** Only what a row draws: a guest list has no business in the client payload. */
function toAgendaItem(event: MyEvent): AgendaItem {
  return {
    id: event.id,
    href: eventHref(event),
    type: event.type,
    name: event.name,
    date: event.date,
    location: event.location,
    coverTheme: event.coverTheme,
    coverPhotoUrl: event.coverPhotoUrl,
    isOwner: event.isOwner,
    isCoOrganizer: event.isOwner && !event.isPrimaryOwner,
    status: event.myGuest?.rsvp_status ?? null,
  };
}

export default async function EventsPage() {
  const user = await getSessionUser();
  if (user === null) redirect("/login?next=%2Fevents");
  // Name gate and events list in one parallel batch.
  const [profile, events] = await Promise.all([getProfile(user.id), getMyEvents(user.id)]);
  if (!profile?.firstName?.trim()) redirect("/welcome?next=%2Fevents");

  const sorted = [...events].sort(compareEventsByDate);
  const next = sorted.find(
    (event) => daysUntilEvent(event.date) !== null && !isPast(event) && event.myGuest?.rsvp_status !== "declined",
  );
  const coming = sorted.filter((event) => !isPast(event));
  const toAnswer = coming.filter((event) => event.myGuest?.rsvp_status === "pending");
  const past = sorted.filter(isPast);
  const hasRail = toAnswer.length > 0 || past.length > 0;

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <SiteHeader active="events" />

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted">{todayLabel()}</p>
        <h1 className="font-theme text-[34px] leading-[42px] tracking-[-0.5px] md:text-[44px] md:leading-[54px]">
          Bună{profile?.firstName ? `, ${profile.firstName}` : ""}.
        </h1>
      </div>

      {next !== undefined ? <NextEventCard event={next} href={eventHref(next)} /> : null}


      <div className={`grid items-start gap-10 lg:gap-12 ${hasRail ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
        <EventAgenda
          items={coming.filter((event) => event !== next).map(toAgendaItem)}
          hasOwned={events.some((event) => event.isOwner)}
          hasInvitations={events.some((event) => !event.isOwner)}
        />

        {hasRail ? (
          <aside className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-24">
            {toAnswer.length > 0 ? (
              <section aria-labelledby="answer-title" className={`${ui.cardPadded} flex flex-col gap-5`}>
                <h2 id="answer-title" className={ui.title2}>
                  Așteaptă răspunsul tău
                </h2>
                {toAnswer.map((event) => (
                  <div key={event.id} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-theme text-xl leading-[26px]">{event.name}</p>
                      <p className="text-sm text-muted first-letter:uppercase">
                        {formatEventDate(event.date) ?? "Data va fi anunțată"}
                      </p>
                    </div>
                    <Link href={eventHref(event)} className={`${ui.buttonPrimary} min-h-12`}>
                      Răspunde
                    </Link>
                  </div>
                ))}
              </section>
            ) : null}

            {past.length > 0 ? (
              <section aria-labelledby="past-title" className="flex flex-col">
                <h2 id="past-title" className={`${ui.eyebrow} mb-2`}>
                  S-au încheiat
                </h2>
                {past.map((event) => (
                  <Link key={event.id} href={eventHref(event)} className="group flex flex-col gap-0.5 border-t border-surface-border py-3">
                    <span className="truncate font-theme text-[17px] leading-6 transition group-hover:text-accent-text">
                      {event.name}
                    </span>
                    <span className="truncate text-[13px] leading-[18px] text-muted first-letter:uppercase">
                      {formatEventDate(event.date)}
                      {event.location !== null ? ` · ${event.location}` : ""}
                    </span>
                  </Link>
                ))}
              </section>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
