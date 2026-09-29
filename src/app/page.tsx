import type { Metadata } from "next";

import { LandingOverlays } from "@/components/landing/Overlays";
import { RevealObserver } from "@/components/landing/RevealObserver";
import {
  Contributions,
  Faq,
  Features,
  FinalCta,
  ForWhom,
  Hero,
  HowToStart,
  LandingFooter,
  LandingNav,
  Planners,
  Pricing,
  ProblemSolution,
  Stages,
  Verticals,
  WhyUs,
} from "@/components/landing/sections";
import { Tour } from "@/components/landing/Tour";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "PovesteaNoastra · Mai mult decât o invitație. Toată povestea.",
};

export default async function LandingPage() {
  const signedIn = (await getSessionUser()) !== null;
  const startHref = signedIn ? "/events" : "/login";

  return (
    <LandingOverlays startHref={startHref}>
      <LandingNav signedIn={signedIn} startHref={startHref} />
      <main className="overflow-x-hidden">
        <Hero startHref={startHref} />
        <ProblemSolution />
        <Stages />
        <Verticals />
        <Features />
        <ForWhom />
        <Contributions />
        <Planners />
        <Pricing startHref={startHref} />
        <WhyUs />
        <HowToStart />
        <Faq />
        <FinalCta startHref={startHref} />
      </main>
      <LandingFooter signedIn={signedIn} />
      <Tour />
      <RevealObserver />
    </LandingOverlays>
  );
}
