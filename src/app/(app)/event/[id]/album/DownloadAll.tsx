"use client";

import { Download } from "lucide-react";
import { useState } from "react";

/** Downloads every full-size photo, one file at a time (signed URLs are
 * cross-origin, so each is fetched to a blob first to force a download). */
export function DownloadAll({ urls, eventName }: { urls: string[]; eventName: string }) {
  const [done, setDone] = useState<number | null>(null);

  const run = async () => {
    setDone(0);
    const slug = eventName.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "album";
    for (const [index, url] of urls.entries()) {
      try {
        const blob = await fetch(url).then((res) => res.blob());
        const href = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.download = `${slug}-${String(index + 1).padStart(3, "0")}.jpg`;
        anchor.click();
        URL.revokeObjectURL(href);
      } catch {
        // skip a single failed photo, keep going
      }
      setDone(index + 1);
    }
    setDone(null);
  };

  return (
    <button
      type="button"
      onClick={() => void run()}
      disabled={done !== null}
      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent-fill px-4 text-sm font-semibold text-on-accent shadow-accent transition hover:brightness-105 disabled:opacity-60"
    >
      <Download size={16} aria-hidden="true" />
      {done !== null ? `${done}/${urls.length}…` : "Descarcă tot"}
    </button>
  );
}
