"use client";

import { ChevronDown } from "lucide-react";

import { ui } from "@/components/ui/styles";
import { COUNTRY_CODES, DEFAULT_COUNTRY, flagOf } from "@/lib/phone";

/**
 * Phone prefix picker: closed it shows just "🇷🇴 +40" so it fits beside the
 * number; open, it's the native list with every country's full name (type a
 * letter to jump). The value is the ISO code, since +1 and +7 are shared.
 */
export function CountrySelect({ iso, onChange }: { iso: string; onChange: (iso: string) => void }) {
  const selected = COUNTRY_CODES.find((country) => country.iso === iso) ?? DEFAULT_COUNTRY;
  const main = COUNTRY_CODES.slice(0, COUNTRY_CODES.findIndex((c) => c.iso === "GR") + 1);
  const rest = COUNTRY_CODES.slice(main.length);
  const option = (country: (typeof COUNTRY_CODES)[number]) => (
    <option key={country.iso} value={country.iso}>
      {flagOf(country.iso)} {country.name} ({country.dialCode})
    </option>
  );

  return (
    <div className={`${ui.input.replace("w-full", "w-[7.5rem]")} relative flex shrink-0 items-center gap-1.5 px-3 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-tint`}>
      <span aria-hidden="true" className="text-lg leading-none">
        {flagOf(selected.iso)}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {selected.dialCode}
      </span>
      <ChevronDown size={16} aria-hidden="true" className="ml-auto text-faint" />
      <select
        value={selected.iso}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Prefixul țării: ${selected.name} ${selected.dialCode}`}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <optgroup label="Cele mai folosite">{main.map(option)}</optgroup>
        <optgroup label="Toate țările">{rest.map(option)}</optgroup>
      </select>
    </div>
  );
}
