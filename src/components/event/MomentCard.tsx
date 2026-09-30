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
    <article className="overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-lg shadow-black/5">
      <header className="flex flex-col gap-1 px-5 pb-4 pt-5">
        <p className="text-xs text-muted">{timeAgo(moment.createdAt)}</p>
        <h3 className="font-display text-xl font-bold">{moment.title}</h3>
      </header>

      {moment.photoUrl !== null ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote user photo, arbitrary host
        <img src={moment.photoUrl} alt="" className="aspect-[4/3] max-h-[480px] w-full object-cover" />
      ) : (
        <div className="flex aspect-[16/7] flex-col items-center justify-center gap-2 bg-surface-muted text-muted">
          <ImageIcon size={28} aria-hidden="true" />
          <span className="text-sm">Fără fotografie</span>
        </div>
      )}

      <footer className="flex items-center gap-2 px-5 py-4">
        <button
          type="button"
          onClick={() => react("love")}
          aria-pressed={optimistic.love.mine}
          aria-label="Reacționează cu inimă"
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold text-accent-text transition ${
            optimistic.love.mine ? "border-accent bg-accent-soft" : "border-transparent bg-accent-soft/70"
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
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold text-[#B7862A] transition dark:text-gold ${
            optimistic.celebrate.mine ? "border-gold bg-gold/25" : "border-transparent bg-gold/15"
          }`}
        >
          <Star size={15} fill={optimistic.celebrate.mine ? "currentColor" : "none"} aria-hidden="true" />
          {optimistic.celebrate.count}
        </button>
        <Link
          href={`/event/${eventId}/chat`}
          className="ml-auto flex items-center gap-1.5 text-sm text-muted transition hover:text-accent-text"
        >
          <MessageCircle size={15} aria-hidden="true" />
          Comentarii
        </Link>
      </footer>
    </article>
  );
}
