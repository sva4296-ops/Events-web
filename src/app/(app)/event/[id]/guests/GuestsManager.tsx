"use client";

import { Check, Copy, Crown, FileUp, Pencil, Search, Send, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";

import { CountrySelect } from "@/components/CountrySelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { addGuest, addGuestsBatch, markInviteSent } from "@/lib/actions/guests";
import type { ManagedGuest } from "@/lib/data/guests";
import { pluralRo } from "@/lib/format";
import { parseGuestList, type ParseResult } from "@/lib/guestImport";
import {
  buildGuestInviteLink,
  buildGuestInviteMessage,
  whatsAppUrl,
  type InviteMessageEvent,
} from "@/lib/inviteMessage";
import { COUNTRY_CODES, DEFAULT_COUNTRY, formatStoredPhone, toStoredPhone } from "@/lib/phone";

import { GuestEditDialog } from "./GuestEditDialog";

type Filter = "all" | "toSend" | "sent" | "confirmed" | "declined" | "coOrganizers";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Toți" },
  { key: "toSend", label: "De trimis" },
  { key: "sent", label: "Trimise" },
  { key: "confirmed", label: "Confirmați" },
  { key: "declined", label: "Refuzați" },
  { key: "coOrganizers", label: "Co-organizatori" },
];

/** Same rule as the app's send-invites queue: pending, never sent, has a phone. */
const isToSend = (guest: ManagedGuest) => guest.status === "pending" && guest.sentAt === null && guest.phone !== null;

const STATUS_BADGE: Record<ManagedGuest["status"], { label: string; className: string }> = {
  confirmed: { label: "Confirmat", className: "bg-confirmed-soft text-confirmed" },
  declined: { label: "Refuzat", className: "bg-declined-soft text-declined" },
  pending: { label: "În așteptare", className: "bg-pending-soft text-pending" },
};

