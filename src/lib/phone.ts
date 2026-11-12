/** Ported from the app's utils/countryCodes.ts — same countries, same order
 * (the app's main markets first, then everyone else), same E.164 rules, so a
 * number typed here matches what the app stores. Names are in Romanian. */
export interface CountryCode {
  iso: string;
  dialCode: string;
  name: string;
}

export const DEFAULT_COUNTRY: CountryCode = { iso: "RO", dialCode: "+40", name: "România" };

export const COUNTRY_CODES: CountryCode[] = [
  DEFAULT_COUNTRY,
  { iso: "GB", dialCode: "+44", name: "Regatul Unit" },
  { iso: "US", dialCode: "+1", name: "Statele Unite ale Americii" },
  { iso: "CA", dialCode: "+1", name: "Canada" },
  { iso: "DE", dialCode: "+49", name: "Germania" },
  { iso: "FR", dialCode: "+33", name: "Franța" },
  { iso: "IT", dialCode: "+39", name: "Italia" },
  { iso: "ES", dialCode: "+34", name: "Spania" },
  { iso: "NL", dialCode: "+31", name: "Țările de Jos" },
  { iso: "BE", dialCode: "+32", name: "Belgia" },
  { iso: "AT", dialCode: "+43", name: "Austria" },
  { iso: "CH", dialCode: "+41", name: "Elveția" },
  { iso: "IE", dialCode: "+353", name: "Irlanda" },
  { iso: "PT", dialCode: "+351", name: "Portugalia" },
  { iso: "HU", dialCode: "+36", name: "Ungaria" },
  { iso: "BG", dialCode: "+359", name: "Bulgaria" },
  { iso: "MD", dialCode: "+373", name: "Republica Moldova" },
  { iso: "GR", dialCode: "+30", name: "Grecia" },
  // Restul lumii, alfabetic. Insulele NANP (+1 xxx) lipsesc: au același +1 ca SUA.
  { iso: "AF", dialCode: "+93", name: "Afganistan" },
  { iso: "ZA", dialCode: "+27", name: "Africa de Sud" },
  { iso: "AL", dialCode: "+355", name: "Albania" },
  { iso: "DZ", dialCode: "+213", name: "Algeria" },
  { iso: "AD", dialCode: "+376", name: "Andorra" },
  { iso: "AO", dialCode: "+244", name: "Angola" },
  { iso: "SA", dialCode: "+966", name: "Arabia Saudită" },
  { iso: "AR", dialCode: "+54", name: "Argentina" },
  { iso: "AM", dialCode: "+374", name: "Armenia" },
  { iso: "AU", dialCode: "+61", name: "Australia" },
  { iso: "AZ", dialCode: "+994", name: "Azerbaidjan" },
  { iso: "BH", dialCode: "+973", name: "Bahrain" },
  { iso: "BD", dialCode: "+880", name: "Bangladesh" },
  { iso: "BY", dialCode: "+375", name: "Belarus" },
  { iso: "BZ", dialCode: "+501", name: "Belize" },
  { iso: "BJ", dialCode: "+229", name: "Benin" },
  { iso: "BT", dialCode: "+975", name: "Bhutan" },
  { iso: "BO", dialCode: "+591", name: "Bolivia" },
  { iso: "BA", dialCode: "+387", name: "Bosnia și Herțegovina" },
  { iso: "BW", dialCode: "+267", name: "Botswana" },
  { iso: "BR", dialCode: "+55", name: "Brazilia" },
  { iso: "BN", dialCode: "+673", name: "Brunei" },
  { iso: "BF", dialCode: "+226", name: "Burkina Faso" },
  { iso: "BI", dialCode: "+257", name: "Burundi" },
  { iso: "KH", dialCode: "+855", name: "Cambodgia" },
  { iso: "CM", dialCode: "+237", name: "Camerun" },
  { iso: "CV", dialCode: "+238", name: "Capul Verde" },
  { iso: "CZ", dialCode: "+420", name: "Cehia" },
  { iso: "CL", dialCode: "+56", name: "Chile" },
  { iso: "CN", dialCode: "+86", name: "China" },
  { iso: "TD", dialCode: "+235", name: "Ciad" },
  { iso: "CY", dialCode: "+357", name: "Cipru" },
  { iso: "CO", dialCode: "+57", name: "Columbia" },
  { iso: "KM", dialCode: "+269", name: "Comore" },
  { iso: "CG", dialCode: "+242", name: "Congo - Brazzaville" },
  { iso: "CD", dialCode: "+243", name: "Congo - Kinshasa" },
  { iso: "KR", dialCode: "+82", name: "Coreea de Sud" },
  { iso: "CR", dialCode: "+506", name: "Costa Rica" },
  { iso: "CI", dialCode: "+225", name: "Côte d’Ivoire" },
  { iso: "HR", dialCode: "+385", name: "Croația" },
  { iso: "CU", dialCode: "+53", name: "Cuba" },
  { iso: "DK", dialCode: "+45", name: "Danemarca" },
  { iso: "DJ", dialCode: "+253", name: "Djibouti" },
  { iso: "EC", dialCode: "+593", name: "Ecuador" },
  { iso: "EG", dialCode: "+20", name: "Egipt" },
  { iso: "SV", dialCode: "+503", name: "El Salvador" },
  { iso: "AE", dialCode: "+971", name: "Emiratele Arabe Unite" },
  { iso: "ER", dialCode: "+291", name: "Eritreea" },
  { iso: "EE", dialCode: "+372", name: "Estonia" },
  { iso: "SZ", dialCode: "+268", name: "Eswatini" },
  { iso: "ET", dialCode: "+251", name: "Etiopia" },
  { iso: "FJ", dialCode: "+679", name: "Fiji" },
  { iso: "PH", dialCode: "+63", name: "Filipine" },
  { iso: "FI", dialCode: "+358", name: "Finlanda" },
  { iso: "GA", dialCode: "+241", name: "Gabon" },
  { iso: "GM", dialCode: "+220", name: "Gambia" },
  { iso: "GE", dialCode: "+995", name: "Georgia" },
  { iso: "GH", dialCode: "+233", name: "Ghana" },
  { iso: "GI", dialCode: "+350", name: "Gibraltar" },
  { iso: "GL", dialCode: "+299", name: "Groenlanda" },
  { iso: "GT", dialCode: "+502", name: "Guatemala" },
  { iso: "GN", dialCode: "+224", name: "Guineea" },
  { iso: "GQ", dialCode: "+240", name: "Guineea Ecuatorială" },
  { iso: "GW", dialCode: "+245", name: "Guineea-Bissau" },
  { iso: "GY", dialCode: "+592", name: "Guyana" },
  { iso: "HT", dialCode: "+509", name: "Haiti" },
  { iso: "HN", dialCode: "+504", name: "Honduras" },
  { iso: "IN", dialCode: "+91", name: "India" },
  { iso: "ID", dialCode: "+62", name: "Indonezia" },
  { iso: "FO", dialCode: "+298", name: "Insulele Feroe" },
  { iso: "JO", dialCode: "+962", name: "Iordania" },
  { iso: "IQ", dialCode: "+964", name: "Irak" },
  { iso: "IR", dialCode: "+98", name: "Iran" },
  { iso: "IS", dialCode: "+354", name: "Islanda" },
  { iso: "IL", dialCode: "+972", name: "Israel" },
  { iso: "JP", dialCode: "+81", name: "Japonia" },
  { iso: "KZ", dialCode: "+7", name: "Kazahstan" },
  { iso: "KG", dialCode: "+996", name: "Kârgâzstan" },
  { iso: "KE", dialCode: "+254", name: "Kenya" },
  { iso: "XK", dialCode: "+383", name: "Kosovo" },
  { iso: "KW", dialCode: "+965", name: "Kuweit" },
  { iso: "LA", dialCode: "+856", name: "Laos" },
  { iso: "LS", dialCode: "+266", name: "Lesotho" },
  { iso: "LV", dialCode: "+371", name: "Letonia" },
  { iso: "LB", dialCode: "+961", name: "Liban" },
  { iso: "LR", dialCode: "+231", name: "Liberia" },
  { iso: "LY", dialCode: "+218", name: "Libia" },
  { iso: "LI", dialCode: "+423", name: "Liechtenstein" },
  { iso: "LT", dialCode: "+370", name: "Lituania" },
  { iso: "LU", dialCode: "+352", name: "Luxemburg" },
  { iso: "MK", dialCode: "+389", name: "Macedonia de Nord" },
  { iso: "MG", dialCode: "+261", name: "Madagascar" },
  { iso: "MW", dialCode: "+265", name: "Malawi" },
  { iso: "MY", dialCode: "+60", name: "Malaysia" },
  { iso: "MV", dialCode: "+960", name: "Maldive" },
  { iso: "ML", dialCode: "+223", name: "Mali" },
  { iso: "MT", dialCode: "+356", name: "Malta" },
  { iso: "MA", dialCode: "+212", name: "Maroc" },
  { iso: "MR", dialCode: "+222", name: "Mauritania" },
  { iso: "MU", dialCode: "+230", name: "Mauritius" },
  { iso: "MX", dialCode: "+52", name: "Mexic" },
  { iso: "MC", dialCode: "+377", name: "Monaco" },
  { iso: "MN", dialCode: "+976", name: "Mongolia" },
  { iso: "MZ", dialCode: "+258", name: "Mozambic" },
  { iso: "ME", dialCode: "+382", name: "Muntenegru" },
  { iso: "MM", dialCode: "+95", name: "Myanmar (Birmania)" },
  { iso: "NA", dialCode: "+264", name: "Namibia" },
  { iso: "NP", dialCode: "+977", name: "Nepal" },
  { iso: "NI", dialCode: "+505", name: "Nicaragua" },
  { iso: "NE", dialCode: "+227", name: "Niger" },
  { iso: "NG", dialCode: "+234", name: "Nigeria" },
  { iso: "NO", dialCode: "+47", name: "Norvegia" },
  { iso: "NZ", dialCode: "+64", name: "Noua Zeelandă" },
  { iso: "OM", dialCode: "+968", name: "Oman" },
  { iso: "PK", dialCode: "+92", name: "Pakistan" },
  { iso: "PA", dialCode: "+507", name: "Panama" },
  { iso: "PG", dialCode: "+675", name: "Papua-Noua Guinee" },
  { iso: "PY", dialCode: "+595", name: "Paraguay" },
  { iso: "PE", dialCode: "+51", name: "Peru" },
  { iso: "PL", dialCode: "+48", name: "Polonia" },
  { iso: "QA", dialCode: "+974", name: "Qatar" },
  { iso: "HK", dialCode: "+852", name: "R.A.S. Hong Kong, China" },
  { iso: "MO", dialCode: "+853", name: "R.A.S. Macao, China" },
  { iso: "CF", dialCode: "+236", name: "Republica Centrafricană" },
  { iso: "RU", dialCode: "+7", name: "Rusia" },
  { iso: "RW", dialCode: "+250", name: "Rwanda" },
  { iso: "SM", dialCode: "+378", name: "San Marino" },
  { iso: "SN", dialCode: "+221", name: "Senegal" },
  { iso: "RS", dialCode: "+381", name: "Serbia" },
  { iso: "SC", dialCode: "+248", name: "Seychelles" },
  { iso: "SL", dialCode: "+232", name: "Sierra Leone" },
  { iso: "SG", dialCode: "+65", name: "Singapore" },
  { iso: "SY", dialCode: "+963", name: "Siria" },
  { iso: "SK", dialCode: "+421", name: "Slovacia" },
  { iso: "SI", dialCode: "+386", name: "Slovenia" },
  { iso: "SO", dialCode: "+252", name: "Somalia" },
  { iso: "LK", dialCode: "+94", name: "Sri Lanka" },
  { iso: "SD", dialCode: "+249", name: "Sudan" },
  { iso: "SS", dialCode: "+211", name: "Sudanul de Sud" },
  { iso: "SE", dialCode: "+46", name: "Suedia" },
  { iso: "SR", dialCode: "+597", name: "Suriname" },
  { iso: "TJ", dialCode: "+992", name: "Tadjikistan" },
  { iso: "TW", dialCode: "+886", name: "Taiwan" },
  { iso: "TZ", dialCode: "+255", name: "Tanzania" },
  { iso: "PS", dialCode: "+970", name: "Teritoriile Palestiniene" },
  { iso: "TH", dialCode: "+66", name: "Thailanda" },
  { iso: "TG", dialCode: "+228", name: "Togo" },
  { iso: "TN", dialCode: "+216", name: "Tunisia" },
  { iso: "TR", dialCode: "+90", name: "Turcia" },
  { iso: "TM", dialCode: "+993", name: "Turkmenistan" },
  { iso: "UA", dialCode: "+380", name: "Ucraina" },
  { iso: "UG", dialCode: "+256", name: "Uganda" },
  { iso: "UY", dialCode: "+598", name: "Uruguay" },
  { iso: "UZ", dialCode: "+998", name: "Uzbekistan" },
  { iso: "VE", dialCode: "+58", name: "Venezuela" },
  { iso: "VN", dialCode: "+84", name: "Vietnam" },
  { iso: "YE", dialCode: "+967", name: "Yemen" },
  { iso: "ZM", dialCode: "+260", name: "Zambia" },
  { iso: "ZW", dialCode: "+263", name: "Zimbabwe" },
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

/** The app's toStoredPhone: what event_guests.guest_phone holds (digits only, no `+`). */
export function toStoredPhone(dialCode: string, localNumber: string): string {
  return toE164(dialCode, localNumber).replace(/^\+/, "");
}

/**
 * The app's normalizeToStoredPhone, for numbers pasted or imported in any
 * format (`+40 790 586 600`, `0790586600`, `0040790586600`). A `+` or `00`
 * means the country code is already there; otherwise it's read as Romanian.
 */
export function normalizeToStoredPhone(raw: string): string {
  if (raw.includes("+")) return raw.replace(/\D/g, "");
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  return `${DEFAULT_COUNTRY.dialCode.replace("+", "")}${digits.replace(/^0+/, "")}`;
}

/** Stored phone (`40712345678`) shown as `+40 712 345 678`. */
export function formatStoredPhone(phone: string): string {
  return formatE164(`+${phone}`);
}

/** Loose sanity check: a plausible international number once stored. */
export function isPlausibleStoredPhone(phone: string): boolean {
  return /^\d{8,15}$/.test(phone);
}

/** 🇷🇴 from "RO" (regional indicator letters). */
export function flagOf(iso: string): string {
  return String.fromCodePoint(...[...iso.toUpperCase()].map((char) => 0x1f1a5 + char.charCodeAt(0)));
}

/** Reverse of toStoredPhone: `40712345678` → RO + `712345678` (longest matching prefix; +1 reads as the US). */
export function splitStoredPhone(phone: string): { iso: string; local: string } {
  const match = COUNTRY_CODES.filter((country) => phone.startsWith(country.dialCode.slice(1))).sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  )[0];
  return match === undefined
    ? { iso: DEFAULT_COUNTRY.iso, local: phone }
    : { iso: match.iso, local: phone.slice(match.dialCode.length - 1) };
}
