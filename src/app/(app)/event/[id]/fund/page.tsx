import { HeartHandshake } from "lucide-react";

import { LockedFeature } from "@/components/event/LockedFeature";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getDetails } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { formatMoney, pluralRo } from "@/lib/format";

export default async function FondPage({ params }: PageProps<"/event/[id]/fund">) {
  const { id } = await params;
  const [{ event, capabilities }, { fund, contributorCount }] = await Promise.all([
    getEventContext(id),
    getDetails(id),
  ]);
  const owner = event.isOwner;

  if (!capabilities.contributionsEnabled) {
    return <LockedFeature owner={owner} message="Fondul de contribuții nu este inclus în planul curent al acestui eveniment." />;
  }

  if (fund === null) {
    return (
      <EmptyState
        icon={HeartHandshake}
        message={
          owner
            ? "Niciun fond încă. Îl poți deschide din aplicație."
            : "Organizatorii nu au deschis un fond pentru acest eveniment."
        }
      />
    );
  }

  const progress = fund.targetAmount > 0 ? Math.min(100, (fund.currentAmount / fund.targetAmount) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className={`${ui.cardPadded} flex flex-col gap-5 sm:p-8`}>
        <p className={ui.eyebrow}>{fund.title}</p>
        {fund.description.length > 0 ? <p className="text-muted">{fund.description}</p> : null}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-5xl font-bold text-accent">
            {formatMoney(fund.currentAmount, fund.currency)}
          </span>
          <span className="text-muted">din {formatMoney(fund.targetAmount, fund.currency)}</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-accent-soft"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-accent" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-muted">
          {contributorCount}{" "}
          {pluralRo(contributorCount, "persoană a contribuit", "persoane au contribuit", "de persoane au contribuit")} până acum
        </p>
        {!owner ? (
          <button type="button" disabled className={ui.buttonPrimary}>
            Contribuie acum · în curând
          </button>
        ) : null}
      </div>
      {!owner ? (
        <p className="text-center text-sm text-muted">Plățile online vor fi procesate securizat prin Stripe.</p>
      ) : null}
    </div>
  );
}
