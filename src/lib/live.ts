import "server-only";

import { getSupabase } from "@/lib/supabase/anon";

export interface PublicLive {
  eventName: string;
  eventType: string;
  whepUrl: string;
  isLive: boolean;
}

/** Same shape as invite tokens: 32 lowercase hex chars. */
const TOKEN_PATTERN = /^[0-9a-f]{32}$/;

/** Public watch link (/w/<token>): see get_live_by_token in the app repo's migrations. */
export async function getPublicLive(token: string): Promise<PublicLive | null> {
  if (!TOKEN_PATTERN.test(token)) return null;
  const { data, error } = await getSupabase().rpc("get_live_by_token", { p_token: token });
  if (error) throw error;
  const row = (data as { event_name: string; event_type: string; whep_url: string; is_live: boolean }[] | null)?.[0];
  if (row === undefined) return null;
  return { eventName: row.event_name, eventType: row.event_type, whepUrl: row.whep_url, isLive: row.is_live };
}
