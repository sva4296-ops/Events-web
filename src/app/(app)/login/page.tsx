import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/BrandMark";
import { getSessionUser, safeNext } from "@/lib/auth";

import { PhoneForm } from "./PhoneForm";

export const metadata = { title: "Intră în cont · PovesteaNoastra" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = safeNext(typeof next === "string" ? next : null);

  if ((await getSessionUser()) !== null) redirect(nextPath);

  return (
    <div className="flex flex-1 flex-col">
      <Link
        href="/"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface transition hover:text-accent-text"
        aria-label="Înapoi la pagina principală"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </Link>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <BrandMark className="h-14 w-20" />
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Bun venit pe PovesteaNoastra</h1>
            <p className="text-muted">
              Intră cu numărul de telefon pe care ai primit invitația. Îți trimitem un cod prin SMS.
            </p>
          </div>
          <PhoneForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
