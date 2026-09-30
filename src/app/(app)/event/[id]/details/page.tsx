import { CheckCircle2, ChevronRight, Circle, Info, Lock } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { getDetails } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { hasContent, isLocked, SECTION_ORDER, SECTIONS, sectionStatus } from "@/lib/details";

export default async function DetaliiPage({ params }: PageProps<"/event/[id]/details">) {
  const { id } = await params;
  const [{ event, capabilities }, details] = await Promise.all([getEventContext(id), getDetails(id)]);
  const owner = event.isOwner;

  // Guests only see sections with content that their plan includes (same rule as the app).
  const keys = SECTION_ORDER.filter(
    (key) => owner || (!isLocked(key, capabilities) && hasContent(key, details)),
  );

  if (keys.length === 0) {
    return <EmptyState icon={Info} message="Organizatorul nu a adăugat încă detalii." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {keys.map((key) => {
        const meta = SECTIONS[key];
        const locked = isLocked(key, capabilities);
        const complete = hasContent(key, details);
        const Icon = meta.icon;
        const body = (
          <>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                locked ? "bg-gold/20 text-[#B7862A] dark:text-gold" : "bg-accent-soft text-accent-text"
              }`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-bold">{meta.title}</span>
              <span className="truncate text-sm text-muted">
                {locked ? "Necesită un plan superior" : sectionStatus(key, details, owner)}
              </span>
            </span>
            {owner ? (
              locked ? (
                <Lock size={16} className="text-[#B7862A] dark:text-gold" aria-hidden="true" />
              ) : complete ? (
                <CheckCircle2 size={18} className="text-confirmed" aria-label="Completat" />
              ) : (
                <Circle size={18} className="text-muted/50" aria-label="Necompletat" />
              )
            ) : null}
            {!locked ? <ChevronRight size={18} className="text-muted" aria-hidden="true" /> : null}
          </>
        );
        const className =
          "flex items-center gap-3 rounded-3xl border border-surface-border bg-surface p-4 shadow-lg shadow-black/5 transition sm:p-5";
        return locked ? (
          <div key={key} className={`${className} opacity-80`}>
            {body}
          </div>
        ) : (
          <Link key={key} href={`/event/${id}/details/${key}`} className={`${className} hover:-translate-y-0.5 hover:shadow-xl`}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
