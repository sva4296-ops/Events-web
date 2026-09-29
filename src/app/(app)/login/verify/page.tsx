import { redirect } from "next/navigation";

import { safeNext } from "@/lib/auth";
import { formatE164 } from "@/lib/phone";

import { CodeForm } from "./CodeForm";

export const metadata = { title: "Introdu codul · PovesteaNoastra" };

export default async function VerifyPage({ searchParams }: PageProps<"/login/verify">) {
  const { phone, next } = await searchParams;
  if (typeof phone !== "string" || !/^\+\d{6,15}$/.test(phone)) redirect("/login");
  const nextPath = safeNext(typeof next === "string" ? next : null);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Introdu codul</h1>
          <p className="text-muted">
            Am trimis un cod prin SMS la <strong className="text-ink">{formatE164(phone)}</strong>.
          </p>
        </div>
        <CodeForm phone={phone} nextPath={nextPath} />
      </div>
    </div>
  );
}
