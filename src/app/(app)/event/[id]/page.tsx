import Link from "next/link";

import { MomentCard } from "@/components/event/MomentCard";
import { NewMomentButton } from "@/components/event/MomentComposer";
import { StoryStages } from "@/components/event/StoryTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getDetails, getMoments } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { FUND_ENABLED } from "@/lib/features";
import { daysUntilEvent } from "@/lib/format";

export default async function AcasaPage({ params }: PageProps<"/event/[id]">) {
  const { id } = await params;
  // Page data starts in parallel with the access check (RLS guards it either way).
  const [{ user, event }, { moments, reactions }, details] = await Promise.all([
    getEventContext(id),
    getMoments(id),
    getDetails(id),
  ]);

  const stateFor = (momentId: string) => {
    const mine = (type: "love" | "celebrate") =>
      reactions.some((r) => r.momentId === momentId && r.type === type && r.userId === user.id);
    const count = (type: "love" | "celebrate") =>
      reactions.filter((r) => r.momentId === momentId && r.type === type).length;
    return {
      love: { count: count("love"), mine: mine("love") },
      celebrate: { count: count("celebrate"), mine: mine("celebrate") },
    };
  };

  return (
    <div className="flex flex-col gap-8">
    {/* The app's story timeline, right under the cover's countdown. */}
    <nav aria-label="Etapele poveștii" className="w-full max-w-[560px]">
      <StoryStages days={daysUntilEvent(event.date)} type={event.type} />
    </nav>
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
      <section className="flex min-w-0 flex-col gap-6" aria-labelledby="moments-title">
        <div className="flex items-center justify-between gap-3">
          <h2 id="moments-title" className={ui.title1}>
            Povestea noastră
          </h2>
          {event.isOwner && moments.length > 0 ? <NewMomentButton eventId={id} compact /> : null}
        </div>
        {moments.length === 0 ? (
          <EmptyState
            message="Niciun moment încă."
            action={event.isOwner ? <NewMomentButton eventId={id} /> : undefined}
          />
        ) : (
          moments.map((moment) => (
            <MomentCard
              key={moment.id}
              eventId={id}
              moment={moment}
              reactions={stateFor(moment.id)}
              canEdit={event.isPrimaryOwner || (event.isOwner && moment.authorId === user.id)}
            />
          ))
        )}
      </section>

      <aside className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-20">
        {event.welcomeMessage !== null ? (
          <blockquote className="font-theme text-[22px] leading-8">„{event.welcomeMessage}”</blockquote>
        ) : null}

        {details.schedule.length > 0 ? (
          <section aria-labelledby="schedule-title" className="flex flex-col">
            <h2 id="schedule-title" className={`${ui.eyebrow} mb-2`}>
              Programul zilei
            </h2>
            {details.schedule.slice(0, 4).map((item) => (
              <div key={item.id} className="flex gap-4 border-t border-surface-border py-3">
                <span className="w-[52px] shrink-0 font-theme text-lg text-accent-text">{item.time}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold">{item.title}</span>
                  {item.location.length > 0 ? <span className="text-[13px] leading-[18px] text-muted">{item.location}</span> : null}
                </span>
              </div>
            ))}
            <Link href={`/event/${id}/details`} className="mt-2 text-sm font-semibold text-accent-text">
              Vezi tot planul
            </Link>
          </section>
        ) : null}

        {FUND_ENABLED && details.fund !== null ? (
          <div className={`${ui.cardPadded} flex flex-col gap-3`}>
            <h3 className={ui.title2}>{details.fund.title}</h3>
            <p className="text-muted">
              Ne-ar bucura enorm să faceți parte din următorul capitol al poveștii noastre.
            </p>
            <Link href={`/event/${id}/fund`} className={ui.buttonGold}>
              Vezi fondul
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
    </div>
  );
}
