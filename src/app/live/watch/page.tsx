"use client";

import { useSyncExternalStore } from "react";

import { LivePlayer } from "@/components/LivePlayer";
import { hashParam } from "@/lib/webrtcLive";

const noopSubscribe = () => () => {};

/**
 * Viewer page embedded by the app's Live tab in a WebView: `#whep=<url>`.
 * The hash is read on the client only (it never reaches the server).
 */
export default function WatchPage() {
  const whep = useSyncExternalStore(noopSubscribe, () => hashParam("whep"), () => null);

  return (
    <main className="fixed inset-0 bg-black">
      {whep !== null ? <LivePlayer whepUrl={whep} className="h-full w-full" /> : null}
    </main>
  );
}
