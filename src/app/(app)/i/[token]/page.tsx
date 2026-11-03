import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppBanner } from "@/components/AppBanner";
import { InviteSplit } from "@/components/InviteSplit";
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
    <InviteSplit
      eventName={invite.eventName}
      eventType={invite.eventType}
      eventDate={invite.eventDate}
      location={invite.location}
      welcomeMessage={invite.welcomeMessage}
      greeting={invite.guestName !== null ? `Bună, ${invite.guestName}!` : "Bună!"}
      hostName={invite.hostName}
    >
      <RsvpForm token={token} status={invite.status} eventName={invite.eventName} eventId={invite.eventId} />
      <AppBanner />
    </InviteSplit>
  );
}
