/**
 * Ported from the app's utils/whatsappInvite.ts — same text, same link, so an
 * invite sent from the site reads exactly like one sent from the phone.
 * Keep the two in sync when the copy changes.
 */

/** Same host the app links to (app.json's associated domains point here too). */
export const INVITE_SITE_URL = "https://events-web-henna.vercel.app";

export type SpontaneousTemplate = "karaoke" | "party" | "tasting" | "trip" | "outing" | "limited";

export interface InviteMessageEvent {
  /** events.type; unknown values read as "other". */
  type: string;
  name: string;
  date: string | null;
  location: string | null;
  inviteIntro: string | null;
  template: SpontaneousTemplate | null;
  startTime: string | null;
  replyBy: string | null;
}

export function buildGuestInviteLink(inviteToken: string): string {
  return `${INVITE_SITE_URL}/i/${inviteToken}`;
}

const TYPE_COPY: Record<string, { emoji: string; line: string }> = {
  wedding: { emoji: "💍", line: "Ne-ar bucura să fii alături de noi în ziua cea mare." },
  baptism: { emoji: "🍼", line: "Ne-ar bucura să fii alături de noi la acest început de drum." },
  birthday: { emoji: "🎂", line: "Ne-ar bucura să sărbătorim împreună." },
  cause: { emoji: "💚", line: "Ne-ar bucura să fii alături de noi pentru această cauză." },
  corporate: { emoji: "🏢", line: "Ne-ar bucura să fii prezent." },
  memorial: { emoji: "", line: "Prezența ta ne-ar fi de mare sprijin." },
  other: { emoji: "✨", line: "Ne-ar bucura să fii alături de noi." },
  spontaneous: { emoji: "⚡", line: "Hai și tu!" },
  venue: { emoji: "🎟️", line: "Rezervă-ți locul din timp." },
};

const TEMPLATE_COPY: Record<SpontaneousTemplate, { emoji: string; line: string }> = {
  karaoke: { emoji: "🎤", line: "Microfoanele sunt pregătite, scuzele nu se acceptă." },
  party: { emoji: "🎉", line: "Hai să ne vedem, o să fie fain!" },
  tasting: { emoji: "🍷", line: "Locurile sunt limitate, spune-mi repede dacă vii." },
  trip: { emoji: "🎒", line: "Facem o ieșire din oraș, vino cu noi!" },
  outing: { emoji: "📍", line: "Ieșim în oraș, hai și tu!" },
  limited: { emoji: "🎟️", line: "Locurile sunt limitate, spune-mi repede dacă vii." },
};

function formatDate(value: string | null, withYear: boolean): string | null {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length === 0) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return parsed.toLocaleDateString("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export function buildGuestInviteMessage(guestName: string, event: InviteMessageEvent, inviteToken: string): string {
  const name = guestName.trim();
  const custom = event.inviteIntro?.trim() ?? "";
  const location = event.location?.trim() ?? "";

  if (event.type === "spontaneous") {
    const copy = event.template !== null ? TEMPLATE_COPY[event.template] : TYPE_COPY.spontaneous;
    const date = formatDate(event.date, false);
    const time = event.startTime?.trim() ?? "";
    const replyBy = formatDate(event.replyBy, false);
    const details = [
      date !== null ? `📅 ${date}${time.length > 0 ? ` · ${time}` : ""}` : null,
      location.length > 0 ? `📍 ${location}` : null,
      replyBy !== null ? `⏳ Răspunde până ${replyBy}` : null,
    ].filter((line): line is string => line !== null);
    return [
      `${name.length > 0 ? `Bună ${name}!` : "Bună!"} ${copy.emoji}`,
      custom.length > 0 ? custom : `Te chem la „${event.name.trim()}”. ${copy.line}`,
      ...(details.length > 0 ? ["", ...details] : []),
      "",
      "Spune-mi dacă vii, dintr-un tap:",
      buildGuestInviteLink(inviteToken),
    ].join("\n");
  }

  const copy = TYPE_COPY[event.type] ?? TYPE_COPY.other;
  const memorial = event.type === "memorial";
  const greeting = memorial
    ? name.length > 0
      ? `Bună ziua, ${name},`
      : "Bună ziua,"
    : `${name.length > 0 ? `Bună ${name}!` : "Bună!"} ${copy.emoji}`;
  const intro =
    custom.length > 0
      ? custom
      : `Te invităm${memorial ? "" : " cu drag"} la „${event.name.trim()}”. ${copy.line}`;
  const date = formatDate(event.date, true);
  const details = [date !== null ? `📅 ${date}` : null, location.length > 0 ? `📍 ${location}` : null].filter(
    (line): line is string => line !== null,
  );

  return [
    greeting,
    intro,
    ...(details.length > 0 ? ["", ...details] : []),
    "",
    "Invitația ta personală, unde poți confirma dacă ajungi:",
    buildGuestInviteLink(inviteToken),
  ].join("\n");
}

/** `phone` is the stored format: digits only, country code first. */
export function whatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


/**
 * The app's buildCoOrganizerMessage. No personal link: access comes from
 * signing in with this same phone number (event_members auto-link).
 */
export function buildCoOrganizerMessage(name: string, eventName: string): string {
  const trimmed = name.trim();
  return [
    `${trimmed.length > 0 ? `Bună ${trimmed}!` : "Bună!"} Te-am adăugat co-organizator la „${eventName.trim()}” în PovesteaNoastra.`,
    "",
    "Descarcă aplicația și intră cu acest număr de telefon. Evenimentul apare la „Evenimentele mele”:",
    INVITE_SITE_URL,
  ].join("\n");
}
