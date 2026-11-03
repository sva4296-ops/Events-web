"use client";

import { MessageCircleHeart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Message } from "@/lib/types";

import { ChatRoom } from "./ChatRoom";

/**
 * The event's chat, always a tap away on every tab: a round button at the
 * bottom right opening a panel (the whole screen on a phone). Messages load on
 * the first open, so the other tabs don't pay for them; the panel then stays
 * mounted, keeping its Realtime subscription and the draft while it's closed.
 */
export function ChatBubble({ eventId, userId, ownerId }: { eventId: string; userId: string; ownerId: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = async () => {
    const opening = !open;
    setOpen(opening);
    if (!opening || messages !== null) return;
    setFailed(false);
    const { data, error } = await getBrowserClient()
      .from("messages")
      .select("id, sender_id, sender_label, content, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });
    if (error) {
      setFailed(true);
      return;
    }
    setMessages(
      (data ?? []).map((row) => ({
        id: row.id,
        senderId: row.sender_id,
        senderLabel: row.sender_label,
        content: row.content,
        createdAt: row.created_at,
      })),
    );
  };

  // The full chat page is still there for old links: no second chat on top of it.
  if (pathname === `/event/${eventId}/chat`) return null;

  return (
    <>
      <section
        aria-label="Chatul evenimentului"
        hidden={!open}
        className={`fixed inset-0 z-50 flex-col overflow-hidden bg-surface md:inset-auto md:bottom-24 md:right-6 md:h-[min(620px,calc(100dvh-8rem))] md:w-[400px] md:rounded-3xl md:border md:border-surface-border md:shadow-[0_18px_50px_rgba(0,0,0,0.25)] ${
          open ? "flex" : "hidden"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-surface-border py-3.5 pl-5 pr-4">
          <div className="flex min-w-0 flex-col">
            <h2 className="font-theme text-xl leading-[26px]">Grupul evenimentului</h2>
            <p className="text-[13px] leading-[18px] text-muted">Invitații și organizatorul</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Închide chatul"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition hover:brightness-95"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        {messages !== null ? (
          <ChatRoom embedded eventId={eventId} userId={userId} ownerId={ownerId} initialMessages={messages} />
        ) : failed ? (
          <p role="alert" className="m-auto p-6 text-center text-sm text-danger">
            Mesajele nu au putut fi încărcate.
          </p>
        ) : (
          <div className="flex flex-col gap-3 p-4" role="status" aria-label="Se încarcă mesajele">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-12 w-1/2 self-end" />
            <Skeleton className="h-12 w-3/5" />
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={() => void toggle()}
        aria-label={open ? "Închide chatul" : "Deschide chatul"}
        aria-expanded={open}
        className="fixed bottom-[88px] right-4 z-40 flex size-[60px] items-center justify-center rounded-full bg-accent-fill text-on-accent shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition hover:brightness-105 active:scale-95 md:bottom-6 md:right-6"
      >
        {open ? <X size={24} aria-hidden="true" /> : <MessageCircleHeart size={26} strokeWidth={1.8} aria-hidden="true" />}
      </button>
    </>
  );
}
