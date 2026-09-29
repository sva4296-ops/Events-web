"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { ui } from "@/components/ui/styles";

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
    <button type="button" onClick={() => void run()} disabled={done !== null} className={`${ui.buttonPrimary} w-full`}>
      <Download size={18} aria-hidden="true" />
      {done !== null ? `Se descarcă ${done}/${urls.length}…` : "Descarcă toate pozele"}
    </button>
  );
}
