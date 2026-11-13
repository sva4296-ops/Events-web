"use client";

import { Crown, Trash2, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";

import { CountrySelect } from "@/components/CountrySelect";
import { ui } from "@/components/ui/styles";
import { removeGuest, setGuestRole, updateGuest } from "@/lib/actions/guests";
import type { ManagedGuest } from "@/lib/data/guests";
import { buildCoOrganizerMessage, whatsAppUrl } from "@/lib/inviteMessage";
import { COUNTRY_CODES, DEFAULT_COUNTRY, splitStoredPhone, toStoredPhone } from "@/lib/phone";

type Role = ManagedGuest["role"];

const ROLES: { key: Role; label: string; hint: string; icon: typeof User }[] = [
  { key: "guest", label: "Invitat", hint: "Confirmă, vede detaliile, albumul și live-ul.", icon: User },
  {
    key: "co_organizer",
    label: "Co-organizator",
    hint: "Gestionează evenimentul cu tine din aplicație: invitați, plan, mesaje. Intră cu numărul lui de telefon.",
    icon: Crown,
  },
];

/**
 * Edit one guest: name, phone, role (invitat / co-organizator) and delete.
 * A native <dialog>, so focus trapping, Esc and the backdrop come for free.
 */
export function GuestEditDialog({
  eventId,
  eventName,
  guest,
  canManageRoles,
  onClose,
}: {
  eventId: string;
  eventName: string;
  guest: ManagedGuest;
  /** Primary owner only (app's canChangeRole): roles, and removing a co-organizer. */
  canManageRoles: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const initial = guest.phone !== null ? splitStoredPhone(guest.phone) : { iso: DEFAULT_COUNTRY.iso, local: "" };
  const [name, setName] = useState(guest.name ?? "");
  const [country, setCountry] = useState(initial.iso);
  const [localNumber, setLocalNumber] = useState(initial.local);
  const [role, setRole] = useState<Role>(guest.role);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** After promoting someone: offer the app's "you're a co-organizer" WhatsApp message. */
  const [promoted, setPromoted] = useState<{ name: string; phone: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const save = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length < 6) {
      setError("Introdu un număr de telefon valid.");
      return;
    }
    const dialCode = (COUNTRY_CODES.find((c) => c.iso === country) ?? DEFAULT_COUNTRY).dialCode;
    const phone = toStoredPhone(dialCode, localNumber);

    startTransition(async () => {
      if (name.trim() !== (guest.name ?? "") || phone !== guest.phone) {
        const result = await updateGuest(eventId, guest.id, name, phone, guest.memberId);
        if (result.error !== null) {
          setError(result.error);
          return;
        }
      }
      if (role !== guest.role) {
        const result = await setGuestRole(eventId, guest.id, role, guest.memberId);
        if (result.error !== null) {
          setError(result.error);
          router.refresh();
          return;
        }
      }
      router.refresh();
      if (role === "co_organizer" && guest.role !== "co_organizer") {
        setPromoted({ name: name.trim(), phone });
        return;
      }
      onClose();
    });
  };

  const remove = () => {
    setError(null);
    startTransition(async () => {
      const result = await removeGuest(eventId, guest.id, guest.memberId);
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="edit-guest-title"
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-3xl border border-surface-border bg-surface p-0 text-ink shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[calc(100dvh-48px)] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="edit-guest-title" className={ui.title2}>
            {promoted !== null ? "Co-organizator adăugat" : "Editează invitatul"}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="-m-1 rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Închide"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {promoted !== null ? (
          <div className="flex flex-col gap-4">
            <p className="text-[15px] leading-[22px] text-muted">
              {promoted.name || "Invitatul"} poate gestiona evenimentul din aplicație, intrând cu numărul lui de telefon. Spune-i pe
              WhatsApp:
            </p>
            <a
              href={whatsAppUrl(promoted.phone, buildCoOrganizerMessage(promoted.name, eventName))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => dialogRef.current?.close()}
              className={`${ui.buttonPrimary} bg-[#1FA855]! text-white! shadow-none!`}
            >
              Anunță-l pe WhatsApp
            </a>
            <button type="button" onClick={() => dialogRef.current?.close()} className={ui.buttonSoft}>
              Gata
            </button>
          </div>
        ) : (
          <form onSubmit={save} className="flex flex-col gap-5" noValidate>
            <label className="flex flex-col gap-2">
              <span className={ui.label}>Nume</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Fără nume" className={ui.input} />
            </label>
            <label className="flex flex-col gap-2">
              <span className={ui.label}>Telefon</span>
              <div className="flex gap-2">
                <CountrySelect iso={country} onChange={setCountry} />
                <input
                  type="tel"
                  inputMode="tel"
                  value={localNumber}
                  onChange={(e) => setLocalNumber(e.target.value)}
                  className={`${ui.input} flex-1`}
                />
              </div>
            </label>

            {canManageRoles ? (
            <fieldset className="flex flex-col gap-2">
              <legend className={`${ui.label} mb-2`}>Rol</legend>
              {ROLES.map(({ key, label, hint, icon: Icon }) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-3.5 transition ${
                    role === key ? "border-accent bg-accent-tint" : "border-surface-border hover:bg-surface-2"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={key}
                    checked={role === key}
                    onChange={() => setRole(key)}
                    className="sr-only"
                  />
                  <Icon size={18} className={`mt-0.5 shrink-0 ${role === key ? "text-accent-text" : "text-muted"}`} aria-hidden="true" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">
                      {label}
                      {guest.role === key ? <span className="font-normal text-muted"> · rolul actual</span> : null}
                    </span>
                    <span className="text-sm leading-5 text-muted">{hint}</span>
                  </span>
                </label>
              ))}
              {guest.role === "co_organizer" && role === "guest" ? (
                <p className="text-sm text-muted">Rămâne pe listă ca invitat confirmat, dar nu mai poate gestiona evenimentul.</p>
              ) : null}
            </fieldset>
            ) : guest.role === "co_organizer" ? (
              <p className="text-sm text-muted">Co-organizator · doar organizatorul principal îi poate schimba rolul.</p>
            ) : null}

            {error !== null ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={pending} className={ui.buttonPrimary}>
              {pending && !confirmDelete ? "Se salvează…" : "Salvează"}
            </button>

            {canManageRoles || guest.role !== "co_organizer" ? (
            <div className="border-t border-surface-border pt-4">
              {confirmDelete ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm leading-5 text-ink">
                    Ștergi <strong>{guest.name ?? "invitatul"}</strong> de pe listă?
                    {guest.role === "co_organizer" ? " Nu va mai fi nici co-organizator." : ""} Linkul lui de invitație nu va
                    mai funcționa.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" disabled={pending} onClick={() => setConfirmDelete(false)} className={`${ui.buttonSoft} min-h-12`}>
                      Renunță
                    </button>
                    <button type="button" disabled={pending} onClick={remove} className={ui.buttonDanger}>
                      {pending ? "Se șterge…" : "Da, șterge"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-danger hover:underline"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Șterge invitatul
                </button>
              )}
            </div>
            ) : null}
          </form>
        )}
      </div>
    </dialog>
  );
}
