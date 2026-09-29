import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/BrandMark";
import { ui } from "@/components/ui/styles";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  if ((await getSessionUser()) !== null) redirect("/events");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <BrandMark className="h-20 w-28" />
      <h1 className="font-display text-4xl font-bold sm:text-5xl">
        Povestea<span className="text-accent">Noastra</span>
      </h1>
      <p className="max-w-md text-lg text-muted">Mai mult decât o invitație. Toată povestea.</p>
      <Link href="/login" className={ui.buttonPrimary}>
        Intră în cont
      </Link>
      <p className="max-w-xs text-sm text-muted">
        Ai primit o invitație? Deschide linkul personal din mesajul primit pe WhatsApp.
      </p>
    </div>
  );
}
