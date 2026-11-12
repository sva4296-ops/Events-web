"use client";

import { ClipboardList, Gift, House, Images, Radio, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FUND_ENABLED } from "@/lib/features";

/** `prefetch`: light tabs (a few small selects) are loaded fully in the background when the
 * event opens, so even the first switch to them is instant. Live and Album sign a URL for
 * every photo, so they keep the default (only the loading shell is prefetched). */
const ALL_TABS = [
  { segment: "", label: "Acasă", icon: House, prefetch: true },
  { segment: "details", label: "Plan", icon: ClipboardList, prefetch: true },
  { segment: "guests", label: "Invitați", icon: Users, ownerOnly: true, prefetch: true },
  { segment: "fund", label: "Fond", icon: Gift, prefetch: false },
  { segment: "live", label: "Live", icon: Radio, prefetch: false },
  { segment: "album", label: "Album", icon: Images, prefetch: false },
] as const;

const TABS = ALL_TABS.filter((tab) => FUND_ENABLED || tab.segment !== "fund");

/** The guest list is the organizer's tool, like the app's guests screen. */
const tabsFor = (isOwner: boolean) => TABS.filter((tab) => isOwner || !("ownerOnly" in tab));

function useTabs(eventId: string) {
  const pathname = usePathname();
  const base = `/event/${eventId}`;
  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname === `${base}/${segment}` || pathname.startsWith(`${base}/${segment}/`);
  return { base, isActive };
}

/** From tablet up: a tab row across the window, sticking to the top under the cover.
 * Phone: a bottom bar docked to the edge, same as the app's tab bar. */
export function TabNav({ eventId, isOwner }: { eventId: string; isOwner: boolean }) {
  const { base, isActive } = useTabs(eventId);
  const tabs = tabsFor(isOwner);

  return (
    <>
      <div className="full-bleed sticky top-0 z-30 hidden border-b border-surface-border bg-(--bg) md:block">
        <nav
          aria-label="Secțiunile evenimentului"
          className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-8 text-[15px] font-semibold"
        >
          {tabs.map(({ segment, label, prefetch }) => {
            const active = isActive(segment);
            return (
              <Link
                key={label}
                href={segment === "" ? base : `${base}/${segment}`}
                prefetch={prefetch ? true : "auto"}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center whitespace-nowrap px-3.5 transition focus-visible:-outline-offset-2 ${
                  active ? "text-accent-text shadow-[inset_0_-2px_0_var(--accent)]" : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <nav
        aria-label="Secțiunile evenimentului"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-between border-t border-surface-border bg-surface px-1.5 pt-2 md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {tabs.map(({ segment, label, icon: Icon, prefetch }) => {
          const active = isActive(segment);
          return (
            <Link
              key={label}
              href={segment === "" ? base : `${base}/${segment}`}
              prefetch={prefetch ? true : "auto"}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-[3px] text-[11px]"
            >
              <span
                className={`flex h-[30px] w-12 items-center justify-center rounded-full transition ${
                  active ? "bg-accent-tint text-accent-text" : "text-muted"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2 : 1.8} aria-hidden="true" />
              </span>
              <span className={active ? "font-semibold text-accent-text" : "font-medium text-muted"}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
