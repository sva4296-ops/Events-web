"use client";

import { Camera, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";

import { ui } from "@/components/ui/styles";
import {
  deleteAccommodation,
  deleteMenuOption,
  deleteScheduleItem,
  deleteSeatingTable,
  deleteVendor,
  deleteVenue,
  saveAccommodation,
  saveMenuOption,
  saveScheduleItem,
  saveSeatingTable,
  saveVendor,
  saveVenue,
  type PlanActionResult,
} from "@/lib/actions/plan";
import { resizeToJpeg } from "@/lib/imageResize";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { Accommodation, MenuOption, ScheduleItem, SeatingTable, TableShape, Vendor } from "@/lib/types";

/**
 * Plan editing on the web: the app's schedule / venue / menu / table /
 * accommodation / vendor screens, as dialogs opened from the Detalii tab.
 * Organizer and co-organizers only (the pages render this for event.isOwner).
 */

export interface SeatableGuest {
  id: string;
  name: string;
  confirmed: boolean;
  tableId: string | null;
}

export type PlanEditTarget =
  | { kind: "schedule"; item?: ScheduleItem }
  | { kind: "venue"; venue: { name: string; address: string; notes: string[] }; fallbackAddress: string; hasSaved: boolean }
  | { kind: "menu"; item?: MenuOption }
  | { kind: "table"; item?: SeatingTable; guests: SeatableGuest[]; tables: { id: string; name: string }[] }
  | { kind: "lodging"; item?: Accommodation }
  | { kind: "vendor"; item?: Vendor };

const ADD_LABEL: Record<PlanEditTarget["kind"], string> = {
  schedule: "Adaugă în program",
  venue: "Setează locația",
  menu: "Adaugă un meniu",
  table: "Adaugă o masă",
  lodging: "Adaugă cazare",
  vendor: "Adaugă furnizor",
};

/** "Adaugă …" (no item) or a pencil (an item), opening that item's dialog. */
export function PlanEditButton({
  eventId,
  target,
  variant = "add",
  label,
}: {
  eventId: string;
  target: PlanEditTarget;
  variant?: "add" | "edit" | "pill";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const text = label ?? ADD_LABEL[target.kind];
  return (
    <>
      {variant === "edit" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface text-muted transition hover:text-accent-text"
          aria-label="Editează"
        >
          <Pencil size={15} aria-hidden="true" />
        </button>
      ) : variant === "pill" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent-tint px-3.5 text-sm font-semibold text-accent-text transition hover:brightness-95"
        >
          {target.kind === "venue" && target.hasSaved ? <Pencil size={14} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          {text}
        </button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={`${ui.buttonPrimary} self-start`}>
          <Plus size={18} aria-hidden="true" />
          {text}
        </button>
      )}
      {open ? <PlanDialog eventId={eventId} target={target} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function titleFor(target: PlanEditTarget): string {
  switch (target.kind) {
    case "schedule":
      return target.item ? "Editează momentul din program" : "Adaugă un moment în program";
    case "venue":
      return target.hasSaved ? "Editează locația" : "Setează locația";
    case "menu":
      return target.item ? "Editează meniul" : "Adaugă un meniu";
    case "table":
      return target.item ? "Editează masa" : "Adaugă o masă";
    case "lodging":
      return target.item ? "Editează cazarea" : "Adaugă cazare";
    case "vendor":
      return target.item ? "Editează furnizorul" : "Adaugă un furnizor";
  }
}

function PlanDialog({ eventId, target, onClose }: { eventId: string; target: PlanEditTarget; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);
  const close = () => dialogRef.current?.close();

  let form: ReactNode;
  switch (target.kind) {
    case "schedule":
      form = <ScheduleForm eventId={eventId} item={target.item} close={close} />;
      break;
    case "venue":
      form = <VenueForm eventId={eventId} target={target} close={close} />;
      break;
    case "menu":
      form = <MenuForm eventId={eventId} item={target.item} close={close} />;
      break;
    case "table":
      form = <TableForm eventId={eventId} target={target} close={close} />;
      break;
    case "lodging":
      form = <LodgingForm eventId={eventId} item={target.item} close={close} />;
      break;
    case "vendor":
      form = <VendorForm eventId={eventId} item={target.item} close={close} />;
      break;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      aria-labelledby="plan-edit-title"
      className="m-auto w-[min(480px,calc(100vw-32px))] rounded-3xl border border-surface-border bg-surface p-0 text-ink shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[calc(100dvh-48px)] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="plan-edit-title" className={ui.title2}>
              {titleFor(target)}
            </h2>
            <p className="text-sm text-muted">
              {target.kind === "menu" ? "Invitații aleg unul dintre meniuri." : "Invitații vor vedea asta în tab-ul Detalii."}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="-m-1 rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
            aria-label="Închide"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {form}
      </div>
    </dialog>
  );
}

/* ---------- shared form plumbing ---------- */

function usePlanAction(close: () => void) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (action: () => Promise<PlanActionResult>) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await action();
        if (result.error !== null) {
          setError(result.error);
          return;
        }
      } catch {
        setError("Nu am putut salva. Încearcă din nou.");
        return;
      }
      router.refresh();
      close();
    });
  };
  return { pending, error, setError, run };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={ui.label}>{label}</span>
      {children}
      {hint !== undefined ? <span className="text-[13px] leading-[18px] text-muted">{hint}</span> : null}
    </label>
  );
}

