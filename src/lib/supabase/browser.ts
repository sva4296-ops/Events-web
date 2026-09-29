"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Browser client — shares the same cookie session as the server client.
 * Used for OTP login, Realtime (chat) and Storage uploads (Live). */
export function getBrowserClient(): SupabaseClient {
  if (client !== null) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );
  return client;
}
