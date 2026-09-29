import Link from "next/link";

import { MomentCard } from "@/components/event/MomentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getDetails, getMoments } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";

export default async function AcasaPage({ params }: PageProps<"/event/[id]">) {
  const { id } = await params;
  // Page data starts in parallel with the access check (RLS guards it either way).
  const [{ user, event }, { moments, reactions }, details] = await Promise.all([
    getEventContext(id),
    getMoments(id),
    getDetails(id),
  ]);

  const stateFor = (momentId: string) => {
    const mine = (type: "love" | "celebrate") =>
      reactions.some((r) => r.momentId === momentId && r.type === type && r.userId === user.id);
    const count = (type: "love" | "celebrate") =>
      reactions.filter((r) => r.momentId === momentId && r.type === type).length;
    return {
      love: { count: count("love"), mine: mine("love") },
      celebrate: { count: count("celebrate"), mine: mine("celebrate") },
    };
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
      <section className="flex min-w-0 flex-col gap-5 lg:col-span-2" aria-labelledby="moments-title">
        <h2 id="moments-title" className={ui.eyebrow}>
          Povestea noastră
        </h2>
        {moments.length === 0 ? (
          <EmptyState
            message={
              event.isOwner
                ? "Niciun moment postat încă. Postarea momentelor se face deocamdată din aplicație."
                : "Organizatorii nu au postat încă niciun moment."
            }
          />
        ) : (
          moments.map((moment) => (
            <MomentCard key={moment.id} eventId={id} moment={moment} reactions={stateFor(moment.id)} />
          ))
        )}
      </section>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-8">
        {event.welcomeMessage !== null ? (
          <div className={ui.cardPadded}>
            <p className={ui.eyebrow}>Mesajul gazdelor</p>
            <p className="mt-3 font-display text-xl italic leading-snug">„{event.welcomeMessage}”</p>
          </div>
        ) : null}
        {details.fund !== null ? (
          <div className={`${ui.cardPadded} flex flex-col gap-3`}>
            <h3 className="font-display text-xl font-bold">{details.fund.title}</h3>
            <p className="text-muted">
              Ne-ar bucura enorm să faceți parte din următorul capitol al poveștii noastre.
            </p>
            <Link href={`/event/${id}/fund`} className={ui.buttonGold}>
              Vezi fondul
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