function FormFooter({
  pending,
  error,
  submitLabel,
  disabled,
  deleteConfirm,
  onDelete,
}: {
  pending: boolean;
  error: string | null;
  submitLabel: string;
  disabled?: boolean;
  /** Null: nothing to delete (a new item). */
  deleteConfirm: { title: string; body: string } | null;
  onDelete?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending || disabled} className={ui.buttonPrimary}>
        {pending && !confirming ? "Se salvează…" : submitLabel}
      </button>
      {deleteConfirm !== null && onDelete !== undefined ? (
        <div className="border-t border-surface-border pt-4">
          {confirming ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-5 text-ink">
                <strong>{deleteConfirm.title}</strong> {deleteConfirm.body}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" disabled={pending} onClick={() => setConfirming(false)} className={`${ui.buttonSoft} min-h-12`}>
                  Renunță
                </button>
                <button type="button" disabled={pending} onClick={onDelete} className={ui.buttonDanger}>
                  {pending ? "Se șterge…" : "Da, șterge"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-danger hover:underline"
            >
              <Trash2 size={16} aria-hidden="true" />
              Șterge
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}

/* ---------- Program ---------- */

function ScheduleForm({ eventId, item, close }: { eventId: string; item?: ScheduleItem; close: () => void }) {
  const [time, setTime] = useState(item?.time ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const { pending, error, run } = usePlanAction(close);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() => saveScheduleItem(eventId, { id: item?.id ?? null, time, title, location }));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Ora">
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={ui.input} />
      </Field>
      <Field label="Titlu">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ceremonie" className={ui.input} autoFocus />
      </Field>
      <Field label="Unde">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Biserica Sfântul Nicolae"
          className={ui.input}
        />
      </Field>
      <FormFooter
        pending={pending}
        error={error}
        submitLabel={item ? "Salvează modificările" : "Adaugă în program"}
        disabled={title.trim().length === 0}
        deleteConfirm={item ? { title: "Ștergi acest moment din program?", body: `„${item.title}” va dispărea din programul zilei.` } : null}
        onDelete={item ? () => run(() => deleteScheduleItem(eventId, item.id)) : undefined}
      />
    </form>
  );
}

/* ---------- Locație ---------- */

function VenueForm({
  eventId,
  target,
  close,
}: {
  eventId: string;
  target: Extract<PlanEditTarget, { kind: "venue" }>;
  close: () => void;
}) {
  const { venue } = target;
  const [name, setName] = useState(venue.name);
  // No venue yet: start from the location typed when the event was created (the app does the same).
  const [address, setAddress] = useState(
    venue.address.trim().length > 0 ? venue.address : venue.name.trim().length > 0 ? "" : target.fallbackAddress,
  );
  const [notes, setNotes] = useState(venue.notes.join("\n"));
  const { pending, error, run } = usePlanAction(close);
  const savedName = venue.name.trim() || venue.address.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() => saveVenue(eventId, { name, address, notes }));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Numele locației">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Casa Regală" className={ui.input} autoFocus />
      </Field>
      <Field label="Adresă">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Str. Republicii 12, Brașov"
          className={ui.input}
        />
      </Field>
      <Field
        label="Note practice"
        hint="Ce e bine să știe invitații: parcare, intrare, ținută. Fiecare informație pe un rând nou."
      >
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ex: parcare gratuită în spate"
          rows={4}
          maxLength={600}
          className={`${ui.input} min-h-28 py-3.5`}
        />
      </Field>
      <FormFooter
        pending={pending}
        error={error}
        submitLabel="Salvează locația"
        disabled={name.trim().length === 0}
        deleteConfirm={
          target.hasSaved
            ? {
                title: "Ștergi locația?",
                body: `„${savedName}” va fi scoasă din eveniment, cu adresa, harta și notițele. Invitații nu o vor mai vedea.`,
              }
            : null
        }
        onDelete={target.hasSaved ? () => run(() => deleteVenue(eventId)) : undefined}
      />
    </form>
  );
}

/* ---------- Meniu ---------- */

const MAX_COURSES = 8;

interface CourseDraft {
  key: string;
  name: string;
  dish: string;
  /** Saved Storage path to keep; null with `file` = a new photo; both null = none. */
  photoPath: string | null;
  file: File | null;
  previewUrl: string | null;
  placeholder: string;
}

let courseKey = 0;
const nextKey = () => `c${++courseKey}`;

function MenuForm({ eventId, item, close }: { eventId: string; item?: MenuOption; close: () => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [courses, setCourses] = useState<CourseDraft[]>(() =>
    item !== undefined && item.courses.length > 0
      ? item.courses.map((course) => ({
          key: nextKey(),
          name: course.name,
          dish: course.dish,
          photoPath: course.photoPath,
          file: null,
          previewUrl: course.photoUrl,
          placeholder: "Ce se servește",
        }))
      : [
          ["Antreu", "Supă cremă de dovleac"],
          ["Fel principal", "Piept de rață cu piure de cartofi"],
          ["Desert", "Tort de ciocolată"],
        ].map(([courseName, placeholder]) => ({
          key: nextKey(),
          name: courseName,
          dish: "",
          photoPath: null,
          file: null,
          previewUrl: null,
          placeholder,
        })),
  );
  const { pending, error, setError, run } = usePlanAction(close);
  const fileInput = useRef<HTMLInputElement>(null);
  const [photoFor, setPhotoFor] = useState<string | null>(null);

  const update = (key: string, patch: Partial<CourseDraft>) =>
    setCourses((current) => current.map((course) => (course.key === key ? { ...course, ...patch } : course)));

  const addAfter = (key: string | null) =>
    setCourses((current) => {
      if (current.length >= MAX_COURSES) return current;
      const index = key === null ? current.length - 1 : current.findIndex((course) => course.key === key);
      const source = key === null ? undefined : current[index];
      const next: CourseDraft = {
        key: nextKey(),
        name: source?.name ?? "",
        dish: "",
        photoPath: null,
        file: null,
        previewUrl: null,
        placeholder: "Ce se servește",
      };
      return [...current.slice(0, index + 1), next, ...current.slice(index + 1)];
    });

  const pickPhoto = (key: string) => {
    setPhotoFor(key);
    fileInput.current?.click();
  };

  const onFile = (file: File | undefined) => {
    if (file === undefined || photoFor === null) return;
    update(photoFor, { file, photoPath: null, previewUrl: URL.createObjectURL(file) });
    setPhotoFor(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      // New photos go straight to Storage from the browser (like the Live uploader), then the row saves their paths.
      const supabase = getBrowserClient();
      const saved: { name: string; dish: string; photoPath: string | null }[] = [];
      for (const course of courses) {
        let photoPath = course.photoPath;
        if (course.file !== null && course.dish.trim().length > 0) {
          const blob = await resizeToJpeg(course.file, 1600, 0.85);
          const path = `${eventId}/menu/${crypto.randomUUID()}.jpg`;
          const { error: uploadError } = await supabase.storage.from("event-photos").upload(path, blob, { contentType: "image/jpeg" });
          if (uploadError) return { error: "Nu am putut încărca poza. Încearcă din nou." };
          photoPath = path;
        }
        saved.push({ name: course.name, dish: course.dish, photoPath });
      }
      return saveMenuOption(eventId, { id: item?.id ?? null, name, courses: saved });
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Numele meniului">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Clasic, Vegetarian, Copii"
          className={ui.input}
          autoFocus
        />
      </Field>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col gap-4">
        {courses.map((course, index) => (
          <div key={course.key} className="flex flex-col gap-2 rounded-2xl border border-surface-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={course.name}
                onChange={(e) => update(course.key, { name: e.target.value })}
                placeholder={`Felul ${index + 1}`}
                aria-label={`Numele felului ${index + 1}`}
                className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-muted outline-none placeholder:text-faint"
              />
              {courses.length < MAX_COURSES ? (
                <button
                  type="button"
                  onClick={() => addAfter(course.key)}
                  className="rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
                  aria-label={`Adaugă încă un fel la ${course.name || index + 1}`}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              ) : null}
              {courses.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setCourses((current) => current.filter((c) => c.key !== course.key))}
                  className="rounded-full p-1.5 text-muted hover:bg-surface-2 hover:text-danger"
                  aria-label={`Șterge ${course.name || `felul ${index + 1}`}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={course.dish}
                onChange={(e) => update(course.key, { dish: e.target.value })}
                placeholder={course.placeholder}
                className={`${ui.input} min-h-12 flex-1`}
              />
              {course.previewUrl !== null ? (
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.previewUrl} alt="" className="size-12 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => update(course.key, { file: null, photoPath: null, previewUrl: null })}
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-surface"
                    aria-label="Șterge poza"
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => pickPhoto(course.key)}
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-surface-border text-muted hover:text-accent-text"
                  aria-label="Adaugă o poză cu preparatul"
                >
                  <Camera size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ))}
        {courses.length < MAX_COURSES ? (
          <button
            type="button"
            onClick={() => addAfter(null)}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-accent-text hover:underline"
          >
            <Plus size={16} aria-hidden="true" />
            Adaugă un fel
          </button>
        ) : null}
      </div>

      <FormFooter
        pending={pending}
        error={error}
        submitLabel="Salvează meniul"
        disabled={name.trim().length === 0}
        deleteConfirm={
          item ? { title: "Ștergi meniul?", body: `„${item.name}” va fi șters. Invitații care l-au ales vor trebui să aleagă din nou.` } : null
        }
        onDelete={
          item
            ? () => {
                setError(null);
                run(() => deleteMenuOption(eventId, item.id));
              }
            : undefined
        }
      />
    </form>
  );
}

/* ---------- Mese ---------- */

function TableForm({
  eventId,
  target,
  close,
}: {
  eventId: string;
  target: Extract<PlanEditTarget, { kind: "table" }>;
  close: () => void;
}) {
  const { item, guests, tables } = target;
  const [name, setName] = useState(item?.name ?? "");
  const [label, setLabel] = useState(item?.label ?? "");
  const [seatCount, setSeatCount] = useState(item === undefined ? "" : String(item.seatCount));
  const [shape, setShape] = useState<TableShape>(item?.shape ?? "round");
  const [selected, setSelected] = useState<string[]>(() =>
    item === undefined ? [] : guests.filter((guest) => guest.tableId === item.id).map((guest) => guest.id),
  );
  const { pending, error, run } = usePlanAction(close);

  const cap = Number.parseInt(seatCount, 10);
  const hasCap = Number.isFinite(cap) && cap > 0;
  const tableName = new Map(tables.map((table) => [table.id, table.name]));
  const assignable = guests.filter((guest) => guest.confirmed);

  const onSeats = (value: string) => {
    setSeatCount(value);
    const parsed = Number.parseInt(value, 10);
    // Shrinking the seats trims the newest picks, like the app.
    if (Number.isFinite(parsed) && parsed > 0 && parsed < selected.length) setSelected((current) => current.slice(0, parsed));
  };

  const toggle = (guestId: string) =>
    setSelected((current) =>
      current.includes(guestId)
        ? current.filter((id) => id !== guestId)
        : hasCap && current.length >= cap
          ? current
          : [...current, guestId],
    );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() =>
      saveSeatingTable(eventId, {
        id: item?.id ?? null,
        name,
        label,
        seatCount: hasCap ? cap : 0,
        shape,
        guestIds: selected,
      }),
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Nume masă">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masa 1" className={ui.input} autoFocus />
      </Field>
      <Field label="Etichetă">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Familia mirilor" className={ui.input} />
      </Field>
      <Field label="Locuri">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={seatCount}
          onChange={(e) => onSeats(e.target.value)}
          placeholder="8"
          className={ui.input}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className={`${ui.label} mb-2`}>Forma mesei</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
          {(
            [
              ["round", "Rotundă"],
              ["rect", "Dreptunghiulară"],
            ] as const
          ).map(([value, text]) => (
            <label
              key={value}
              className={`flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition ${
                shape === value ? "bg-surface text-ink shadow-card" : "text-muted"
              }`}
            >
              <input type="radio" name="shape" value={value} checked={shape === value} onChange={() => setShape(value)} className="sr-only" />
              <span
                aria-hidden="true"
                className={`border-[1.5px] border-current ${value === "round" ? "size-3.5 rounded-full" : "h-3 w-5 rounded-[3px]"}`}
              />
              {text}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={`${ui.label} mb-2 flex w-full justify-between`}>
          <span>Alocă invitați</span>
          {hasCap ? (
            <span className="font-normal">
              {selected.length} / {cap} locuri ocupate
            </span>
          ) : null}
        </legend>
        {!hasCap ? (
          <p className="text-sm text-muted">Completează mai întâi numărul de locuri</p>
        ) : assignable.length === 0 ? (
          <p className="text-sm text-muted">Niciun invitat confirmat încă</p>
        ) : (
          <ul className="flex max-h-64 flex-col overflow-y-auto rounded-2xl border border-surface-border">
            {assignable.map((guest) => {
              const elsewhere = guest.tableId !== null && guest.tableId !== item?.id && !selected.includes(guest.id);
              const checked = selected.includes(guest.id);
              const full = !checked && selected.length >= cap;
              return (
                <li key={guest.id} className="border-b border-surface-border last:border-b-0">
                  <label
                    className={`flex min-h-12 items-center gap-3 px-4 py-2 ${elsewhere || full ? "opacity-50" : "cursor-pointer hover:bg-surface-2"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={elsewhere || full}
                      onChange={() => toggle(guest.id)}
                      className="size-4 accent-[var(--color-accent)]"
                    />
                    <span className="min-w-0 flex-1 truncate text-[15px]">{guest.name}</span>
                    {elsewhere ? (
                      <span className="shrink-0 text-xs text-muted">Deja la {tableName.get(guest.tableId ?? "") ?? ""}</span>
                    ) : null}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {hasCap && selected.length >= cap && assignable.length > selected.length ? (
          <p className="text-[13px] text-muted">Limita de locuri a fost atinsă</p>
        ) : null}
      </fieldset>

      <FormFooter
        pending={pending}
        error={error}
        submitLabel={item ? "Salvează modificările" : "Adaugă masă"}
        disabled={name.trim().length === 0}
        deleteConfirm={item ? { title: "Ștergi această masă?", body: `„${item.name}” va dispărea din așezarea la mese.` } : null}
        onDelete={item ? () => run(() => deleteSeatingTable(eventId, item.id)) : undefined}
      />
    </form>
  );
}

/* ---------- Cazare ---------- */

function LodgingForm({ eventId, item, close }: { eventId: string; item?: Accommodation; close: () => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [detailLine, setDetailLine] = useState(item?.detailLine ?? "");
  const [priceLine, setPriceLine] = useState(item?.priceLine ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const { pending, error, run } = usePlanAction(close);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() => saveAccommodation(eventId, { id: item?.id ?? null, name, detailLine, priceLine, location }));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Nume">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hotel Castel" className={ui.input} autoFocus />
      </Field>
      <Field label="Detalii">
        <input value={detailLine} onChange={(e) => setDetailLine(e.target.value)} placeholder="4★ · 2 min de castel" className={ui.input} />
      </Field>
      <Field label="Preț">
        <input value={priceLine} onChange={(e) => setPriceLine(e.target.value)} placeholder="de la 320 lei/noapte" className={ui.input} />
      </Field>
      <Field label="Locație">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Str. Republicii 12, Brașov"
          className={ui.input}
        />
      </Field>
      <FormFooter
        pending={pending}
        error={error}
        submitLabel={item ? "Salvează modificările" : "Adaugă cazare"}
        disabled={name.trim().length === 0}
        deleteConfirm={item ? { title: "Ștergi această opțiune de cazare?", body: `„${item.name}” va dispărea din lista de cazare.` } : null}
        onDelete={item ? () => run(() => deleteAccommodation(eventId, item.id)) : undefined}
      />
    </form>
  );
}

/* ---------- Furnizori ---------- */

function VendorForm({ eventId, item, close }: { eventId: string; item?: Vendor; close: () => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [handle, setHandle] = useState(item?.handle ?? "");
  const [externalUrl, setExternalUrl] = useState(item?.externalUrl ?? "");
  const { pending, error, run } = usePlanAction(close);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(() => saveVendor(eventId, { id: item?.id ?? null, name, category, handle, externalUrl }));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <Field label="Nume">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Studio Lumière" className={ui.input} autoFocus />
      </Field>
      <Field label="Categorie">
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Foto & Video" className={ui.input} />
      </Field>
      <Field label="Handle">
        <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@studiolumiere" className={ui.input} />
      </Field>
      <Field label="Link extern" hint="Opțional — apare ca buton „Vezi”.">
        <input
          type="url"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://instagram.com/studiolumiere"
          className={ui.input}
        />
      </Field>
      <FormFooter
        pending={pending}
        error={error}
        submitLabel={item ? "Salvează modificările" : "Adaugă furnizor"}
        disabled={name.trim().length === 0}
        deleteConfirm={item ? { title: "Ștergi acest furnizor?", body: `„${item.name}” va dispărea din listă.` } : null}
        onDelete={item ? () => run(() => deleteVendor(eventId, item.id)) : undefined}
      />
    </form>
  );
}
