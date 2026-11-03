import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { EventCover } from "@/components/EventCover";
import { getEventTypeMeta } from "@/lib/eventTypes";
import { daysUntilEvent, formatEventDate } from "@/lib/format";
import type { MyEvent } from "@/lib/types";

/** The soonest event, across the page: its cover, name, and the days left at the size of a headline. */
export function NextEventCard({ event, href }: { event: MyEvent; href: string }) {
  const days = daysUntilEvent(event.date);
  const toAnswer = event.myGuest?.rsvp_status === "pending";

  return (
    <Link href={href} className="group relative block overflow-hidden rounded-4xl text-white shadow-card">
      <EventCover
        type={event.type}
        coverTheme={event.coverTheme}
        photoUrl={event.coverPhotoUrl}
        className="absolute! inset-0"
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-30% to-black/60" />
      <div className="relative flex min-h-[340px] flex-col justify-between gap-10 p-5 sm:p-8 lg:min-h-[400px] lg:px-11 lg:py-10">
        <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#2A211C]">
          <span className="rounded-full bg-white/90 px-3 py-1">Urmează</span>
          <span className="rounded-full bg-white/90 px-3 py-1">{getEventTypeMeta(event.type).label}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6 lg:gap-8">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2">
            <h2 className="font-theme text-[38px] leading-[46px] tracking-[-0.5px] md:text-[64px] md:leading-[72px] md:tracking-[-1px]">
              {event.name}
            </h2>
            <p className="text-white/90 first-letter:uppercase">
              {formatEventDate(event.date)}
              {event.location !== null ? ` · ${event.location}` : ""}
            </p>
            <span className="mt-4 inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-white px-[22px] font-semibold text-[#2A211C]">
              {toAnswer ? "Răspunde la invitație" : "Deschide evenimentul"}
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
          {days !== null ? (
            days === 0 ? (
              <span className="font-theme text-[56px] leading-[60px] md:text-[80px] md:leading-[84px]">Azi</span>
            ) : (
              <span className="flex items-end gap-3">
                <span className="font-theme text-[72px] leading-[64px] tracking-[-2px] md:text-[112px] md:leading-[96px] md:tracking-[-3px]">
                  {days}
                </span>
                <span className="text-[15px] leading-5 text-white/90">
                  {days === 1 ? "zi" : "zile"}
                  <br />
                  {days === 1 ? "rămasă" : "rămase"}
                </span>
              </span>
            )
          ) : null}
        </div>
      </div>
    </Link>
  );
}
