import { getEventTypeMeta } from "@/lib/eventTypes";
import { formatEventDate } from "@/lib/format";
import type { EventType } from "@/lib/types";

interface InviteCardProps {
  eventName: string;
  eventType: EventType;
  eventDate: string | null;
  location: string | null;
  welcomeMessage: string | null;
  /** "Bună, Maria!" line above the host line; omitted when not given. */
  greeting?: string;
  hostName?: string | null;
  className?: string;
}

/** The invitation itself — shared by the token RSVP page and the signed-in one. */
export function InviteCard({
  eventName,
  eventType,
  eventDate,
  location,
  welcomeMessage,
  greeting,
  hostName,
  className = "",
}: InviteCardProps) {
  const type = getEventTypeMeta(eventType);
  const date = formatEventDate(eventDate);

  return (
    <article
      className={`overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-xl shadow-black/5 ${className}`}
    >
      <div
        className="flex h-32 items-center justify-center text-6xl sm:h-44 sm:text-7xl lg:h-60 lg:text-8xl dark:hidden"
        style={{ background: `linear-gradient(135deg, ${type.light[0]}, ${type.light[1]})` }}
        aria-hidden="true"
      >
        {type.emoji}
      </div>
      <div
        className="hidden h-32 items-center justify-center text-6xl sm:h-44 sm:text-7xl lg:h-60 lg:text-8xl dark:flex"
        style={{ background: `linear-gradient(135deg, ${type.dark[0]}, ${type.dark[1]})` }}
        aria-hidden="true"
      >
        {type.emoji}
      </div>

      <div className="flex flex-col gap-5 px-6 pb-7 pt-6 sm:px-10 sm:pb-10 sm:pt-8 lg:gap-7">
        <div className="flex flex-col gap-1 lg:gap-2">
          {greeting !== undefined ? <p className="text-sm text-muted lg:text-base">{greeting}</p> : null}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent lg:text-sm">
            {hostName ? `${hostName} te invită` : type.label}
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{eventName}</h1>
        </div>

        {date !== null || location !== null ? (
          <dl className="flex flex-col gap-3 lg:text-lg">
            {date !== null ? (
              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-lg" aria-label="Data">📅</dt>
                <dd className="first-letter:uppercase">{date}</dd>
              </div>
            ) : null}
            {location !== null ? (
              <div className="flex items-start gap-3">
                <dt className="mt-0.5 text-lg" aria-label="Locația">📍</dt>
                <dd>{location}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {welcomeMessage !== null ? (
          <blockquote className="rounded-2xl bg-accent-soft px-4 py-3 font-display text-lg italic leading-snug sm:px-6 sm:py-5 lg:text-2xl">
            „{welcomeMessage}”
          </blockquote>
        ) : null}
      </div>
    </article>
  );
}
