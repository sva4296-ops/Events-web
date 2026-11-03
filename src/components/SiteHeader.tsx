import { CalendarHeart } from "lucide-react";
import Link from "next/link";

import { BrandHeader } from "@/components/BrandMark";
import { getProfile, getSessionUser } from "@/lib/auth";

const LINK = "flex min-h-11 items-center rounded-full text-sm font-semibold transition";

/** The app pages' top bar: sticky, across the whole window. */
export async function SiteHeader({ active }: { active?: "events" | "account" }) {
  const user = await getSessionUser();
  const profile = user !== null ? await getProfile(user.id) : null;
  const initials = [profile?.firstName, profile?.lastName].map((name) => name?.trim().charAt(0).toUpperCase() ?? "").join("");

  return (
    <header className="full-bleed sticky top-0 z-30 -mt-8 border-b border-surface-border bg-(--bg) lg:-mt-12">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
        <Link href={user !== null ? "/events" : "/"} aria-label="PovesteaNoastra, acasă">
          <BrandHeader compact={user !== null} />
        </Link>
        {user !== null ? (
          <nav className="flex items-center gap-1" aria-label="Cont">
            <Link
              href="/events"
              aria-current={active === "events" ? "page" : undefined}
              className={`${LINK} gap-2 px-4 ${active === "events" ? "bg-accent-tint text-accent-text" : "text-muted hover:text-ink"}`}
            >
              <CalendarHeart size={18} aria-hidden="true" />
              Evenimente
            </Link>
            <Link
              href="/account"
              aria-current={active === "account" ? "page" : undefined}
              aria-label="Cont"
              className={`${LINK} gap-2.5 px-1.5 sm:pr-4 ${active === "account" ? "bg-accent-tint text-accent-text" : "text-muted hover:text-ink"}`}
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-xs text-ink" aria-hidden="true">
                {initials}
              </span>
              <span className="hidden sm:inline">Cont</span>
            </Link>
          </nav>
        ) : (
          <Link href="/login" className={`${LINK} px-4 text-accent-text hover:bg-accent-tint`}>
            Intră în cont
          </Link>
        )}
      </div>
    </header>
  );
}
