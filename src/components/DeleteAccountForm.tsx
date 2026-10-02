"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";

import { ui } from "@/components/ui/styles";
import type { FormState } from "@/lib/actions/profile";

interface DeleteAccountFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}

export function DeleteAccountForm({ action }: DeleteAccountFormProps) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className={`${ui.cardPadded} flex flex-col gap-4`}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink">Șterge contul</h2>
        <p className="text-sm text-muted">
          Se șterg contul tău, toate evenimentele pe care le-ai organizat (invitați, momente, poze, fond, chat) și
          răspunsurile, mesajele și pozele tale din evenimentele altora. Acțiunea nu poate fi anulată.
        </p>
      </div>
      <label className="flex items-start gap-3 text-sm text-ink">
        <input type="checkbox" name="confirm" className="mt-0.5 size-5 accent-[var(--color-danger)]" required />
        Înțeleg că datele mele vor fi șterse definitiv.
      </label>
      {state.error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={`${ui.buttonSecondary} w-full border-danger text-danger hover:bg-surface`}
      >
        <Trash2 size={18} aria-hidden="true" />
        {pending ? "Se șterge…" : "Șterge contul definitiv"}
      </button>
    </form>
  );
}
