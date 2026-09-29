"use client";

import { useOptimistic, useTransition } from "react";

import { updateDietaryPreferences } from "@/lib/actions/content";

/** Stored values stay the app's exact strings (they're compared server-side); only labels are display. */
const OPTIONS = ["Vegetarian", "Vegan", "Fără gluten", "Fără lactoză"] as const;

export function DietaryPills({ eventId, selected }: { eventId: string; selected: string[] }) {
  const [, startTransition] = useTransition();
  const [current, setCurrent] = useOptimistic(selected);

  const toggle = (option: string) => {
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    startTransition(async () => {
      setCurrent(next);
      await updateDietaryPreferences(eventId, next);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">Preferințele tale alimentare</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const active = current.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active ? "border-accent bg-accent text-white" : "border-surface-border bg-surface text-ink hover:border-accent"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
