"use client";

import { useEffect, useRef, useState } from "react";

import { createPeer, hashParam, negotiate, postToApp } from "@/lib/webrtcLive";

type Status = "starting" | "live" | "error";

/**
 * Broadcaster page, opened by the app (app/live-broadcast/[id].tsx) in a
 * WebView with `#whip=<url>`. Camera + mic -> WHIP -> Cloudflare Stream.
 * Status goes back to the app via postMessage; the app owns the Stop button.
 */
export default function BroadcastPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("starting");
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  useEffect(() => {
    const whip = hashParam("whip");
    let cancelled = false;

    const start = async () => {
      if (whip === null) throw new Error("Lipsește adresa de transmitere.");
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      if (cancelled) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = media;
      if (videoRef.current !== null) videoRef.current.srcObject = media;

      const pc = createPeer();
      pcRef.current = pc;
      for (const track of media.getTracks()) pc.addTransceiver(track, { direction: "sendonly" });
      pc.addEventListener("connectionstatechange", () => {
        if (pc.connectionState === "failed") {
          setStatus("error");
          postToApp({ type: "error", message: "Conexiunea s-a întrerupt." });
        }
      });

      sessionRef.current = await negotiate(pc, whip);
      if (cancelled) return;
      setStatus("live");
      postToApp({ type: "live" });
    };

    start().catch((err: unknown) => {
      setStatus("error");
      postToApp({ type: "error", message: err instanceof Error ? err.message : String(err) });
    });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      pcRef.current?.close();
      if (sessionRef.current !== null) void fetch(sessionRef.current, { method: "DELETE" }).catch(() => {});
    };
  }, []);

  const flipCamera = async () => {
    const next = facing === "environment" ? "user" : "environment";
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      const newTrack = media.getVideoTracks()[0];
      const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
      await sender?.replaceTrack(newTrack);
      const current = streamRef.current;
      current?.getVideoTracks().forEach((track) => {
        track.stop();
        current.removeTrack(track);
      });
      current?.addTrack(newTrack);
      if (videoRef.current !== null && current !== null) videoRef.current.srcObject = current;
      setFacing(next);
    } catch (err) {
      postToApp({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <main className="fixed inset-0 bg-black" data-status={status}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}
      />
      <button
        type="button"
        onClick={() => void flipCamera()}
        className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white"
      >
        Schimbă camera
      </button>
    </main>
  );
}
