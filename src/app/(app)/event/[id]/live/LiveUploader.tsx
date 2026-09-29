"use client";

import { ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ui } from "@/components/ui/styles";
import { registerPhoto } from "@/lib/actions/content";
import { processEventPhoto } from "@/lib/imageResize";
import { getBrowserClient } from "@/lib/supabase/browser";

const BUCKET = "event-photos";

export function LiveUploader({ eventId }: { eventId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        id="live-upload"
        onChange={(event) => void upload(event.target.files)}
        disabled={progress !== null}
      />
      <label
        htmlFor="live-upload"
        className={`${ui.buttonPrimary} cursor-pointer ${progress !== null ? "pointer-events-none opacity-60" : ""}`}
      >
        <ImagePlus size={20} aria-hidden="true" />
        {progress !== null ? `Se încarcă ${progress.done}/${progress.total}…` : "Adaugă poze"}
      </label>
      {error !== null ? (
        <p role="alert" className="text-center text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
