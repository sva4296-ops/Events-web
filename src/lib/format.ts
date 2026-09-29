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
