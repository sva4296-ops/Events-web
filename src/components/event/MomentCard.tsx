"use client";

import { Heart, ImageIcon, MessageCircle, Star } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import { toggleReaction } from "@/lib/actions/content";
import { timeAgo } from "@/lib/format";
import type { Moment, ReactionType } from "@/lib/types";

interface ReactionState {
  love: { count: number; mine: boolean };
  celebrate: { count: number; mine: boolean };
}

export function MomentCard({
  eventId,
  moment,
  reactions,
}: {
  eventId: string;
  moment: Moment;
  reactions: ReactionState;
}) {
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
      ) : (
        <div className="flex aspect-[16/7] flex-col items-center justify-center gap-2 rounded-[18px] bg-surface-2 text-muted">
          <ImageIcon size={28} aria-hidden="true" />
          <span className="text-[13px]">Fără fotografie</span>
        </div>
      )}

      <header className="flex flex-col gap-0.5">
        <h3 className="font-theme text-[26px] leading-[34px]">{moment.title}</h3>
        <p className="text-[13px] text-muted">{timeAgo(moment.createdAt)}</p>
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
