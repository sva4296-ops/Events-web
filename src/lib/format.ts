/** "sâmbătă, 12 septembrie 2026" — event_date is a plain date, so format in
 * UTC to avoid shifting a day in negative-offset timezones. */
export function formatEventDate(date: string | null): string | null {
  if (date === null) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Whole days from today in Romania to the event date; null without a date. Negative once it's past. */
export function daysUntilEvent(date: string | null): number | null {
  if (date === null) return null;
  const eventDay = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(eventDay)) return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bucharest" }).format(new Date());
  return Math.round((eventDay - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Same wording as the app's utils/relativeTime.ts. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);

  if (diff < MINUTE) return "chiar acum";
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return minutes === 1 ? "acum un minut" : `acum ${minutes} de minute`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return hours === 1 ? "acum o oră" : `acum ${hours} ore`;
  }
  const days = Math.floor(diff / DAY);
  if (days === 1) return "ieri";
  if (days < 20) return `acum ${days} zile`;
  return `acum ${days} de zile`;
}

export function timeOfDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount)} ${currency}`;
  }
}

/** Romanian plural buckets: 1 → one, 2–19 (and x02–x19) → few, else "de" form. */
export function pluralRo(count: number, one: string, few: string, other: string): string {
  if (count === 1) return one;
  const mod100 = count % 100;
  if (count === 0 || (mod100 >= 1 && mod100 <= 19)) return few;
  return other;
}

/** Soonest first, then undated, then finished ones, most recent first. */
export function compareEventsByDate(a: { date: string | null }, b: { date: string | null }): number {
  const rank = (days: number | null) => (days === null ? 1 : days >= 0 ? 0 : 2);
  const [daysA, daysB] = [daysUntilEvent(a.date), daysUntilEvent(b.date)];
  if (rank(daysA) !== rank(daysB)) return rank(daysA) - rank(daysB);
  if (daysA === null || daysB === null) return 0;
  return daysA >= 0 ? daysA - daysB : daysB - daysA;
}

function firstUpper(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "Marți, 3 noiembrie": today in Romania. */
export function todayLabel(): string {
  return firstUpper(
    new Intl.DateTimeFormat("ro-RO", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Bucharest" }).format(new Date()),
  );
}

/** The pieces of an agenda row: { day: "12", weekday: "joi", month: "Noiembrie 2026" }. */
export function eventDateParts(date: string | null): { day: string; weekday: string; month: string } | null {
  if (date === null) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("ro-RO", { ...options, timeZone: "UTC" }).format(parsed);
  return {
    day: format({ day: "numeric" }),
    weekday: format({ weekday: "short" }).replace(".", ""),
    month: firstUpper(format({ month: "long", year: "numeric" })),
  };
}
