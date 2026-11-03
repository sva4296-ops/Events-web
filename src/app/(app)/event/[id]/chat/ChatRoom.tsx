"use client";

import { Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";

import { deleteMessage, sendMessage } from "@/lib/actions/content";
import { timeOfDay } from "@/lib/format";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Message } from "@/lib/types";

interface MessageRow {
  id: string;
  sender_id: string;
  sender_label: string;
  content: string;
  created_at: string;
}

function initials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function mapRow(row: MessageRow): Message {
  return {
    id: row.id,
    senderId: row.sender_id,
    senderLabel: row.sender_label,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function ChatRoom({
  eventId,
  userId,
  ownerId,
  initialMessages,
  embedded = false,
}: {
  eventId: string;
  userId: string;
  ownerId: string;
  initialMessages: Message[];
  /** Inside the chat bubble's panel, which draws the frame and sets the height. */
  embedded?: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  // Same Realtime subscription as the app's chat.tsx: INSERTs on this event's messages.
  useEffect(() => {
    const supabase = getBrowserClient();
    const channel = supabase
      .channel(`messages:${eventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `event_id=eq.${eventId}` },
        (payload) => {
          const incoming = mapRow(payload.new as MessageRow);
          setMessages((current) => (current.some((m) => m.id === incoming.id) ? current : [...current, incoming]));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const removedId = (payload.old as { id?: string }).id;
          if (removedId !== undefined) setMessages((current) => current.filter((m) => m.id !== removedId));
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [eventId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (text.length === 0) return;
    setDraft("");
    setError(null);
    startTransition(async () => {
      const result = await sendMessage(eventId, text);
      if (result.error !== null) {
        setError(result.error);
        setDraft(text);
      }
    });
  };

  const remove = (messageId: string) => {
    setMessages((current) => current.filter((m) => m.id !== messageId));
    startTransition(() => deleteMessage(messageId));
  };

  return (
    <div
      className={
        embedded
          ? "flex min-h-0 flex-1 flex-col"
          : "flex h-[calc(100dvh-13rem)] min-h-[380px] flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface shadow-card md:h-[calc(100dvh-11rem)]"
      }
    >
      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <p className="m-auto text-center text-muted">Niciun mesaj încă. Scrie primul!</p>
        ) : (
          messages.map((message) => {
            const own = message.senderId === userId;
            const organizer = message.senderId === ownerId;
            return (
              <div key={message.id} className={`group flex flex-col gap-1 ${own ? "items-end" : "items-start"}`}>
                <span className="px-1 text-xs text-muted">
                  {own ? "Tu" : message.senderLabel}
                  {organizer ? " · Organizator" : ""} · {timeOfDay(message.createdAt)}
                </span>
                <div className={`flex max-w-[85%] items-end gap-2 ${own ? "flex-row-reverse" : ""}`}>
                  {!own ? (
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-tint text-xs font-semibold text-accent-text"
                      aria-hidden="true"
                    >
                      {initials(message.senderLabel)}
                    </span>
                  ) : null}
                  <p
                    className={`min-w-0 whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2.5 ${
                      own
                        ? "rounded-br-md bg-accent-fill text-on-accent"
                        : "rounded-bl-md border border-surface-border bg-(--bg)"
                    }`}
                  >
                    {message.content}
                  </p>
                  {own ? (
                    <button
                      type="button"
                      onClick={() => remove(message.id)}
                      className="rounded-full p-1.5 text-muted opacity-100 transition hover:text-danger sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Șterge mesajul"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={submit} className="flex items-end gap-2 border-t border-surface-border p-3 sm:p-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={1}
          placeholder="Scrie un mesaj…"
          aria-label="Mesaj"
          className="max-h-32 min-h-12 flex-1 resize-none rounded-3xl border-[1.5px] border-surface-border bg-surface px-4 py-2.5 outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent-tint"
        />
        <button
          type="submit"
          disabled={pending || draft.trim().length === 0}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-fill text-on-accent transition disabled:bg-surface-2 disabled:text-faint"
          aria-label="Trimite"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
      {error !== null ? (
        <p role="alert" className="px-4 pb-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
