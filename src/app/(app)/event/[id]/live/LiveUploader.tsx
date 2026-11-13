"use client";

import { ImagePlus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";

import { ui } from "@/components/ui/styles";
import { pluralRo } from "@/lib/format";
import { registerPhoto } from "@/lib/actions/content";
import { processEventPhoto } from "@/lib/imageResize";
import { getBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "event-photos";

/** The Live page: title row with the upload button, and the photos as a drop target (from tablet up). */
export function LiveUploader({ eventId, count, children }: { eventId: string; count: number; children: ReactNode }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const upload = async (files: FileList | null) => {
    if (files === null || files.length === 0) return;
    setError(null);
    const list = Array.from(files).filter((file) => file.type.startsWith("image/"));
    setProgress({ done: 0, total: list.length });
    const supabase = getBrowserClient();
    let failed = 0;

    for (const [index, file] of list.entries()) {
      try {
        const photoId = crypto.randomUUID();
        const { thumb, full } = await processEventPhoto(file);
        // Files first, then the row — same order and paths as the app.
        const [thumbUpload, fullUpload] = await Promise.all([
          supabase.storage.from(BUCKET).upload(`${eventId}/${photoId}/thumb.jpg`, thumb, { contentType: "image/jpeg" }),
          supabase.storage.from(BUCKET).upload(`${eventId}/${photoId}/full.jpg`, full, { contentType: "image/jpeg" }),
        ]);
        if (thumbUpload.error || fullUpload.error) throw new Error("upload failed");
        const result = await registerPhoto(eventId, photoId);
        if (result.error !== null) throw new Error(result.error);
      } catch {
        failed += 1;
      }
      setProgress({ done: index + 1, total: list.length });
    }

    setProgress(null);
    if (inputRef.current !== null) inputRef.current.value = "";
    if (failed > 0) setError(failed === list.length ? "Pozele nu au putut fi încărcate." : `${failed} poze nu au putut fi încărcate.`);
    router.refresh();
  };

  const busy = progress !== null;
  return (
    <section
      aria-labelledby="live-title"
      className="relative flex flex-col gap-5"
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!busy) void upload(event.dataTransfer.files);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8524F] opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#E8524F]" />
          </span>
          <div className="flex flex-col">
            <h2 id="live-title" className={ui.title1}>
              Live
            </h2>
            <p className="text-[13px] text-muted">
              {count} {pluralRo(count, "poză", "poze", "de poze")}
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          id="live-upload"
          onChange={(event) => void upload(event.target.files)}
          disabled={busy}
        />
        <label
          htmlFor="live-upload"
          className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-accent-fill px-4 text-sm font-semibold text-on-accent shadow-accent transition hover:brightness-105 ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <ImagePlus size={16} aria-hidden="true" />
          {busy ? `${progress.done}/${progress.total}…` : "Adaugă poze"}
        </label>
      </div>
      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      {children}

      {dragging ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-accent bg-accent-tint/90 text-accent-text">
          <Upload size={28} strokeWidth={1.8} aria-hidden="true" />
          <span className="font-semibold">Lasă pozele aici</span>
        </div>
      ) : null}
    </section>
  );
}
