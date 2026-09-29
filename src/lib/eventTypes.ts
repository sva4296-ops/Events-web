import type { EventType } from "@/lib/invites";

interface EventTypeMeta {
  emoji: string;
  /** Romanian noun used in copy, e.g. "Nuntă". */
  label: string;
  /** Mirrors the app's utils/eventTypes.ts light/dark gradient pairs. */
  light: [string, string];
  dark: [string, string];
}

const EVENT_TYPES: Record<EventType, EventTypeMeta> = {
  wedding: { emoji: "💍", label: "Nuntă", light: ["#F7C8D8", "#C9B6F2"], dark: ["#4A2A44", "#2E2350"] },
  baptism: { emoji: "🍼", label: "Botez", light: ["#CFE7FF", "#E4D6FF"], dark: ["#1F3350", "#2A2B52"] },
  birthday: { emoji: "🎂", label: "Aniversare", light: ["#FFD8B0", "#FFB9CE"], dark: ["#4A2E22", "#4A2440"] },
  cause: { emoji: "💚", label: "Cauză", light: ["#BFEFD3", "#CFE9FF"], dark: ["#1E3B2E", "#1E2F45"] },
  corporate: { emoji: "🏢", label: "Eveniment corporate", light: ["#D3DDF0", "#C3CFE8"], dark: ["#232B42", "#1C2238"] },
  memorial: { emoji: "🕊️", label: "Comemorare", light: ["#E2E4EC", "#D7DDF0"], dark: ["#2C2E3D", "#272B42"] },
  other: { emoji: "✨", label: "Eveniment", light: ["#E8DDFB", "#D6E4FF"], dark: ["#2E2350", "#20263F"] },
};

export function getEventTypeMeta(type: EventType): EventTypeMeta {
  return EVENT_TYPES[type] ?? EVENT_TYPES.other;
}
