"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ui } from "@/components/ui/styles";
import { COUNTRY_CODES, DEFAULT_COUNTRY, toE164 } from "@/lib/phone";
import { getBrowserClient } from "@/lib/supabase/browser";

export function PhoneForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dialCode);
  const [localNumber, setLocalNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length < 6) {
      setError("Introdu un număr de telefon valid.");
      return;
    }

    const phone = toE164(dialCode, localNumber);
    setBusy(true);
    const { error: otpError } = await getBrowserClient().auth.signInWithOtp({
      phone,
      options: { channel: "sms" },
    });
    setBusy(false);

    if (otpError !== null) {
      setError(otpError.message);
      return;
    }
    router.push(`/login/verify?phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(nextPath)}`);
  };

  return (
    <form onSubmit={submit} className={`${ui.cardPadded} flex flex-col gap-5`} noValidate>
      <label className="flex flex-col gap-2">
        <span className={ui.label}>Număr de telefon</span>
        <div className="flex gap-2">
          <select
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            className={`${ui.input.replace("w-full", "w-28")} shrink-0 px-3`}
            aria-label="Prefixul țării"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.iso} value={country.dialCode}>
                {country.iso} {country.dialCode}
              </option>
            ))}
          </select>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="712 345 678"
            value={localNumber}
            onChange={(e) => setLocalNumber(e.target.value)}
            className={`${ui.input} flex-1`}
            autoFocus
          />
        </div>
      </label>

      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className={ui.buttonPrimary}>
        {busy ? "Se trimite codul…" : "Trimite codul"}
      </button>
    </form>
  );
}
