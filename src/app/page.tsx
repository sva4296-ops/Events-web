import type { Metadata } from "next";

import { Landing } from "@/components/landing/Landing";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "PovesteaNoastra · Mai mult decât o invitație. Toată povestea.",
};

export default async function LandingPage() {
  const signedIn = (await getSessionUser()) !== null;
  return <Landing signedIn={signedIn} startHref={signedIn ? "/events" : "/login"} />;
}
