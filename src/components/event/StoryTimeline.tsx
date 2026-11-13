import { Check } from "lucide-react";

import type { EventType } from "@/lib/types";

const COPY: Record<EventType, { day: string; until: string; today: string }> = {
  wedding: { day: "Nunta", until: "până la nuntă", today: "Azi e nunta!" },
  baptism: { day: "Botezul", until: "până la botez", today: "Azi e botezul!" },
  birthday: { day: "Aniversarea", until: "până la aniversare", today: "Azi e aniversarea!" },
  cause: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua evenimentului!" },
  corporate: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua evenimentului!" },
  memorial: { day: "Comemorarea", until: "până la comemorare", today: "Azi e comemorarea" },
  other: { day: "Evenimentul", until: "până la eveniment", today: "Azi e ziua cea mare!" },
  spontaneous: { day: "Seara", until: "până ne vedem", today: "E azi!" },
  venue: { day: "Seara", until: "până la seară", today: "E diseară!" },
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

/** Wave box: its middle runs through the nodes' centers (the app's WAVE_* constants). */
const WAVE_WIDTH = 400;
const WAVE_HEIGHT = 30;
const WAVE_MIDDLE = 15;
const WAVE_BEND = 22;

/** Curve from stage `index`'s node to the next; nodes sit in the middle of four equal columns. */
function waveSegment(index: number): string {
  const column = WAVE_WIDTH / 4;
  const start = column * (index + 0.5);
  const end = start + column;
  const control = index % 2 === 0 ? WAVE_MIDDLE - WAVE_BEND : WAVE_MIDDLE + WAVE_BEND;
  return `M ${start} ${WAVE_MIDDLE} Q ${(start + end) / 2} ${control} ${end} ${WAVE_MIDDLE}`;
}

/** The story's four stages, the app's StoryTimeline: a winding line, done stages checked, the current one haloed. */
export function StoryStages({ days, type }: { days: number | null; type: EventType }) {
  const stage = currentStage(days);
  const names = ["Lansarea", "Parcursul", copyFor(type).day, "Recap"];
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 h-[30px] w-full"
        style={{ top: 11 - WAVE_MIDDLE }}
        aria-hidden="true"
      >
        {[0, 1, 2].map((index) => (
          <path
            key={index}
            d={waveSegment(index)}
            fill="none"
            strokeLinecap="round"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            // The road travelled is solid, what's ahead dashed.
            stroke={index < stage ? "var(--accent-fill)" : "var(--surface-border)"}
            strokeDasharray={index < stage ? undefined : "4 5"}
          />
        ))}
      </svg>
      <ol className="relative grid grid-cols-4">
        {names.map((name, index) => {
          const done = index < stage;
          const current = index === stage;
          return (
            <li key={name} aria-current={current ? "step" : undefined} className="flex min-w-0 flex-col items-center gap-1.5">
              {done ? (
                <span className="flex size-[22px] items-center justify-center rounded-full bg-accent-fill text-on-accent">
                  <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                </span>
              ) : current ? (
                <span className="-m-1 flex size-[30px] items-center justify-center rounded-full bg-accent-tint">
                  <span className="flex size-[22px] items-center justify-center rounded-full bg-accent-fill">
                    <span className="size-2 rounded-full bg-white" />
                  </span>
                </span>
              ) : (
                <span className="size-[22px] rounded-full border-2 border-surface-border bg-surface" />
              )}
              <span className={`truncate text-xs ${current ? "font-bold text-ink" : "font-medium text-muted"}`}>{name}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
