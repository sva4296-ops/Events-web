"use client";

import { Gift, House, Image as ImageIcon, List, MessageCircle, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { segment: "", label: "Acasă", icon: House },
  { segment: "details", label: "Detalii", icon: List },
  { segment: "fund", label: "Fond", icon: Gift },
  { segment: "chat", label: "Chat", icon: MessageCircle },
  { segment: "live", label: "Live", icon: Radio },
  { segment: "album", label: "Album", icon: ImageIcon },
] as const;

/** Desktop/tablet: a pill row under the title. Mobile: a bottom bar docked to
 * the edge, same as the app's Warm Story 2.0 tab bar. */
export function TabNav({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const base = `/event/${eventId}`;

  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname === `${base}/${segment}` || pathname.startsWith(`${base}/${segment}/`);

  return (
    <>
      <nav
        aria-label="Secțiunile evenimentului"
        className="hidden gap-1 overflow-x-auto rounded-full border border-surface-border bg-surface p-1.5 shadow-card md:flex"
      >
        {TABS.map(({ segment, label, icon: Icon }) => {
          const active = isActive(segment);
          return (
            <Link
              key={label}
              href={segment === "" ? base : `${base}/${segment}`}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                active ? "bg-accent-tint text-accent-text" : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Secțiunile evenimentului"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-between border-t border-surface-border bg-surface/95 px-1.5 pt-2 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {TABS.map(({ segment, label, icon: Icon }) => {
          const active = isActive(segment);
          return (
            <Link
              key={label}
              href={segment === "" ? base : `${base}/${segment}`}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-[3px] text-[11px]"
            >
              <span
                className={`flex h-[30px] w-12 items-center justify-center rounded-full transition ${
                  active ? "bg-accent-tint text-accent-text" : "text-muted"
                }`}
              >
                <Icon size={21} strokeWidth={active ? 2 : 1.8} aria-hidden="true" />
              </span>
              <span className={active ? "font-bold text-accent-text" : "font-medium text-muted"}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
