import { CheckCircle2, ChevronRight, Circle, Info, Lock } from "lucide-react";
import Link from "next/link";

import {
  LocationSection,
  LodgingSection,
  MenuSection,
  ScheduleSection,
  SeatingSection,
  VendorsSection,
} from "@/components/event/PlanSections";
import { EmptyState } from "@/components/ui/EmptyState";
import { ui } from "@/components/ui/styles";
import { getDetails, getTableCompanions } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";
import { hasContent, isLocked, SECTION_ORDER, SECTIONS, sectionStatus, type SectionKey } from "@/lib/details";

export default async function DetaliiPage({ params }: PageProps<"/event/[id]/details">) {
  const { id } = await params;
  const [{ event, capabilities }, details] = await Promise.all([getEventContext(id), getDetails(id)]);
  const owner = event.isOwner;
  const eventLocation = event.location ?? "";

  // Guests only see sections with content that their plan includes (same rule as the app).
  const keys = SECTION_ORDER.filter(
    (key) => owner || (!isLocked(key, capabilities) && hasContent(key, details, eventLocation)),
  );

  if (keys.length === 0) {
    return <EmptyState icon={Info} message="Organizatorul nu a adăugat încă detalii." />;
  }

  const seated = !owner && (event.myGuest?.table_id ?? null) !== null && keys.includes("seating");
  const companions = seated ? await getTableCompanions(id) : [];

  /** One section on the wide page; what's empty or locked only shows to the owner, as a line. */
  const wide = (key: SectionKey, title: string, titleClass: string, body: React.ReactNode) =>
    keys.includes(key) ? (
      <section key={key} aria-label={title} className="flex min-w-0 flex-col gap-4">
        <h2 className={titleClass}>{title}</h2>
        {isLocked(key, capabilities) ? (
          <p className="text-sm text-muted">Necesită un plan superior.</p>
        ) : hasContent(key, details, eventLocation) ? (
          body
        ) : (
          <p className="text-sm text-muted">Nu ai adăugat încă nimic aici. Editarea se face deocamdată din aplicație.</p>
        )}
      </section>
    ) : null;
  const rail = `${ui.eyebrow} -mb-2`;

  return (
    <>
    {/* From tablet up, the whole plan at a glance instead of a hub to click through. */}
    <div className="hidden items-start gap-12 md:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
      <div className="flex min-w-0 flex-col gap-12">
        {wide("schedule", SECTIONS.schedule.title, ui.title1, <ScheduleSection details={details} />)}
        {wide("menu", SECTIONS.menu.title, ui.title1, <MenuSection details={details} event={event} />)}
        {wide("seating", SECTIONS.seating.title, ui.title1, <SeatingSection details={details} event={event} companions={companions} />)}
      </div>
      <aside className="flex min-w-0 flex-col gap-10">
        {wide("location", "Locație", rail, <LocationSection details={details} eventLocation={event.location} />)}
        {wide("lodging", SECTIONS.lodging.title, rail, <LodgingSection details={details} />)}
        {wide("vendors", SECTIONS.vendors.title, rail, <VendorsSection details={details} />)}
      </aside>
    </div>

    <div className="grid gap-4 md:hidden">
      {keys.map((key) => {
        const meta = SECTIONS[key];
        const locked = isLocked(key, capabilities);
        const complete = hasContent(key, details, eventLocation);
        const Icon = meta.icon;
        const body = (
          <>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
                locked ? "bg-pending-soft text-pending" : "bg-accent-tint text-accent-text"
              }`}
            >
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold">{meta.title}</span>
              <span className="truncate text-[13px] text-muted">
                {locked ? "Necesită un plan superior" : sectionStatus(key, details, owner, eventLocation)}
              </span>
            </span>
            {owner ? (
              locked ? (
                <Lock size={16} className="text-pending" aria-hidden="true" />
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
          "flex items-center gap-3 rounded-3xl border border-surface-border bg-surface p-4 shadow-card transition sm:p-5";
        return locked ? (
          <div key={key} className={`${className} opacity-80`}>
            {body}
          </div>
        ) : (
          <Link key={key} href={`/event/${id}/details/${key}`} className={`${className} hover:-translate-y-0.5`}>
            {body}
          </Link>
        );
      })}
    </div>
    </>
  );
}
