"use client";

import { Camera, FileText, Heart, House, Image as ImageIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { segment: "", label: "Acasă", icon: House },
  { segment: "details", label: "Detalii", icon: FileText },
  { segment: "fund", label: "Fond", icon: Heart },
  { segment: "chat", label: "Chat", icon: MessageCircle },
  { segment: "live", label: "Live", icon: Camera },
  { segment: "album", label: "Album", icon: ImageIcon },
] as const;

/** Desktop/tablet: a pill row under the title. Mobile: a floating bottom bar,
 * same idea as the app's tab bar. */
export function TabNav({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const base = `/event/${eventId}`;

  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname === `${base}/${segment}` || pathname.startsWith(`${base}/${segment}/`);

  return (
    <>
      <nav
        aria-label="Secțiunile evenimentului"
        className="hidden gap-1 overflow-x-auto rounded-full border border-surface-border bg-surface p-1.5 shadow-lg shadow-black/5 md:flex"
      >
        {TABS.map(({ segment, label, icon: Icon }) => {
          const active = isActive(segment);
          return (
            <Link
              key={label}
              href={segment === "" ? base : `${base}/${segment}`}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                active ? "bg-accent text-white shadow-md shadow-accent/30" : "text-muted hover:bg-accent-soft hover:text-accent"
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
        className="fixed inset-x-3 bottom-3 z-40 flex justify-between rounded-3xl border border-white/10 bg-[#241E36]/95 px-1.5 py-2 shadow-2xl shadow-black/30 backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {TABS.map(({ segment, label, icon: Icon }) => {
          const active = isActive(segment);
          return (
            <Link
              key={label}
              href={segment === "" ? base : `${base}/${segment}`}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 text-[11px] font-semibold"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                  active ? "bg-accent text-gold" : "text-white/55"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className={active ? "text-gold" : "text-white/55"}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
