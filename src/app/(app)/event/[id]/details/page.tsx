import { Info, Lock } from "lucide-react";
import type { ReactNode } from "react";

import { PlanEditButton } from "@/components/event/plan/PlanEditor";
import {
  addTarget,
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
import { hasContent, isLocked, SECTION_ORDER, SECTIONS, sectionMeta, type SectionKey } from "@/lib/details";

/** One card per section, same shape everywhere: icon, short title, a count, the organizer's button. */
export default async function PlanPage({ params }: PageProps<"/event/[id]/details">) {
  const { id } = await params;
  const [{ event, capabilities }, details] = await Promise.all([getEventContext(id), getDetails(id)]);
  const owner = event.isOwner;
  const eventLocation = event.location ?? "";
  const editId = owner ? id : undefined;

  // Guests only see sections with content that their plan includes (same rule as the app).
  const keys = SECTION_ORDER.filter(
    (key) => owner || (!isLocked(key, capabilities) && hasContent(key, details, eventLocation)),
  );
  if (keys.length === 0) {
    return <EmptyState icon={Info} message="Planul nu a fost publicat încă." />;
  }

  const seated = !owner && (event.myGuest?.table_id ?? null) !== null && keys.includes("seating");
  const companions = seated ? await getTableCompanions(id) : [];

  const bodies: Record<SectionKey, ReactNode> = {
    schedule: <ScheduleSection details={details} editId={editId} />,
    location: <LocationSection details={details} eventLocation={event.location} />,
    menu: <MenuSection details={details} event={event} editId={editId} />,
    seating: <SeatingSection details={details} event={event} companions={companions} editId={editId} />,
    lodging: <LodgingSection details={details} editId={editId} />,
    vendors: <VendorsSection details={details} editId={editId} />,
  };

  /** `wide`: the desktop copy, which skips the #anchor (old per-section links came from phones). */
  const card = (key: SectionKey, wide = false) => {
    if (!keys.includes(key)) return null;
    const meta = SECTIONS[key];
    const Icon = meta.icon;
    const locked = isLocked(key, capabilities);
    const filled = hasContent(key, details, eventLocation);
    const venueSaved = details.venue.name.trim().length > 0 || details.venue.address.trim().length > 0;
    const line = locked ? "Disponibil în planurile superioare" : (sectionMeta(key, details) ?? (filled ? null : "Nimic adăugat încă"));

    return (
      <section
        key={key}
        id={wide ? undefined : key}
        aria-labelledby={`plan-${wide ? "d" : "m"}-${key}`}
        className="scroll-mt-24 rounded-3xl border border-surface-border bg-surface shadow-card"
      >
        <header className="flex items-center gap-3 p-4 sm:px-5">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-[12px] ${
              locked ? "bg-surface-2 text-muted" : "bg-accent-tint text-accent-text"
            }`}
          >
            {locked ? <Lock size={17} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 id={`plan-${wide ? "d" : "m"}-${key}`} className="text-[17px] leading-6 font-semibold">
              {meta.title}
            </h2>
            {line !== null ? <p className="truncate text-[13px] leading-[18px] text-muted">{line}</p> : null}
          </div>
          {owner && !locked ? (
            <PlanEditButton
              eventId={id}
              variant="pill"
              target={addTarget(key, details, event)}
              label={key === "location" ? (venueSaved ? "Editează" : "Setează") : "Adaugă"}
            />
          ) : null}
        </header>
        {!locked && filled ? <div className="border-t border-surface-border p-4 sm:px-5">{bodies[key]}</div> : null}
      </section>
    );
  };

  return (
    <>
      {/* Phone and tablet: one column in the app's order. */}
      <div className="flex flex-col gap-4 lg:hidden">{SECTION_ORDER.map((key) => card(key))}</div>
      {/* Desktop: the long lists on the left, the short practical ones on the right. */}
      <div className="hidden items-start gap-5 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">{(["schedule", "menu", "seating"] as const).map((key) => card(key, true))}</div>
        <div className="flex flex-col gap-5">{(["location", "lodging", "vendors"] as const).map((key) => card(key, true))}</div>
      </div>
    </>
  );
}
