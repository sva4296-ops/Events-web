import { LogOut } from "lucide-react";

import { NameForm } from "@/components/NameForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ui } from "@/components/ui/styles";
import { signOut, updateName } from "@/lib/actions/profile";
import { getProfile, requireUser } from "@/lib/auth";
import { formatE164 } from "@/lib/phone";

export const metadata = { title: "Contul meu · PovesteaNoastra" };

export default async function AccountPage() {
  const user = await requireUser("/account");
  const profile = await getProfile(user.id);

  return (
    <div className="flex flex-col gap-8">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <SectionTitle
          eyebrow="Cont"
          title={profile?.displayName ?? "Contul meu"}
          subtitle={user.phone !== null ? formatE164(`+${user.phone.replace(/^\+/, "")}`) : undefined}
        />
        <NameForm
          action={updateName}
          submitLabel="Salvează modificările"
          defaultFirstName={profile?.firstName ?? ""}
          defaultLastName={profile?.lastName ?? ""}
        />
        <form action={signOut}>
          <button type="submit" className={`${ui.buttonSecondary} w-full`}>
            <LogOut size={18} aria-hidden="true" />
            Ieși din cont
          </button>
        </form>
      </div>
    </div>
  );
}
