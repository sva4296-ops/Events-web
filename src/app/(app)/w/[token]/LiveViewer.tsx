"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LivePlayer } from "@/components/LivePlayer";

/** Shows the player while live; otherwise re-checks the server every 10s. */
export function LiveViewer({ whepUrl, isLive }: { whepUrl: string; isLive: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 10_000);
    return () => clearInterval(timer);
  }, [router]);

  if (!isLive) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-3xl border border-surface-border bg-surface p-6 text-center">
        <p className="font-display text-xl">Live-ul nu a început încă</p>
        <p className="text-sm opacity-70">Lasă pagina deschisă: pornește singur când începe transmisia.</p>
      </div>
    );
  }

  return <LivePlayer whepUrl={whepUrl} className="aspect-video w-full overflow-hidden rounded-3xl" />;
}
