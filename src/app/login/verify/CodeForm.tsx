"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { ui } from "@/components/ui/styles";
import { getBrowserClient } from "@/lib/supabase/browser";

const RESEND_COOLDOWN_SECONDS = 30;

export function CodeForm({ phone, nextPath }: { phone: string; nextPath: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const token = code.replace(/\D/g, "");
    if (token.length === 0) {
      setError("Introdu codul primit.");
      return;
    }

    setBusy(true);
    const { error: verifyError } = await getBrowserClient().auth.verifyOtp({ phone, token, type: "sms" });
    if (verifyError !== null) {
      setBusy(false);
      setError("Codul este incorect sau a expirat.");
      return;
    }
    // Server pages decide what's next (name step, or straight to nextPath).
    router.replace(nextPath);
    router.refresh();
  };

  const resend = async () => {
    setError(null);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const { error: otpError } = await getBrowserClient().auth.signInWithOtp({
      phone,
      options: { channel: "sms" },
    });
    if (otpError !== null) setError(otpError.message);
  };

  return (
    <form onSubmit={submit} className={`${ui.cardPadded} flex flex-col gap-5`} noValidate>
      <label className="flex flex-col gap-2">
        <span className={ui.label}>Cod de verificare</span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`${ui.input} text-center text-2xl tracking-[0.4em]`}
          autoFocus
        />
      </label>

      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy} className={ui.buttonPrimary}>
        {busy ? "Se verifică…" : "Verifică"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-muted hover:text-accent">
          Alt număr
        </Link>
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="font-semibold text-accent disabled:text-muted"
        >
          {cooldown > 0 ? `Retrimite codul (${cooldown}s)` : "Retrimite codul"}
        </button>
      </div>
    </form>
  );
}
