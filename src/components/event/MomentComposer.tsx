"use client";

import { Camera, ImagePlus, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";

import { ui } from "@/components/ui/styles";
import { createMoment, deleteMoment, updateMoment } from "@/lib/actions/moments";
import { resizeToJpeg } from "@/lib/imageResize";
import { isMomentIconId, MOMENT_ICON_IDS, MOMENT_ICON_LABELS, MomentIcon, type MomentIconId } from "@/lib/momentIcons";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Moment } from "@/lib/types";

/** Same size/quality as the app's processMomentPhoto. */
const MOMENT_EDGE = 1600;
const MOMENT_QUALITY = 0.8;

/** "Moment nou" in Acasă: the app's post-moment screen as a dialog. */
export function NewMomentButton({ eventId, compact = false }: { eventId: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent-fill px-4 text-sm font-semibold text-on-accent shadow-accent transition hover:brightness-105"
            : `${ui.buttonPrimary} self-center`
        }
      >
        <Plus size={compact ? 16 : 18} aria-hidden="true" />
        Moment nou
      </button>
      {open ? <MomentDialog eventId={eventId} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** The ⋯ on a moment card: edit or delete it. */
export function MomentMenu({ eventId, moment }: { eventId: string; moment: Moment }) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (ref.current !== null && !ref.current.contains(e.target as Node)) {
        setMenu(false);
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const remove = () =>
    startTransition(async () => {
      const result = await deleteMoment(eventId, moment.id);
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      setMenu(false);
      router.refresh();
    });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setMenu((value) => !value);
          setConfirming(false);
          setError(null);
        }}
        className="flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
        aria-label="Opțiuni moment"
        aria-expanded={menu}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      {menu ? (
        <div className="absolute top-10 right-0 z-20 flex w-56 flex-col rounded-2xl border border-surface-border bg-surface p-1.5 shadow-card">
          {confirming ? (
            <div className="flex flex-col gap-2 p-2">
              <p className="text-sm">Ștergi momentul?</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-9 rounded-full bg-surface-2 text-sm font-semibold text-muted"
                >
                  Nu
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={remove}
                  className="min-h-9 rounded-full bg-danger-soft text-sm font-semibold text-danger"
                >
                  {pending ? "…" : "Șterge"}
                </button>
              </div>
              {error !== null ? <p className="text-xs text-danger">{error}</p> : null}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  setEditing(true);
                }}
                className="flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium hover:bg-surface-2"
              >
                <Pencil size={15} aria-hidden="true" />
                Editează
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium text-danger hover:bg-danger-soft"
              >
                <Trash2 size={15} aria-hidden="true" />
                Șterge
              </button>
            </>
          )}
        </div>
      ) : null}
      {editing ? <MomentDialog eventId={eventId} moment={moment} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}

function MomentDialog({ eventId, moment, onClose }: { eventId: string; moment?: Moment; onClose: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(moment?.title ?? "");
  const [icon, setIcon] = useState<MomentIconId | null>(isMomentIconId(moment?.icon) ? moment.icon : null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(moment?.photoUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);
  const close = () => dialogRef.current?.close();

  const pick = (picked: File | undefined) => {
    if (picked === undefined || !picked.type.startsWith("image/")) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const momentId = moment?.id ?? crypto.randomUUID();
      if (file !== null) {
        try {
          const blob = await resizeToJpeg(file, MOMENT_EDGE, MOMENT_QUALITY);
          const { error: uploadError } = await getBrowserClient()
            .storage.from("event-photos")
            .upload(`${eventId}/moments/${momentId}.jpg`, blob, { contentType: "image/jpeg", upsert: moment !== undefined });
          if (uploadError) throw uploadError;
        } catch {
          setError("Nu am putut încărca poza. Încearcă din nou.");
          return;
        }
      }
      const result =
        moment === undefined
          ? await createMoment(eventId, momentId, { title, icon, hasPhoto: file !== null })
          : await updateMoment(eventId, momentId, { title, icon, newPhoto: file !== null });
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      router.refresh();
      close();
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      aria-labelledby="moment-title"
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-3xl border border-surface-border bg-surface p-0 text-ink shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={submit} noValidate className="flex max-h-[calc(100dvh-48px)] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="moment-title" className={ui.title2}>
            {moment === undefined ? "Moment nou" : "Editează momentul"}
          </h2>
          <button
            type="button"
            onClick={close}
            className="-m-1 rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Închide"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            pick(e.dataTransfer.files[0]);
          }}
          className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[18px] bg-accent-tint text-accent-text"
          aria-label={preview === null ? "Alege o poză" : "Schimbă poza"}
        >
          {preview !== null ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-sm font-semibold text-white">
                <Camera size={15} aria-hidden="true" />
                Schimbă poza
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-2 font-semibold">
              <ImagePlus size={28} aria-hidden="true" />
              Alege o poză
            </span>
          )}
        </button>

        <label className="flex flex-col gap-2">
          <span className={ui.label}>Titlu</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="Am găsit locația perfectă"
            className={ui.input}
            autoFocus
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className={`${ui.label} mb-2`}>Iconiță</legend>
          <div className="grid grid-cols-6 gap-2">
            {MOMENT_ICON_IDS.map((id) => {
              const selected = icon === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setIcon(selected ? null : id)}
                  aria-pressed={selected}
                  aria-label={MOMENT_ICON_LABELS[id]}
                  title={MOMENT_ICON_LABELS[id]}
                  className={`flex aspect-square items-center justify-center rounded-2xl border transition ${
                    selected ? "border-accent-fill bg-accent-fill text-on-accent" : "border-surface-border bg-surface hover:bg-surface-2"
                  }`}
                >
                  <MomentIcon icon={id} size={22} />
                </button>
              );
            })}
          </div>
        </fieldset>

        {error !== null ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending || title.trim().length === 0} className={ui.buttonPrimary}>
          {pending ? "Se publică…" : moment === undefined ? "Publică momentul" : "Salvează modificările"}
        </button>
      </form>
    </dialog>
  );
}
