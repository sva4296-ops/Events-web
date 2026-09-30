import { Baby, Building, Cake, Flower, Gem, HandHeart, Sparkles, type LucideIcon } from "lucide-react";

import type { EventType } from "@/lib/types";

/** Line icons for the event types, identical to the app's components/EventTypeIcon.tsx. */
export const EVENT_TYPE_ICONS: Record<EventType, LucideIcon> = {
  wedding: Gem,
  baptism: Baby,
  birthday: Cake,
  cause: HandHeart,
  corporate: Building,
  memorial: Flower,
  other: Sparkles,
};

export function EventTypeIcon({
  type,
  size = 22,
  className,
  strokeWidth = 1.8,
}: {
  type: EventType;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = EVENT_TYPE_ICONS[type] ?? Sparkles;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
