import type { EventType } from "@/lib/types";

const COPY: Record<EventType, { day: string; until: string; today: string }> = {
  wedding: { day: "Nunta", until: "până la nuntă", today: "Azi e nunta!" },
  baptism: { day: "Botezul", until: "până la botez", today: "Azi e botezul!" },
  birthday: { day: "Aniversarea", until: "până la aniversare", today: "Azi e aniversarea!" },
  cause: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua evenimentului!" },
  corporate: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua evenimentului!" },
  memorial: { day: "Comemorarea", until: "până la comemorare", today: "Azi e comemorarea" },
  other: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua cea mare!" },
};

function copyFor(type: EventType) {
  return COPY[type] ?? COPY.other;
}

function currentStage(days: number | null): number {
  if (days === null || days > 0) return 1;
  if (days === 0) return 2;
  return 3;
}

/** The cover's countdown: a number with its label before the day, a line of text from then on. */
export function countdownFor(days: number | null, type: EventType): { value: string | null; label: string } | null {
  if (days === null) return null;
  if (days > 0) return { value: String(days), label: `${days === 1 ? "zi" : "zile"} ${copyFor(type).until}` };
  return { value: null, label: days === 0 ? copyFor(type).today : "Povestea continuă în album" };
}

/** The story's four stages (the app's StoryTimeline), as a list beside the content. */
export function StoryStages({ days, type }: { days: number | null; type: EventType }) {
  const stage = currentStage(days);
  return (
    <ol className="flex flex-col">
      {["Lansarea", "Parcursul", copyFor(type).day, "Recap"].map((name, index) => (
        <li
          key={name}
          aria-current={index === stage ? "step" : undefined}
          className="flex items-center gap-3 border-t border-surface-border py-2.5"
        >
          <span
            aria-hidden="true"
            className={`size-3 shrink-0 rounded-full ${
              index > stage
                ? "border-2 border-surface-border"
                : index === stage
                  ? "bg-accent-fill ring-4 ring-accent-tint"
                  : "bg-accent-fill"
            }`}
          />
          <span className={index === stage ? "font-semibold" : "text-muted"}>{name}</span>
        </li>
      ))}
    </ol>
  );
}
