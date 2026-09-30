"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { ui } from "@/components/ui/styles";
import { respondAsUser, type RsvpState } from "@/lib/actions/rsvp";
import type { RsvpStatus } from "@/lib/types";

export function UserRsvpForm({
  eventId,
  eventName,
  status,
}: {
  eventId: string;
  eventName: string;
  status: RsvpStatus;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: RsvpState, formData: FormData) => {
      const next = await respondAsUser(eventId, prev, formData);
      if (next.error === null) setEditing(false);
      return next;
    },
    { error: null },
  );

  if (status !== "pending" && !editing) {
    const confirmed = status === "confirmed";
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`w-full rounded-2xl px-5 py-5 ${confirmed ? "bg-confirmed-soft" : "bg-declined-soft"}`}>
          <p className={`mt-1 text-lg font-semibold ${confirmed ? "text-confirmed" : "text-declined"}`}>
            {confirmed ? "Ești pe listă!" : "Mulțumim că ne-ai anunțat"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {confirmed
              ? `Abia așteptăm să te vedem la ${eventName}.`
              : `Ne va fi dor de tine la ${eventName}.`}
          </p>
        </div>
        {confirmed ? (
          <Link href={`/event/${eventId}`} className={`${ui.buttonPrimary} w-full`}>
            Deschide pagina evenimentului
          </Link>
        ) : null}
        <button type="button" onClick={() => setEditing(true)} className="text-sm font-semibold text-accent-text">
          Schimbă răspunsul
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <button type="submit" name="status" value="confirmed" disabled={pending} className={ui.buttonPrimary}>
        {pending ? "Se salvează…" : "Confirmă participarea"}
      </button>
      <button type="submit" name="status" value="declined" disabled={pending} className={ui.buttonSoft}>
        Nu pot participa
      </button>
      {editing ? (
        <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted">
          Renunță
        </button>
      ) : null}
      {state.error !== null ? (
        <p role="alert" className="text-center text-sm text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
