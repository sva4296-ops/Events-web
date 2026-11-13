"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { saveMenuDeadline } from "@/lib/actions/plan";
import {
  deadlineDaysLabel,
  formatShortDay,
  isMenuChoiceClosed,
  lastMenuChoiceDay,
  MENU_DEADLINE_CHOICES,
} from "@/lib/menuDeadline";

/** Organizer: when guests' menu choice closes (the app's detalii-menu deadline dropdown). */
export function MenuDeadlinePicker({ eventId, eventDate, days }: { eventId: string; eventDate: string | null; days: number }) {
  const router = useRouter();
  const [value, setValue] = useState(days);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const lastDay = lastMenuChoiceDay(eventDate, value);
  const closed = isMenuChoiceClosed(eventDate, value);

  const change = (next: number) => {
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await saveMenuDeadline(eventId, next);
      if (result.error !== null) {
        setValue(previous);
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-1 border-t border-surface-border pt-3">
      <label className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">Alegerea se închide</span>
        <select
          value={value}
          disabled={pending}
          onChange={(e) => change(Number(e.target.value))}
          className="min-h-9 rounded-full border border-surface-border bg-surface px-3 text-sm font-semibold text-ink outline-none focus:border-accent"
        >
          {MENU_DEADLINE_CHOICES.map((choice) => (
            <option key={choice} value={choice}>
              {deadlineDaysLabel(choice)}
            </option>
          ))}
        </select>
      </label>
      {lastDay !== null ? (
        <p className="text-[13px] text-muted">
          {closed ? `Închisă pe ${formatShortDay(lastDay)}` : `Ultima zi: ${formatShortDay(lastDay)}`}
        </p>
      ) : null}
      {error !== null ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
