import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppBanner } from "@/components/AppBanner";
import { BrandHeader } from "@/components/BrandMark";
import { InviteCard } from "@/components/InviteCard";
import { formatEventDate } from "@/lib/format";
import { getInvite } from "@/lib/invites";
import { getVenueByToken } from "@/lib/venues";

import { RsvpForm } from "./RsvpForm";
import { VenuePage, venueWhen } from "./VenuePage";

// Always read the live RSVP state; never serve a cached copy of someone's invite.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/i/[token]">): Promise<Metadata> {
  const { token } = await params;
  const invite = await getInvite(token);
  // Personal links: keep them out of search engines either way.
  const robots = { index: false, follow: false };
  if (invite === null) {
    // Not a personal invite: maybe a venue's public booking link.
    const venue = await getVenueByToken(token);
    if (venue === null) return { title: "Invitație · PovesteaNoastra", robots };
    const description = [venue.hostName !== null ? `${venue.hostName} te invită` : null, venueWhen(venue), venue.priceInfo ?? "Intrare liberă"]
      .filter(Boolean)
      .join(" · ");
    return {
      title: `${venue.name}${venue.hostName !== null ? ` · ${venue.hostName}` : ""}`,
      description,
      robots,
      openGraph: { title: venue.name, description, siteName: "PovesteaNoastra" },
    };
  }

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
  if (invite === null) {
    const venue = await getVenueByToken(token);
    if (venue === null) notFound();
    return <VenuePage token={token} venue={venue} />;
  }

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
          <div className="rounded-3xl border border-surface-border bg-surface p-[18px] shadow-card lg:p-6">
            <p className="mb-3 text-base font-bold lg:mb-4 lg:font-display lg:text-xl">Poți ajunge?</p>
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
