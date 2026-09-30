import { CalendarHeart, UserRound } from "lucide-react";
import Link from "next/link";

import { BrandHeader } from "@/components/BrandMark";
import { getSessionUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="flex items-center justify-between gap-4">
      <Link href={user !== null ? "/events" : "/"} aria-label="PovesteaNoastra, acasă">
        <BrandHeader />
      </Link>
      {user !== null ? (
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Cont">
          <Link
            href="/events"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-accent-soft hover:text-accent-text"
          >
            <CalendarHeart size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Evenimentele mele</span>
          </Link>
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-accent-soft hover:text-accent-text"
          >
            <UserRound size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Cont</span>
          </Link>
        </nav>
      ) : (
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-semibold text-accent-text transition hover:bg-accent-soft"
        >
          Intră în cont
        </Link>
      )}
    </header>
  );
}
