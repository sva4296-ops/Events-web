import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandHeader } from "@/components/BrandMark";
import { getPublicLive } from "@/lib/live";

import { LiveViewer } from "./LiveViewer";

// Live status changes minute to minute; never cache.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/w/[token]">): Promise<Metadata> {
  const { token } = await params;
  const live = await getPublicLive(token);
  const robots = { index: false, follow: false };
  if (live === null) return { title: "Live · PovesteaNoastra", robots };
  // What WhatsApp shows in the link preview.
  const description = "Urmărește evenimentul în direct, de oriunde.";
  return {
    title: `${live.eventName} · Live`,
    description,
    robots,
    openGraph: { title: `${live.eventName} · Live`, description, siteName: "PovesteaNoastra" },
  };
}

/** Public watch link for people who aren't at the event. No account needed. */
export default async function PublicLivePage({ params }: PageProps<"/w/[token]">) {
  const { token } = await params;
  const live = await getPublicLive(token);
  if (live === null) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6">
      <BrandHeader />
      <div className="flex items-center gap-3">
        {live.isLive ? (
          <span className="rounded-full bg-[#B5335F] px-3 py-1 text-xs font-bold tracking-wide text-white">● LIVE</span>
        ) : null}
        <h1 className="font-display text-2xl lg:text-3xl">{live.eventName}</h1>
      </div>
      <LiveViewer whepUrl={live.whepUrl} isLive={live.isLive} />
    </div>
  );
}
