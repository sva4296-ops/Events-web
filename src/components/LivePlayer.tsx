"use client";

import { useEffect, useRef, useState } from "react";

import { createPeer, negotiate } from "@/lib/webrtcLive";

/**
 * WebRTC (WHEP) player for a Cloudflare Stream live input. Retries every 3s
 * while the broadcaster is (re)connecting. Used by /live/watch (app WebView)
 * and /w/<token> (public link).
 */
export function LivePlayer({ whepUrl, className = "" }: { whepUrl: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pc: RTCPeerConnection | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      if (cancelled || retry !== null) return;
      retry = setTimeout(() => {
        retry = null;
        connect().catch(schedule);
      }, 3000);
    };

    const connect = async () => {
      pc?.close();
      const peer = createPeer();
      pc = peer;
      peer.addTransceiver("video", { direction: "recvonly" });
      peer.addTransceiver("audio", { direction: "recvonly" });

      const remote = new MediaStream();
      peer.addEventListener("track", (event) => {
        remote.addTrack(event.track);
        const video = videoRef.current;
        if (video === null) return;
        video.srcObject = remote;
        // Sound autoplays in the app's WebView; a browser may refuse it until a tap.
        video.play().catch(() => {
          video.muted = true;
          setMuted(true);
          void video.play();
        });
      });
      peer.addEventListener("connectionstatechange", () => {
        if (peer.connectionState === "connected") setConnected(true);
        if (peer.connectionState === "failed" || peer.connectionState === "disconnected") {
          setConnected(false);
          schedule();
        }
      });

      await negotiate(peer, whepUrl);
    };

    connect().catch(schedule);

    return () => {
      cancelled = true;
      if (retry !== null) clearTimeout(retry);
      pc?.close();
    };
  }, [whepUrl]);

  return (
    <div className={`relative bg-black ${className}`}>
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-contain" />
      {!connected ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">Se conectează…</div>
      ) : null}
      {muted ? (
        <button
          type="button"
          onClick={() => {
            if (videoRef.current !== null) videoRef.current.muted = false;
            setMuted(false);
          }}
          className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white"
        >
          Pornește sunetul
        </button>
      ) : null}
    </div>
  );
}
