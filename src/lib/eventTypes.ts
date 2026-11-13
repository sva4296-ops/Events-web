import type { EventType } from "@/lib/invites";

export interface EventTypeMeta {
  /** Romanian noun used in copy, e.g. "Nuntă". */
  label: string;
}

const EVENT_TYPES: Record<EventType, EventTypeMeta> = {
  wedding: { label: "Nuntă" },
  baptism: { label: "Botez" },
  birthday: { label: "Aniversare" },
  cause: { label: "Cauză" },
  corporate: { label: "Eveniment corporate" },
  memorial: { label: "Comemorare" },
  other: { label: "Eveniment" },
  spontaneous: { label: "Spontan" },
  venue: { label: "Local" },
};

export function getEventTypeMeta(type: EventType): EventTypeMeta {
  return EVENT_TYPES[type] ?? EVENT_TYPES.other;
}
