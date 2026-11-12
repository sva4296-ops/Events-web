import { isPlausibleStoredPhone, normalizeToStoredPhone } from "@/lib/phone";

/**
 * Turns what an organizer has on a computer into guest rows: a pasted list
 * ("Maria Popescu, 0712 345 678" per line), a CSV export (Google Contacts,
 * Excel) or a vCard file (Contacts on Mac: select all → File → Export vCard).
 * Desktop browsers can't read the address book, so this stands in for the
 * app's contacts picker.
 */

export interface ParsedGuest {
  name: string;
  /** Stored format: digits only, country code first. */
  phone: string;
}

export interface ParseResult {
  guests: ParsedGuest[];
  /** Lines that had something on them but no usable phone number. */
  skipped: string[];
}

const PHONE_IN_TEXT = /(\+|00)?\d[\d\s().\/-]{5,}\d/;

function cleanName(value: string): string {
  return value
    .replace(/^["'\s,;:\t|-]+|["'\s,;:\t|-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toGuest(name: string, rawPhone: string): ParsedGuest | null {
  const phone = normalizeToStoredPhone(rawPhone);
  return isPlausibleStoredPhone(phone) ? { name: cleanName(name), phone } : null;
}

/** One guest per number; the first name seen for it wins. */
function dedupe(guests: ParsedGuest[]): ParsedGuest[] {
  const seen = new Map<string, ParsedGuest>();
  for (const guest of guests) {
    const existing = seen.get(guest.phone);
    if (existing === undefined) seen.set(guest.phone, guest);
    else if (existing.name.length === 0 && guest.name.length > 0) seen.set(guest.phone, guest);
  }
  return [...seen.values()];
}

function parseVCard(text: string): ParseResult {
  const guests: ParsedGuest[] = [];
  const skipped: string[] = [];
  // Unfold continuation lines (RFC 6350 §3.2) before reading properties.
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  for (const card of unfolded.split(/BEGIN:VCARD/i).slice(1)) {
    const lines = card.split(/\r?\n/);
    const value = (prop: string) => {
      const line = lines.find((l) => new RegExp(`^(item\\d+\\.)?${prop}[;:]`, "i").test(l));
      return line === undefined ? null : line.slice(line.indexOf(":") + 1).trim();
    };
    let name = value("FN") ?? "";
    if (name.length === 0) {
      const [family = "", given = ""] = (value("N") ?? "").split(";");
      name = `${given} ${family}`;
    }
    name = name.replace(/\\,/g, ",").replace(/\\;/g, ";");
    const tel = value("TEL");
    const guest = tel !== null ? toGuest(name, tel) : null;
    if (guest !== null) guests.push(guest);
    else if (name.trim().length > 0) skipped.push(name.trim());
  }
  return { guests: dedupe(guests), skipped };
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(current);
      current = "";
    } else current += char;
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

/** A CSV with a header row: pick the name and phone columns by their titles. */
function parseCsvWithHeader(lines: string[], delimiter: string): ParseResult | null {
  const header = splitCsvLine(lines[0], delimiter).map((cell) => cell.toLowerCase());
  const phoneCol = header.findIndex((h) => /phone|telefon|mobil|tel\b|număr|numar/.test(h) && !/type|label|tip/.test(h));
  if (phoneCol === -1) return null;
  const fullCol = header.findIndex((h) => /^(name|nume|full name|nume complet|display name)$/.test(h));
  const firstCol = header.findIndex((h) => /first name|given name|prenume/.test(h));
  const lastCol = header.findIndex((h) => /last name|family name|^nume de familie/.test(h));

  const guests: ParsedGuest[] = [];
  const skipped: string[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line, delimiter);
    const name =
      fullCol !== -1 && (cells[fullCol] ?? "").length > 0
        ? cells[fullCol]
        : `${firstCol !== -1 ? (cells[firstCol] ?? "") : ""} ${lastCol !== -1 ? (cells[lastCol] ?? "") : ""}`;
    // Google exports several numbers in one cell as "a ::: b"; take the first.
    const rawPhone = (cells[phoneCol] ?? "").split(":::")[0];
    const guest = toGuest(name, rawPhone);
    if (guest !== null) guests.push(guest);
    else if (line.replace(/[,;\t\s"]/g, "").length > 0) skipped.push(cleanName(name) || line.trim());
  }
  return { guests: dedupe(guests), skipped };
}

/** Free text: each line holds one number and, around it, the name. */
function parseLines(lines: string[]): ParseResult {
  const guests: ParsedGuest[] = [];
  const skipped: string[] = [];
  for (const line of lines) {
    const match = line.match(PHONE_IN_TEXT);
    const guest = match !== null ? toGuest(line.replace(match[0], " "), match[0]) : null;
    if (guest !== null) guests.push(guest);
    else skipped.push(line.trim());
  }
  return { guests: dedupe(guests), skipped };
}

export function parseGuestList(text: string): ParseResult {
  if (/BEGIN:VCARD/i.test(text)) return parseVCard(text);

  const lines = text
    .replace(/^﻿/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { guests: [], skipped: [] };

  // A first line without a number that names a phone column is a CSV header.
  if (!PHONE_IN_TEXT.test(lines[0])) {
    const delimiter = [",", ";", "\t"].sort((a, b) => lines[0].split(b).length - lines[0].split(a).length)[0];
    const csv = parseCsvWithHeader(lines, delimiter);
    if (csv !== null) return csv;
  }
  return parseLines(lines);
}
