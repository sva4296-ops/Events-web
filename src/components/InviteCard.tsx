import { EventTypeIcon } from "@/components/EventTypeIcon";
import { bandBackground, getEventTypeMeta } from "@/lib/eventTypes";
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
      className={`overflow-hidden rounded-[28px] border border-surface-border bg-surface shadow-card ${className}`}
    >
      {/* The band stays the same in both themes; text never sits on it except these white chips. */}
      <div
        className="relative flex h-[140px] items-center justify-center sm:h-44 lg:h-56"
        style={{ background: bandBackground(type) }}
      >
        <span className="absolute left-3.5 top-3.5 flex h-6 items-center rounded-full bg-white/90 px-2.5 text-xs font-semibold text-[#2B2740]">
          {type.label}
        </span>
        <span
          className="flex size-20 items-center justify-center rounded-full bg-white/90 text-[38px] lg:size-28 lg:text-5xl"
          aria-hidden="true"
        >
          <EventTypeIcon type={eventType} size={36} strokeWidth={1.6} className="text-[#2B2740] lg:size-12" />
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-5 text-center sm:px-10 sm:pb-9 sm:pt-7 lg:gap-3">
        {greeting !== undefined ? <p className="text-sm text-muted lg:text-base">{greeting}</p> : null}
        <h1 className="font-display text-[32px] font-bold leading-[1.15] sm:text-4xl lg:text-5xl">{eventName}</h1>
        {hostName ? (
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">
            {hostName} te invită
          </p>
        ) : null}
        {welcomeMessage !== null ? (
          <p className="mt-1.5 font-display text-[17px] italic leading-[1.45] lg:text-2xl">„{welcomeMessage}”</p>
        ) : null}

        {date !== null || location !== null ? (
          <>
            <div className="my-1.5 h-px self-stretch bg-surface-border" />
            <dl className="flex flex-col items-center gap-2 text-sm text-muted lg:text-base">
              {date !== null ? (
                <div className="flex items-center gap-2">
                  <dt aria-label="Data">
                    <CalendarIcon />
                  </dt>
                  <dd className="first-letter:uppercase">{date}</dd>
                </div>
              ) : null}
              {location !== null ? (
                <div className="flex items-center gap-2">
                  <dt aria-label="Locația">
                    <PinIcon />
                  </dt>
                  <dd>{location}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : null}
      </div>
    </article>
  );
}

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function CalendarIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
