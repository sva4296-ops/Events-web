import type { LucideIcon } from "lucide-react";
import { Briefcase, Clock, Coffee, House, MapPin, Users } from "lucide-react";

import type { Details } from "@/lib/data/content";
import { pluralRo } from "@/lib/format";
import type { PlanCapabilities } from "@/lib/types";

export type SectionKey = "schedule" | "location" | "menu" | "seating" | "lodging" | "vendors";

export interface SectionMeta {
  key: SectionKey;
  title: string;
  description?: string;
  icon: LucideIcon;
}

export const SECTIONS: Record<SectionKey, SectionMeta> = {
  schedule: { key: "schedule", title: "Programul zilei", icon: Clock },
  location: { key: "location", title: "Locație și cum ajungi", icon: MapPin },
  menu: {
    key: "menu",
    title: "Meniul serii",
    description: "Ce se servește și preferințele alimentare ale invitaților.",
    icon: Coffee,
  },
  seating: {
    key: "seating",
    title: "Așezarea la mese",
    description: "Cine stă la fiecare masă în seara evenimentului.",
    icon: Users,
  },
  lodging: {
    key: "lodging",
    title: "Cazare recomandată",
    description: "Unde pot sta invitații care vin de departe.",
    icon: House,
  },
  vendors: {
    key: "vendors",
    title: "Cei care fac totul posibil",
    description: "Furnizorii care au ajutat să prindă viață seara aceasta.",
    icon: Briefcase,
  },
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

export function hasContent(key: SectionKey, d: Details): boolean {
  switch (key) {
    case "schedule":
      return d.schedule.length > 0;
    case "location":
      return d.venue.name.trim().length > 0 || d.venue.address.trim().length > 0;
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

/** One-line status under each hub card — guest wording where it differs (see the app's detalii.tsx). */
export function sectionStatus(key: SectionKey, d: Details, owner: boolean): string {
  switch (key) {
    case "schedule":
      return d.schedule.length === 0
        ? "Niciun program adăugat"
        : `${d.schedule.length} ${pluralRo(d.schedule.length, "activitate", "activități", "de activități")}`;
    case "location":
      return d.venue.address.trim() || d.venue.name.trim() || "Locația nu e setată";
    case "menu":
      return d.menuOptions.length === 0
        ? "Meniul nu e setat"
        : owner
          ? `${d.menuOptions.length} ${pluralRo(d.menuOptions.length, "meniu", "meniuri", "de meniuri")}`
          : "Vezi ce se servește";
    case "seating": {
      if (d.seatingTables.length === 0) return "Nicio masă adăugată";
      if (!owner) return "Vezi unde stai";
      const seats = d.seatingTables.reduce((sum, table) => sum + table.seatCount, 0);
      return `${seats} ${pluralRo(seats, "loc", "locuri", "de locuri")}`;
    }
    case "lodging":
      return d.accommodations.length === 0
        ? "Nicio cazare adăugată"
        : `${d.accommodations.length} ${pluralRo(d.accommodations.length, "opțiune", "opțiuni", "de opțiuni")} de cazare`;
    case "vendors":
      return d.vendors.length === 0
        ? "Niciun furnizor adăugat"
        : `${d.vendors.length} ${pluralRo(d.vendors.length, "furnizor", "vendors", "de furnizori")}`;
  }
}
