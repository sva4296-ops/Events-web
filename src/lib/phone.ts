/** Ported from the app's utils/countryCodes.ts — same list, same E.164 rules,
 * so a number typed here matches what the app stores. */
export interface CountryCode {
  iso: string;
  dialCode: string;
  name: string;
}

export const DEFAULT_COUNTRY: CountryCode = { iso: "RO", dialCode: "+40", name: "România" };

export const COUNTRY_CODES: CountryCode[] = [
  DEFAULT_COUNTRY,
  { iso: "GB", dialCode: "+44", name: "Regatul Unit" },
  { iso: "US", dialCode: "+1", name: "SUA" },
  { iso: "CA", dialCode: "+1", name: "Canada" },
  { iso: "DE", dialCode: "+49", name: "Germania" },
  { iso: "FR", dialCode: "+33", name: "Franța" },
  { iso: "IT", dialCode: "+39", name: "Italia" },
  { iso: "ES", dialCode: "+34", name: "Spania" },
  { iso: "NL", dialCode: "+31", name: "Olanda" },
  { iso: "BE", dialCode: "+32", name: "Belgia" },
  { iso: "AT", dialCode: "+43", name: "Austria" },
  { iso: "CH", dialCode: "+41", name: "Elveția" },
  { iso: "IE", dialCode: "+353", name: "Irlanda" },
  { iso: "PT", dialCode: "+351", name: "Portugalia" },
  { iso: "HU", dialCode: "+36", name: "Ungaria" },
  { iso: "BG", dialCode: "+359", name: "Bulgaria" },
  { iso: "MD", dialCode: "+373", name: "Republica Moldova" },
  { iso: "GR", dialCode: "+30", name: "Grecia" },
];

export function toE164(dialCode: string, localNumber: string): string {
  const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  return `${dialCode}${digits}`;
}

/** "+40 712 345 678" for display. */
export function formatE164(e164: string): string {
  const match = COUNTRY_CODES.map((c) => c.dialCode)
    .filter((code) => e164.startsWith(code))
    .sort((a, b) => b.length - a.length)[0];
  if (match === undefined) return e164;
  const local = e164.slice(match.length);
  return `${match} ${(local.match(/.{1,3}/g) ?? [local]).join(" ")}`;
}
