import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep visited pages in the client router cache, so switching back to a tab
    // (Acasă / Plan / Invitați …) renders instantly instead of re-fetching and
    // flashing the skeleton. Server actions that call revalidatePath() and
    // router.refresh() still clear this cache, so our own edits show up at once.
    staleTimes: {
      dynamic: 120,
    },
  },
};

export default nextConfig;
