import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Anon-key client, server-side only. The web RSVP page never needs a user
 * session: every read/write goes through the two token-scoped RPCs in the
 * app repo's supabase/migrations/20260929000001_guest_invite_tokens.sql,
 * which are granted to `anon` and can only ever touch the one guest row a
 * token names. Never put the service-role key in this project.
 */
let client: SupabaseClient | null = null;

/** Anonymous client for the token-only RSVP page. */
export function getSupabase(): SupabaseClient {
  if (client !== null) return client;

  const { url, anonKey } = getSupabaseEnv();
  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
