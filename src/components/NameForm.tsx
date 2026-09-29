"use client";

import { useActionState } from "react";

import { ui } from "@/components/ui/styles";
import type { FormState } from "@/lib/actions/profile";

interface NameFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  defaultFirstName?: string;
  defaultLastName?: string;
  nextPath?: string;
}

export function NameForm({ action, submitLabel, defaultFirstName, defaultLastName, nextPath }: NameFormProps) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className={`${ui.cardPadded} flex flex-col gap-5`}>
      {nextPath !== undefined ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={ui.label}>Prenume</span>
          <input
            name="firstName"
            placeholder="Maria"
            autoComplete="given-name"
            defaultValue={defaultFirstName}
            className={ui.input}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={ui.label}>Nume</span>
          <input
            name="lastName"
            placeholder="Popescu"
            autoComplete="family-name"
            defaultValue={defaultLastName}
            className={ui.input}
            required
          />
        </label>
      </div>
      {state.error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : state.saved ? (
        <p role="status" className="text-sm text-confirmed">
          Salvat.
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={ui.buttonPrimary}>
        {pending ? "Se salvează…" : submitLabel}
      </button>
    </form>
  );
}
