"use client";

import { useEffect, useRef } from "react";

import "./landing.css";
import { initLanding } from "./init";
import { LANDING_MARKUP } from "./markup";

/** The public landing page: static markup from the server, brought to life on the client. */
export function Landing({ signedIn, startHref }: { signedIn: boolean; startHref: string }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const markup = LANDING_MARKUP.replaceAll("__START_HREF__", startHref)
    .replaceAll("__ACCOUNT_HREF__", signedIn ? "/events" : "/login")
    .replaceAll("__ACCOUNT_LABEL__", signedIn ? "Evenimentele mele" : "Intră în cont");

  useEffect(() => {
    const page = pageRef.current;
    if (page === null) return;
    const stop = initLanding(page);
    return () => {
      stop();
      // The script appended nodes; a re-run needs the original markup back.
      page.innerHTML = markup;
    };
  }, [markup]);

  return <div ref={pageRef} className="pn-landing" dangerouslySetInnerHTML={{ __html: markup }} />;
}