const chip =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export function GuestsManager({
  eventId,
  guests,
  messageEvent,
  maxGuests,
  canManageRoles,
}: {
  eventId: string;
  guests: ManagedGuest[];
  messageEvent: InviteMessageEvent;
  maxGuests: number | null;
  /** Primary owner only: co-organizers can't change roles (event_members RLS). */
  canManageRoles: boolean;
}) {
  const toSendCount = guests.filter(isToSend).length;
  const [filter, setFilter] = useState<Filter>(toSendCount > 0 ? "toSend" : "all");
  const [query, setQuery] = useState("");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const counts = {
    confirmed: guests.filter((g) => g.status === "confirmed").length,
    pending: guests.filter((g) => g.status === "pending").length,
    declined: guests.filter((g) => g.status === "declined").length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const digits = needle.replace(/\D/g, "");
    return guests.filter((guest) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "toSend" && isToSend(guest)) ||
        (filter === "sent" && guest.sentAt !== null) ||
        (filter === "coOrganizers" && guest.role === "co_organizer") ||
        guest.status === filter;
      if (!matchesFilter) return false;
      if (needle.length === 0) return true;
      return (
        (guest.name ?? "").toLowerCase().includes(needle) ||
        (digits.length > 0 && (guest.phone ?? "").includes(digits))
      );
    });
  }, [guests, filter, query]);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <section aria-labelledby="guests-title" className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="guests-title" className={ui.title1}>
              Invitați
            </h2>
            <p className="text-[15px] text-muted">
              {guests.length}
              {maxGuests !== null ? ` din ${maxGuests}` : ""} {pluralRo(guests.length, "invitat", "invitați", "de invitați")} ·{" "}
              {counts.confirmed} {pluralRo(counts.confirmed, "confirmat", "confirmați", "de confirmați")} · {counts.pending} în
              așteptare · {counts.declined} {pluralRo(counts.declined, "refuzat", "refuzați", "de refuzați")}
            </p>
          </div>
        </div>

        {toSendCount > 0 ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-surface-border bg-accent-tint px-4 py-3">
            <Send size={18} className="shrink-0 text-accent-text" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-[15px] text-ink">
              <strong>
                {toSendCount} {pluralRo(toSendCount, "invitație", "invitații", "de invitații")}
              </strong>{" "}
              de trimis. Fiecare se deschide în WhatsApp cu mesajul gata scris, tu doar apeși Send.
            </p>
            {filter !== "toSend" ? (
              <button type="button" onClick={() => setFilter("toSend")} className={`${chip} bg-accent-fill text-on-accent`}>
                Arată-le
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1" role="tablist" aria-label="Filtrează invitații">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`${chip} whitespace-nowrap ${
                  filter === key ? "bg-ink text-(--bg)" : "bg-surface-2 text-muted hover:text-ink"
                }`}
              >
                {label}
                {key === "toSend" && toSendCount > 0 ? <span className="opacity-70">{toSendCount}</span> : null}
              </button>
            ))}
          </div>
          <label className="relative sm:ml-auto sm:w-56">
            <span className="sr-only">Caută un invitat</span>
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută"
              className={`${ui.input} min-h-10 rounded-full pl-9 text-[15px]`}
            />
          </label>
        </div>

        {guests.length === 0 ? (
          <EmptyState icon={Users} message="Nu ai adăugat încă invitați. Adaugă-i unul câte unul sau lipește o listă întreagă." />
        ) : visible.length === 0 ? (
          <p className="py-6 text-center text-[15px] text-muted">
            {filter === "toSend" && query.length === 0 ? "Toate invitațiile au fost trimise. 🎉" : "Niciun invitat aici."}
          </p>
        ) : (
          <ul className={`${ui.card} divide-y divide-surface-border overflow-hidden`}>
            {visible.map((guest) => (
              <GuestRow
                key={guest.id}
                eventId={eventId}
                guest={guest}
                messageEvent={messageEvent}
                highlighted={guest.id === justAdded}
                canManageRoles={canManageRoles}
              />
            ))}
          </ul>
        )}
      </section>

      <AddGuestsPanel
        eventId={eventId}
        onAdded={(guestId) => {
          setJustAdded(guestId);
          setFilter("toSend");
          setQuery("");
        }}
      />
    </div>
  );
}

function GuestRow({
  eventId,
  guest,
  messageEvent,
  highlighted,
  canManageRoles,
}: {
  eventId: string;
  guest: ManagedGuest;
  messageEvent: InviteMessageEvent;
  highlighted: boolean;
  canManageRoles: boolean;
}) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  const message = buildGuestInviteMessage(guest.name ?? "", messageEvent, guest.inviteToken);
  const badge = STATUS_BADGE[guest.status];
  const sent = guest.sentAt !== null;
  // Someone who already answered doesn't need the invite again; their link is still copyable.
  const canSend = guest.phone !== null && guest.status === "pending";

  const confirmSent = () => {
    setError(null);
    startTransition(async () => {
      const result = await markInviteSent(eventId, guest.id);
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      setAsking(false);
      router.refresh();
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildGuestInviteLink(guest.inviteToken));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Nu am putut copia linkul.");
    }
  };

  return (
    <li className={`flex flex-col gap-3 px-4 py-3.5 sm:px-5 ${highlighted ? "bg-accent-tint/60" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[16px] font-semibold text-ink">{guest.name ?? "Fără nume"}</span>
            {guest.role === "co_organizer" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-tint px-2 py-0.5 text-xs font-semibold text-accent-text">
                <Crown size={12} aria-hidden="true" />
                Co-organizator
              </span>
            ) : null}
          </span>
          <span className="text-sm text-muted tabular-nums">
            {guest.phone !== null ? formatStoredPhone(guest.phone) : "Fără telefon"}
            {sent && guest.status === "pending" ? " · invitație trimisă" : ""}
          </span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>

        <div className="flex items-center gap-1.5">
          {canSend && guest.phone !== null ? (
            <>
              <a
                href={whatsAppUrl(guest.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAsking(true)}
                className={`${chip} ${sent ? "bg-surface-2 text-ink hover:brightness-95" : "bg-[#1FA855] text-white hover:brightness-105"}`}
              >
                <WhatsAppIcon />
                {sent ? "Retrimite" : "WhatsApp"}
              </a>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => void copyLink()}
            className={`${chip} bg-surface-2 px-2.5 text-muted hover:text-ink`}
            aria-label="Copiază linkul invitației"
            title="Copiază linkul invitației"
          >
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`${chip} bg-surface-2 px-2.5 text-muted hover:text-ink`}
            aria-label={`Editează ${guest.name ?? "invitatul"}`}
            title="Editează, schimbă rolul sau șterge"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {asking ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
          <p className="min-w-0 flex-1 text-sm text-ink">Ai trimis mesajul?</p>
          <button type="button" disabled={pending} onClick={confirmSent} className={`${chip} min-h-9 bg-accent-fill text-on-accent`}>
            {pending ? "Se salvează…" : "Da, trimis"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setAsking(false)}
            className={`${chip} min-h-9 text-muted hover:text-ink`}
          >
            Nu încă
          </button>
        </div>
      ) : null}
      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {editing ? (
        <GuestEditDialog eventId={eventId} eventName={messageEvent.name} guest={guest}
          canManageRoles={canManageRoles}
          onClose={() => setEditing(false)}
        />
      ) : null}
    </li>
  );
}

