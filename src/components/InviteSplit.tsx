import type { ReactNode } from "react";

import { BrandHeader } from "@/components/BrandMark";
import { EventCover } from "@/components/EventCover";
import { getEventTypeMeta } from "@/lib/eventTypes";
import { formatEventDate } from "@/lib/format";
import type { EventType } from "@/lib/types";

interface InviteSplitProps {
  eventName: string;
  eventType: EventType;
  eventDate: string | null;
  location: string | null;
  welcomeMessage: string | null;
  /** "Bună, Maria!" above the question; omitted when not given. */
  greeting?: string;
  hostName?: string | null;
  /** Under a SiteHeader: leave its height out and skip the wordmark on the cover. */
  underHeader?: boolean;
  /** The answer: the RSVP form and whatever goes under it. */
  children: ReactNode;
}

/** The invitation on one half of the window, the answer on the other. Shared by the token RSVP page and the signed-in one. */
export function InviteSplit({
  eventName,
  eventType,
  eventDate,
  location,
  welcomeMessage,
  greeting,
  hostName,
  underHeader = false,
  children,
}: InviteSplitProps) {
  const date = formatEventDate(eventDate);

  return (
    <div
      className={`full-bleed -mb-8 grid flex-1 lg:-mb-12 lg:grid-cols-2 ${underHeader ? "" : "-mt-8 lg:-mt-12"}`}
    >
      <section
        className={`relative flex min-h-[420px] flex-col justify-between overflow-hidden text-white lg:sticky ${
          underHeader ? "lg:top-[65px] lg:h-[calc(100dvh-65px)]" : "lg:top-0 lg:h-dvh"
        }`}
      >
        <EventCover type={eventType} className="absolute! inset-0" />
        {/* A dark scrim so the white text reads on any drawn cover. */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-black/60" />
        <div className="relative flex items-center justify-between gap-4 p-5 sm:px-8 lg:px-12 lg:py-8">
          {underHeader ? <span /> : <BrandHeader onCover />}
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2A211C]">
            {getEventTypeMeta(eventType).label}
          </span>
        </div>
        <div className="relative flex flex-col gap-3 p-5 sm:px-8 lg:p-12">
          {hostName ? (
            <p className="text-[13px] leading-[18px] font-semibold uppercase tracking-[1px] text-white/90">{hostName} te invită</p>
          ) : null}
          <h1 className="font-theme text-[42px] leading-[50px] tracking-[-0.5px] md:text-[64px] md:leading-[72px] xl:text-[80px] xl:leading-[88px] xl:tracking-[-1.5px]">
            {eventName}
          </h1>
          {welcomeMessage !== null ? (
            <p className="max-w-[520px] font-theme text-lg leading-7 text-white/95 md:text-[22px] md:leading-8">„{welcomeMessage}”</p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="rsvp-title" className="flex items-center justify-center px-4 py-10 sm:px-8 lg:p-12">
        <div className="flex w-full max-w-[440px] flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            {greeting !== undefined ? <p className="text-[15px] font-medium text-muted">{greeting}</p> : null}
            <h2 id="rsvp-title" className="font-theme text-[34px] leading-[42px] tracking-[-0.5px] md:text-[44px] md:leading-[52px]">
              Poți ajunge?
            </h2>
          </div>

          {date !== null || location !== null ? (
            <dl className="flex flex-col border-b border-surface-border">
              {date !== null ? (
                <div className="flex items-baseline gap-4 border-t border-surface-border py-3.5">
                  <dt className="w-[72px] shrink-0 text-[13px] text-muted">Când</dt>
                  <dd className="font-medium first-letter:uppercase">{date}</dd>
                </div>
              ) : null}
              {location !== null ? (
                <div className="flex items-baseline gap-4 border-t border-surface-border py-3.5">
                  <dt className="w-[72px] shrink-0 text-[13px] text-muted">Unde</dt>
                  <dd className="font-medium">{location}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {children}
        </div>
      </section>
    </div>
  );
}
