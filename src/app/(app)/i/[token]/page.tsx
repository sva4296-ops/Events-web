import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppBanner } from "@/components/AppBanner";
import { BrandHeader } from "@/components/BrandMark";
import { InviteCard } from "@/components/InviteCard";
import { formatEventDate } from "@/lib/format";
import { getInvite } from "@/lib/invites";

import { RsvpForm } from "./RsvpForm";

// Always read the live RSVP state; never serve a cached copy of someone's invite.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/i/[token]">): Promise<Metadata> {
  const { token } = await params;
  const invite = await getInvite(token);
  // Personal links: keep them out of search engines either way.
  const robots = { index: false, follow: false };
  if (invite === null) return { title: "Invitație · PovesteaNoastra", robots };

  const date = formatEventDate(invite.eventDate);
  const description = [
    invite.hostName !== null ? `${invite.hostName} te invită` : "Ești invitat",
    date,
  ]
    .filter(Boolean)
    .join(" · ");

  // This title/description is what WhatsApp shows in the link preview.
  return {
    title: `${invite.eventName} · Invitație`,
    description,
    robots,
    openGraph: { title: invite.eventName, description, siteName: "PovesteaNoastra" },
  };
}

export default async function InvitePage({ params }: PageProps<"/i/[token]">) {
  const { token } = await params;
  const invite = await getInvite(token);
  if (invite === null) notFound();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 md:max-w-2xl lg:max-w-none lg:gap-10">
      <BrandHeader />

      {/* Mobile/tablet: one column. Desktop: invitation left, actions right (sticky). */}
      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-10">
        <InviteCard
          className="lg:col-span-3"
          eventName={invite.eventName}
          eventType={invite.eventType}
          eventDate={invite.eventDate}
          location={invite.location}
          welcomeMessage={invite.welcomeMessage}
          greeting={invite.guestName !== null ? `Bună, ${invite.guestName}!` : "Bună!"}
          hostName={invite.hostName}
        />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-10 lg:col-span-2">
          <div className="rounded-3xl lg:border lg:border-surface-border lg:bg-surface lg:p-6 lg:shadow-xl lg:shadow-black/5">
            <p className="mb-4 hidden font-display text-xl font-bold lg:block">Poți ajunge?</p>
            <RsvpForm
              token={token}
              status={invite.status}
              eventName={invite.eventName}
              eventId={invite.eventId}
            />
          </div>
          <AppBanner />
        </aside>
      </div>
    </div>
  );
}
