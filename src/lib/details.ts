import type { LucideIcon } from "lucide-react";
import { Briefcase, Clock, Coffee, House, MapPin, Users } from "lucide-react";

import type { Details } from "@/lib/data/content";
import { pluralRo } from "@/lib/format";
import type { PlanCapabilities } from "@/lib/types";

export type SectionKey = "schedule" | "location" | "menu" | "seating" | "lodging" | "vendors";

export interface SectionMeta {
  key: SectionKey;
  title: string;
  icon: LucideIcon;
}

export const SECTIONS: Record<SectionKey, SectionMeta> = {
  schedule: { key: "schedule", title: "Program", icon: Clock },
  location: { key: "location", title: "Locație", icon: MapPin },
  menu: { key: "menu", title: "Meniu", icon: Coffee },
  seating: { key: "seating", title: "Mese", icon: Users },
  lodging: { key: "lodging", title: "Cazare", icon: House },
  vendors: { key: "vendors", title: "Furnizori", icon: Briefcase },
};

export const SECTION_ORDER: SectionKey[] = ["schedule", "location", "menu", "seating", "lodging", "vendors"];

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_ORDER as string[]).includes(value);
}

export function isLocked(key: SectionKey, caps: PlanCapabilities): boolean {
  if (key === "lodging") return !caps.lodgingTransportEnabled;
  if (key === "vendors") return !caps.vendorTaggingEnabled;
  return false;
}

/** `eventLocation`: the free-text location typed when the event was created, used until a venue is set. */
export function hasContent(key: SectionKey, d: Details, eventLocation = ""): boolean {
  switch (key) {
    case "schedule":
      return d.schedule.length > 0;
    case "location":
      return d.venue.name.trim().length > 0 || d.venue.address.trim().length > 0 || eventLocation.trim().length > 0;
    case "menu":
      return d.menuOptions.length > 0;
    case "seating":
      return d.seatingTables.length > 0;
    case "lodging":
      return d.accommodations.length > 0;
    case "vendors":
      return d.vendors.length > 0;
  }
}

/** The short line under a section's title: counts only, null when there's nothing to count. */
export function sectionMeta(key: SectionKey, d: Details): string | null {
  const n = (count: number, one: string, few: string, other: string) =>
    count === 0 ? null : `${count} ${pluralRo(count, one, few, other)}`;
  switch (key) {
    case "schedule":
      return n(d.schedule.length, "moment", "momente", "de momente");
    case "location":
      return null;
    case "menu":
      return n(d.menuOptions.length, "meniu", "meniuri", "de meniuri");
    case "seating": {
      const tables = n(d.seatingTables.length, "masă", "mese", "de mese");
      if (tables === null) return null;
      const seats = d.seatingTables.reduce((sum, table) => sum + table.seatCount, 0);
      return seats > 0 ? `${tables} · ${seats} ${pluralRo(seats, "loc", "locuri", "de locuri")}` : tables;
    }
    case "lodging":
      return n(d.accommodations.length, "opțiune", "opțiuni", "de opțiuni");
    case "vendors":
      return n(d.vendors.length, "furnizor", "furnizori", "de furnizori");
  }
}
