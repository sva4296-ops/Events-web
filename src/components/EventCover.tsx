import type { ReactNode } from "react";

import { CoverArt } from "@/components/CoverArt";
import { EventTypeIcon } from "@/components/EventTypeIcon";
import { getCoverTheme, type CoverDecoration, type CoverTheme } from "@/lib/coverThemes";
import type { EventType } from "@/lib/types";

/** Decoration for an event type's default cover. */
const TYPE_DECORATION: Record<EventType, CoverDecoration> = {
  wedding: "wedrings",
  baptism: "drop",
  birthday: "confetti",
  cause: "hearts",
  corporate: "grid",
  memorial: "line",
  other: "sparkles",
};

/** Default cover when the organizer didn't pick a theme: deep shades of the accent (see --cover-* in globals.css). */
function defaultCover(type: EventType): CoverTheme {
  return {
    id: `default-${type}`,
    colors: ["var(--cover-a)", "var(--cover-b)", "var(--cover-c)"],
    glows: [
      ["var(--cover-glow)", 0.82, 0.25],
      ["var(--cover-b)", 0.15, 0.85],
    ],
    decoration: TYPE_DECORATION[type] ?? "sparkles",
    ink: "var(--cover-ink)",
    accent: "var(--accent)",
    light: false,
  };
}

function CoverPhoto({ url }: { url: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- signed Storage URL
  return <img src={url} alt="" className="absolute inset-0 size-full object-cover" />;
}

/** An event's cover (the app's components/EventCover.tsx): photo, else its picked theme, else the themed default. */
export function EventCover({
  type,
  coverTheme = null,
  photoUrl = null,
  thumbnail = false,
  plain = false,
  className,
  children,
}: {
  type: EventType;
  coverTheme?: string | null;
  photoUrl?: string | null;
  /** Small list square: a soft tint of the event's accent with the type's icon centered. */
  thumbnail?: boolean;
  /** The cover's colors without its illustration, for small sizes. */
  plain?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const picked = getCoverTheme(coverTheme);
  if (thumbnail) {
    const accent = picked?.accent ?? "var(--accent)";
    return (
      <span
        className={`relative flex items-center justify-center overflow-hidden border border-surface-border bg-surface ${className ?? ""}`}
      >
        <span className="absolute inset-0 opacity-[0.16] dark:opacity-[0.28]" style={{ backgroundColor: accent }} />
        <span className="relative text-(--thumb-accent) dark:text-ink" style={{ "--thumb-accent": accent } as React.CSSProperties}>
          <EventTypeIcon type={type} size={22} />
        </span>
        {photoUrl !== null ? <CoverPhoto url={photoUrl} /> : null}
      </span>
    );
  }
  return (
    <CoverArt theme={picked ?? defaultCover(type)} harmonize={picked !== null} plain={plain} className={className}>
      {photoUrl !== null ? <CoverPhoto url={photoUrl} /> : null}
      {children}
    </CoverArt>
  );
}
