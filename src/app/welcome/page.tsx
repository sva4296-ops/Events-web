import { redirect } from "next/navigation";

import { NameForm } from "@/components/NameForm";
import { saveNameAndContinue } from "@/lib/actions/profile";
import { getProfile, getSessionUser, safeNext } from "@/lib/auth";

export const metadata = { title: "Cum te numești? · PovesteaNoastra" };

export default async function WelcomePage({ searchParams }: PageProps<"/welcome">) {
  const { next } = await searchParams;
  const nextPath = safeNext(typeof next === "string" ? next : null);

  const user = await getSessionUser();
  if (user === null) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  const profile = await getProfile(user.id);
  if (profile?.firstName) redirect(nextPath);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Cum te numești?</h1>
          <p className="text-muted">Așa vei apărea pentru ceilalți pe PovesteaNoastra.</p>
        </div>
        <NameForm action={saveNameAndContinue} submitLabel="Continuă" nextPath={nextPath} />
      </div>
    </div>
  );
}
