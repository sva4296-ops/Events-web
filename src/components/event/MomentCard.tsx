"use client";

import { Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import { MomentMenu } from "@/components/event/MomentComposer";
import { toggleReaction } from "@/lib/actions/content";
import { timeAgo } from "@/lib/format";
import { isMomentIconId, MomentIcon } from "@/lib/momentIcons";
import type { Moment, ReactionType } from "@/lib/types";

interface ReactionState {
  love: { count: number; mine: boolean };
  celebrate: { count: number; mine: boolean };
}

export function MomentCard({
  eventId,
  moment,
  reactions,
  canEdit = false,
}: {
  eventId: string;
  moment: Moment;
  reactions: ReactionState;
  /** Own moment, or any moment for the primary owner (moments RLS). */
  canEdit?: boolean;
}) {
  const icon = isMomentIconId(moment.icon) ? moment.icon : null;
  const [, startTransition] = useTransition();
  const [optimistic, applyToggle] = useOptimistic(reactions, (state, type: ReactionType) => ({
    ...state,
    [type]: {
      mine: !state[type].mine,
      count: state[type].count + (state[type].mine ? -1 : 1),
    },
  }));

  const react = (type: ReactionType) => {
    const wasActive = optimistic[type].mine;
    startTransition(async () => {
      applyToggle(type);
      await toggleReaction(eventId, moment.id, type, wasActive);
    });
  };

  return (
    <article className="flex flex-col gap-3.5 rounded-[24px] border border-surface-border bg-surface p-4 shadow-card sm:p-5">
      {moment.photoUrl !== null ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote user photo, arbitrary host
        <img src={moment.photoUrl} alt="" className="aspect-[16/10] max-h-[480px] w-full rounded-[18px] bg-surface-2 object-cover" />
      ) : null}

      <header className="flex items-start gap-3">
        {moment.photoUrl === null ? (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent-text">
            {icon !== null ? <MomentIcon icon={icon} size={24} /> : <Sparkles size={22} aria-hidden="true" />}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="flex items-center gap-2 font-theme text-[24px] leading-[32px]">
            {moment.photoUrl !== null && icon !== null ? (
              <MomentIcon icon={icon} size={20} className="shrink-0 text-accent-text" />
            ) : null}
            <span className="min-w-0">{moment.title}</span>
          </h3>
          <p className="text-[13px] text-muted">{timeAgo(moment.createdAt)}</p>
        </div>
        {canEdit ? <MomentMenu eventId={eventId} moment={moment} /> : null}
      </header>

      <footer className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => react("love")}
          aria-pressed={optimistic.love.mine}
          aria-label="Reacționează cu inimă"
          className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold text-accent-text transition ${
            optimistic.love.mine ? "border-accent bg-accent-tint" : "border-transparent bg-accent-tint"
          }`}
        >
          <Heart size={15} fill={optimistic.love.mine ? "currentColor" : "none"} aria-hidden="true" />
          {optimistic.love.count}
        </button>
        <button
          type="button"
          onClick={() => react("celebrate")}
          aria-pressed={optimistic.celebrate.mine}
          aria-label="Reacționează cu felicitări"
          className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold text-pending transition ${
            optimistic.celebrate.mine ? "border-pending bg-pending-soft" : "border-transparent bg-pending-soft"
          }`}
        >
          <Star size={15} fill={optimistic.celebrate.mine ? "currentColor" : "none"} aria-hidden="true" />
          {optimistic.celebrate.count}
        </button>
        <Link
          href={`/event/${eventId}/chat`}
          className="ml-auto flex items-center gap-1.5 text-[13px] text-muted transition hover:text-accent-text"
        >
          <MessageCircle size={15} aria-hidden="true" />
          Comentarii
        </Link>
      </footer>
    </article>
  );
}
