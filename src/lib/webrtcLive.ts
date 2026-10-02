/**
 * Minimal WHIP / WHEP client for Cloudflare Stream live (WebRTC).
 * Used by /live/broadcast (organizer, inside the app's WebView) and
 * /live/watch (guests). The URLs arrive in the page hash, never sent to our server.
 */

/** Reads `#key=value` from the URL hash. */
export function hashParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.hash.slice(1)).get(key);
}

/** Tells the React Native WebView host what happened (no-op in a normal browser). */
export function postToApp(message: { type: string; message?: string }): void {
  const host = (window as unknown as { ReactNativeWebView?: { postMessage: (data: string) => void } })
    .ReactNativeWebView;
  host?.postMessage(JSON.stringify(message));
}

function waitForIceGathering(pc: RTCPeerConnection, timeoutMs: number): Promise<void> {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      pc.removeEventListener("icegatheringstatechange", check);
      resolve();
    };
    const check = () => {
      if (pc.iceGatheringState === "complete") done();
    };
    pc.addEventListener("icegatheringstatechange", check);
    setTimeout(done, timeoutMs);
  });
}

/** Offer -> POST to the WHIP/WHEP endpoint -> answer. Returns the session URL (for DELETE). */
export async function negotiate(pc: RTCPeerConnection, endpoint: string): Promise<string | null> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForIceGathering(pc, 2000);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/sdp" },
    body: pc.localDescription?.sdp ?? offer.sdp,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  await pc.setRemoteDescription({ type: "answer", sdp: await res.text() });
  const location = res.headers.get("Location");
  return location === null ? null : new URL(location, endpoint).toString();
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.cloudflare.com:3478" }];

export function createPeer(): RTCPeerConnection {
  return new RTCPeerConnection({ iceServers: ICE_SERVERS, bundlePolicy: "max-bundle" });
}
