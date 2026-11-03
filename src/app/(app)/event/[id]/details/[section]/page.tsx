import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  LocationSection,
  LodgingSection,
  MenuSection,
  ScheduleSection,
  SeatingSection,
  VendorsSection,
} from "@/components/event/PlanSections";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDetails, getTableCompanions } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { hasContent, isLocked, isSectionKey, SECTIONS } from "@/lib/details";

const EMPTY_GUEST: Record<string, string> = {
  schedule: "Programul nu a fost publicat încă.",
  location: "Locația nu a fost publicată încă.",
  menu: "Meniul nu a fost publicat încă.",
  seating: "Așezarea la mese nu a fost publicată încă.",
  lodging: "Opțiunile de cazare nu au fost publicate încă.",
  vendors: "Niciun furnizor publicat încă.",
};

export default async function DetaliiSectionPage({ params }: PageProps<"/event/[id]/details/[section]">) {
  const { id, section } = await params;
  if (!isSectionKey(section)) notFound();

  const [{ event, capabilities }, details] = await Promise.all([getEventContext(id), getDetails(id)]);
  if (isLocked(section, capabilities)) redirect(`/event/${id}/details`);
  const meta = SECTIONS[section];
  const owner = event.isOwner;
  const empty = (
    <EmptyState
      message={owner ? "Nu ai adăugat încă nimic aici. Editarea se face deocamdată din aplicație." : EMPTY_GUEST[section]}
    />
  );

  let body: ReactNode = empty;
  if (hasContent(section, details, event.location ?? "")) {
    switch (section) {
      case "schedule":
        body = <ScheduleSection details={details} />;
        break;
      case "location":
        body = <LocationSection details={details} eventLocation={event.location} />;
        break;
      case "menu":
        body = <MenuSection details={details} event={event} />;
        break;
      case "seating": {
        const seated = !owner && (event.myGuest?.table_id ?? null) !== null;
        body = <SeatingSection details={details} event={event} companions={seated ? await getTableCompanions(id) : []} />;
        break;
      }
      case "lodging":
        body = <LodgingSection details={details} />;
        break;
      case "vendors":
        body = <VendorsSection details={details} />;
        break;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <Link
          href={`/event/${id}/details`}
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface transition hover:text-accent-text"
          aria-label="Înapoi la detalii"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{meta.title}</h2>
          {meta.description !== undefined ? <p className="text-muted">{meta.description}</p> : null}
        </div>
      </div>
      {body}
    </div>
  );
}
