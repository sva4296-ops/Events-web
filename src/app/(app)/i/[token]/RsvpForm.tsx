"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { RsvpStatus } from "@/lib/invites";

import { submitRsvp, type RsvpActionState } from "./actions";

interface RsvpFormProps {
  token: string;
  status: RsvpStatus;
  eventName: string;
  eventId: string | null;
}

const INITIAL_STATE: RsvpActionState = { error: null };

export function RsvpForm({ token, status, eventName, eventId }: RsvpFormProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (previous: RsvpActionState, formData: FormData) => {
      const next = await submitRsvp(token, previous, formData);
      if (next.error === null) setEditing(false);
      return next;
    },
    INITIAL_STATE,
  );

  if (status !== "pending" && !editing) {
    const confirmed = status === "confirmed";
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`w-full rounded-2xl px-5 py-5 ${confirmed ? "bg-confirmed-soft" : "bg-declined-soft"}`}
        >
          <p className={`text-lg font-semibold ${confirmed ? "text-confirmed" : "text-declined"}`}>
            {confirmed ? "Ne vedem acolo! 🎉" : "Mulțumim că ne-ai anunțat"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {confirmed
              ? `Ți-ai confirmat prezența la ${eventName}.`
              : `Ai răspuns că nu poți ajunge la ${eventName}. Ne vei lipsi.`}
          </p>
        </div>
        {confirmed && eventId !== null ? (
          <Link
            href={`/login?next=${encodeURIComponent(`/event/${eventId}`)}`}
            className="flex h-[54px] w-full items-center justify-center rounded-full bg-accent-fill px-6 text-base font-semibold text-on-accent shadow-[0_8px_20px_rgba(106,97,209,0.28)] transition active:scale-[0.98] dark:shadow-none"
          >
            Vezi evenimentul pe web
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="min-h-11 text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          Schimbă răspunsul
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <button
        type="submit"
        name="status"
        value="confirmed"
        disabled={pending}
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-accent-fill px-6 text-base font-semibold text-on-accent shadow-[0_8px_20px_rgba(106,97,209,0.28)] transition active:scale-[0.98] disabled:bg-surface-2 disabled:text-faint disabled:shadow-none dark:shadow-none"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {pending ? "Se salvează…" : "Confirm prezența"}
      </button>
      <button
        type="submit"
        name="status"
        value="declined"
        disabled={pending}
        className="flex h-[54px] w-full items-center justify-center rounded-full border-[1.5px] border-surface-border bg-surface px-6 text-base font-semibold text-ink transition active:scale-[0.98] disabled:opacity-60"
      >
        Nu pot ajunge
      </button>
      {editing ? (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="min-h-11 text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          Renunță
        </button>
      ) : null}
      {state.error !== null ? (
        <p role="alert" className="text-center text-sm text-declined">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
