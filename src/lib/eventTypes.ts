import type { EventType } from "@/lib/invites";

export interface EventTypeMeta {
  emoji: string;
  /** Romanian noun used in copy, e.g. "Nuntă". */
  label: string;
  /** Mirrors the app's utils/eventTypes.ts light/dark gradient pairs. */
  light: [string, string];
  dark: [string, string];
  /** Warm Story 2.0 three-stop band (135°, 0 / 55% / 100%), same in both modes. */
  band: [string, string, string];
}

const EVENT_TYPES: Record<EventType, EventTypeMeta> = {
  wedding: { emoji: "💍", label: "Nuntă", light: ["#F7C8D8", "#C9B6F2"], dark: ["#4A2A44", "#2E2350"], band: ["#F5C36B", "#E8779E", "#7F77DD"] },
  baptism: { emoji: "🍼", label: "Botez", light: ["#CFE7FF", "#E4D6FF"], dark: ["#1F3350", "#2A2B52"], band: ["#C4E6F6", "#A9B8F2", "#C7A8EE"] },
  birthday: { emoji: "🎂", label: "Aniversare", light: ["#FFD8B0", "#FFB9CE"], dark: ["#4A2E22", "#4A2440"], band: ["#FFD98A", "#F5A36B", "#E8779E"] },
  cause: { emoji: "💚", label: "Cauză", light: ["#BFEFD3", "#CFE9FF"], dark: ["#1E3B2E", "#1E2F45"], band: ["#C4EBCF", "#6CC49A", "#2E9E6B"] },
  corporate: { emoji: "🏢", label: "Eveniment corporate", light: ["#D3DDF0", "#C3CFE8"], dark: ["#232B42", "#1C2238"], band: ["#9AADE0", "#5B6BB8", "#3A4180"] },
  memorial: { emoji: "🕊️", label: "Comemorare", light: ["#E2E4EC", "#D7DDF0"], dark: ["#2C2E3D", "#272B42"], band: ["#D6D2DC", "#A29DAD", "#6E6880"] },
  other: { emoji: "✨", label: "Eveniment", light: ["#E8DDFB", "#D6E4FF"], dark: ["#2E2350", "#20263F"], band: ["#F5C36B", "#E8779E", "#7F77DD"] },
};

export function getEventTypeMeta(type: EventType): EventTypeMeta {
  return EVENT_TYPES[type] ?? EVENT_TYPES.other;
}

/** CSS background for a type's Warm Story 2.0 band. */
export function bandBackground(type: EventTypeMeta): string {
  const [a, b, c] = type.band;
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}
