import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  phone: string | null;
}

/**
 * The signed-in user, or null. Cached per request.
 * getClaims() verifies the JWT locally (asymmetric signing keys, JWKS cached),
 * so unlike getUser() it doesn't cost a round trip to Supabase Auth on every page.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (claims === undefined || typeof claims.sub !== "string") return null;
  return { id: claims.sub, phone: typeof claims.phone === "string" && claims.phone.length > 0 ? claims.phone : null };
});

export interface Profile {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
}

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("first_name, last_name, display_name")
    .eq("id", userId)
    .maybeSingle();
  if (data === null) return null;
  return { firstName: data.first_name, lastName: data.last_name, displayName: data.display_name };
});

/**
 * Same gate order as the app's AuthGate: no session → login; no first name
 * yet → the name step. (The app's 4-step tutorial is skipped on web on
 * purpose: people arrive here from an invite and want the invite.)
 */
export async function requireUser(nextPath: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (user === null) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const profile = await getProfile(user.id);
  if (profile === null || profile.firstName === null || profile.firstName.trim().length === 0) {
    redirect(`/welcome?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

/** Only allow same-site relative redirects. */
export function safeNext(next: string | null | undefined, fallback = "/events"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