function AddGuestsPanel({ eventId, onAdded }: { eventId: string; onAdded: (guestId: string | null) => void }) {
  const [mode, setMode] = useState<"one" | "list">("one");
  return (
    <aside className={`${ui.cardPadded} flex flex-col gap-5 lg:sticky lg:top-20`} aria-label="Adaugă invitați">
      <div className="flex items-center gap-2">
        <UserPlus size={20} className="text-accent-text" aria-hidden="true" />
        <h3 className={ui.title2}>Adaugă invitați</h3>
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1" role="tablist">
        {(
          [
            ["one", "Unul câte unul"],
            ["list", "Listă sau fișier"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-10 rounded-full text-sm font-semibold transition ${
              mode === key ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "one" ? <SingleGuestForm eventId={eventId} onAdded={onAdded} /> : <BulkGuestForm eventId={eventId} onAdded={onAdded} />}
    </aside>
  );
}

function SingleGuestForm({ eventId, onAdded }: { eventId: string; onAdded: (guestId: string | null) => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY.iso);
  const [localNumber, setLocalNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length < 6) {
      setError("Introdu un număr de telefon valid.");
      return;
    }
    const dialCode = (COUNTRY_CODES.find((c) => c.iso === country) ?? DEFAULT_COUNTRY).dialCode;
    const addedName = name.trim();
    startTransition(async () => {
      const result = await addGuest(eventId, addedName, toStoredPhone(dialCode, localNumber));
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      setName("");
      setLocalNumber("");
      setNotice(`${addedName || "Invitatul"} e pe listă. Trimite-i invitația din listă.`);
      onAdded(result.guestId ?? null);
      router.refresh();
      nameRef.current?.focus();
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-2">
        <span className={ui.label}>Nume</span>
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Maria Popescu"
          autoComplete="off"
          className={ui.input}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={ui.label}>Telefon</span>
        <div className="flex gap-2">
          <CountrySelect iso={country} onChange={setCountry} />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="712 345 678"
            value={localNumber}
            onChange={(e) => setLocalNumber(e.target.value)}
            className={`${ui.input} flex-1`}
          />
        </div>
      </label>
      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {notice !== null ? (
        <p role="status" className="text-sm text-confirmed">
          {notice}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={ui.buttonPrimary}>
        {pending ? "Se adaugă…" : "Adaugă invitatul"}
      </button>
    </form>
  );
}

function BulkGuestForm({ eventId, onAdded }: { eventId: string; onAdded: (guestId: string | null) => void }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (value: string, file: string | null) => {
    setText(file === null ? value : "");
    setFileName(file);
    setRemoved(new Set());
    setNotice(null);
    setError(null);
    setParsed(value.trim().length > 0 ? parseGuestList(value) : null);
  };

  const onFile = async (file: File | undefined) => {
    if (file === undefined) return;
    if (file.size > 2_000_000) {
      setError("Fișierul e prea mare (maxim 2 MB).");
      return;
    }
    load(await file.text(), file.name);
    if (fileRef.current) fileRef.current.value = "";
  };

  const chosen = (parsed?.guests ?? []).filter((guest) => !removed.has(guest.phone));

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await addGuestsBatch(eventId, chosen);
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      const added = result.added ?? chosen.length;
      setNotice(`Am adăugat ${added} ${pluralRo(added, "invitat", "invitați", "de invitați")}. Acum trimite-le invitațiile din listă.`);
      setText("");
      setFileName(null);
      setParsed(null);
      onAdded(null);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-5 text-muted">
        Lipește lista, câte un invitat pe rând (<span className="text-ink">Maria Popescu, 0712 345 678</span>), sau încarcă
        un fișier CSV ori vCard exportat din Contacte sau Google Contacts.
      </p>
      <label className="flex flex-col gap-2">
        <span className="sr-only">Lista de invitați</span>
        <textarea
          value={text}
          onChange={(e) => load(e.target.value, null)}
          rows={6}
          placeholder={"Maria Popescu, 0712 345 678\nIon Ionescu 0745 111 222\n+44 7700 900123 Ana"}
          className={`${ui.input} min-h-36 py-3 font-mono text-sm leading-6`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} className={`${chip} bg-surface-2 text-ink hover:brightness-95`}>
          <FileUp size={16} aria-hidden="true" />
          Încarcă fișier
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.vcf,.vcard,.txt,text/csv,text/vcard,text/x-vcard,text/plain"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        {fileName !== null ? <span className="truncate text-sm text-muted">{fileName}</span> : null}
      </div>

      {parsed !== null ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ink">
            {chosen.length} {pluralRo(chosen.length, "invitat găsit", "invitați găsiți", "de invitați găsiți")}
            {parsed.skipped.length > 0 ? (
              <span className="font-normal text-muted">
                {" "}
                · {parsed.skipped.length} {pluralRo(parsed.skipped.length, "rând", "rânduri", "de rânduri")} fără număr valid
              </span>
            ) : null}
          </p>
          {chosen.length > 0 ? (
            <ul className="max-h-64 divide-y divide-surface-border overflow-y-auto rounded-2xl border border-surface-border">
              {chosen.map((guest) => (
                <li key={guest.phone} className="flex items-center gap-2 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate text-ink">{guest.name || "Fără nume"}</span>
                  <span className="shrink-0 text-muted tabular-nums">{formatStoredPhone(guest.phone)}</span>
                  <button
                    type="button"
                    onClick={() => setRemoved((current) => new Set(current).add(guest.phone))}
                    className="shrink-0 rounded-full p-1 text-faint hover:bg-surface-2 hover:text-ink"
                    aria-label={`Scoate ${guest.name || guest.phone} din listă`}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {parsed.skipped.length > 0 ? (
            <details className="text-sm text-muted">
              <summary className="cursor-pointer">Vezi rândurile sărite</summary>
              <ul className="mt-1 list-inside list-disc">
                {parsed.skipped.slice(0, 20).map((line, index) => (
                  <li key={index} className="truncate">
                    {line}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}

      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {notice !== null ? (
        <p role="status" className="text-sm text-confirmed">
          {notice}
        </p>
      ) : null}
      <button type="button" disabled={pending || chosen.length === 0} onClick={submit} className={ui.buttonPrimary}>
        {pending
          ? "Se adaugă…"
          : chosen.length > 0
            ? `Adaugă ${chosen.length} ${pluralRo(chosen.length, "invitat", "invitați", "de invitați")}`
            : "Adaugă invitații"}
      </button>
      <p className="text-xs leading-5 text-faint">
        Numerele fără prefix sunt citite ca românești. Un număr care e deja pe listă nu se dublează.
      </p>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm5.8 14.07c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.14.31-.29.48l-.43.5c-.14.15-.29.3-.12.6.17.29.75 1.24 1.61 2 1.1.98 2.04 1.29 2.33 1.43.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 2 .95.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
    </svg>
  );
}
