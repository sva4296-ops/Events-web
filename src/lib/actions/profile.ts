"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionUser, safeNext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export interface FormState {
  error: string | null;
  saved?: boolean;
}

/** Same write as the app's saveUserName: first/last + derived display_name. */
async function writeName(formData: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (user === null) return { error: "Sesiunea a expirat. Intră din nou în cont." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  if (firstName.length === 0) return { error: "Introdu prenumele." };
  if (lastName.length === 0) return { error: "Introdu numele." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ first_name: firstName, last_name: lastName, display_name: `${firstName} ${lastName}`.trim() })
    .eq("id", user.id);
  if (error) return { error: "A apărut o problemă la salvarea numelui. Te rugăm să încerci din nou." };
  return { error: null, saved: true };
}

export async function saveNameAndContinue(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await writeName(formData);
  if (result.error !== null) return result;
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function updateName(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await writeName(formData);
  if (result.error === null) revalidatePath("/", "layout");
  return result;
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Permanently deletes the signed-in account through the same delete-account
 * Edge Function the app uses (the server client sends this session's token).
 * Linked from Google Play's "delete account" URL.
 */
export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("confirm") !== "on") return { error: "Bifează confirmarea pentru a continua." };

  const user = await getSessionUser();
  if (user === null) return { error: "Sesiunea a expirat. Intră din nou în cont." };

  const supabase = await createClient();
  const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
  if (error) return { error: "Contul nu a putut fi șters. Te rugăm să încerci din nou." };

  // The user no longer exists, so only the local cookies need clearing.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
