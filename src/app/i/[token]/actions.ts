"use server";

import { revalidatePath } from "next/cache";

import { respondToInvite, type RsvpStatus } from "@/lib/invites";

export interface RsvpActionState {
  error: string | null;
}

export async function submitRsvp(
  token: string,
  _previous: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const status = formData.get("status");
  if (status !== "confirmed" && status !== "declined") {
    return { error: "Răspuns invalid." };
  }

  let result: RsvpStatus | null;
  try {
    result = await respondToInvite(token, status);
  } catch {
    return { error: "Nu am putut salva răspunsul. Încearcă din nou." };
  }
  if (result === null) {
    return { error: "Invitația nu a fost găsită." };
  }

  revalidatePath(`/i/${token}`);
  return { error: null };
}
