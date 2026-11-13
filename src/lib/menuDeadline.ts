/**
 * Menu-choice deadline, the app's utils/menuDeadline.ts (mirrors
 * public.menu_choice_closed()): the LAST day a guest can change is
 * event_date minus choice_deadline_days, in Romanian time.
 */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Max 14 on purpose: "cu N zile" (no "de") is right for N < 20. */
export const MENU_DEADLINE_CHOICES = [1, 2, 3, 5, 7, 14] as const;

/** 'YYYY-MM-DD' of the last day to choose, or null when the event has no date. */
export function lastMenuChoiceDay(eventDate: string | null, days: number): string | null {
  const value = (eventDate ?? "").trim().slice(0, 10);
  if (!ISO_DAY.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  return new Date(Date.UTC(year, month - 1, day - days)).toISOString().slice(0, 10);
}

function bucharestToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isMenuChoiceClosed(eventDate: string | null, days: number): boolean {
  const last = lastMenuChoiceDay(eventDate, days);
  return last !== null && bucharestToday() > last;
}

export function deadlineDaysLabel(days: number): string {
  return days === 1 ? "cu 1 zi înainte" : `cu ${days} zile înainte`;
}

/** "12 noiembrie" */
export function formatShortDay(isoDay: string): string {
  const [year, month, day] = isoDay.split("-").map(Number);
  return new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}
