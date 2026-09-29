"use client";

import { Trash2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { deletePhoto } from "@/lib/actions/content";
import type { Photo } from "@/lib/types";

/** Grid of thumbnails with a full-size lightbox — the web twin of the app's PhotoTile. */
export function PhotoGrid({
  eventId,
  photos,
  userId,
  isOwner,
  columns = "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5",
}: {
  eventId: string;
  photos: Photo[];
  userId: string;
  isOwner: boolean;
  columns?: string;
}) {
  const [open, setOpen] = useState<Photo | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const visible = photos.filter((photo) => !hidden.has(photo.id));

  const remove = (photo: Photo) => {
    if (!window.confirm("Ștergi această poză?")) return;
    setHidden((current) => new Set(current).add(photo.id));
    setOpen(null);
    startTransition(() => deletePhoto(eventId, photo.id));
  };

  return (
    <>
      <div className={`grid gap-2 sm:gap-3 ${columns}`}>
        {visible.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpen(photo)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-muted"
            aria-label={`Deschide poza de la ${photo.uploadedByLabel ?? "Invitat"}`}
          >
            {photo.thumbUrl !== null ? (
              // eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL
              <img
                src={photo.thumbUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : null}
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 text-left text-xs font-medium text-white">
              {photo.uploadedByLabel ?? "Invitat"}
            </span>
          </button>
        ))}
      </div>

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Poză"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL */}
          <img
            src={open.fullUrl ?? open.thumbUrl ?? ""}
            alt=""
            className="max-h-full max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <div className="absolute right-4 top-4 flex gap-2">
            {isOwner || open.uploadedBy === userId ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  remove(open);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-danger"
                aria-label="Șterge poza"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              aria-label="Închide"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white">
            {open.uploadedByLabel ?? "Invitat"}
          </p>
        </div>
      ) : null}
    </>
  );
}
