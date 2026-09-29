"use client";

import { X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

import { BrandHeader } from "@/components/BrandMark";

import { ContributionsContent, CreateContent, HowItWorksContent, PlannerContent } from "./overlayContent";

export type OverlayId = "hiw" | "contrib" | "planner" | "create";

const OpenOverlayContext = createContext<(id: OverlayId) => void>(() => {});

/** Full-screen explainer pages opened from buttons anywhere on the landing page. */
export function LandingOverlays({ startHref, children }: { startHref: string; children: React.ReactNode }) {
  const [open, setOpen] = useState<OverlayId | null>(null);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <OpenOverlayContext.Provider value={setOpen}>
      {children}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[2000] overflow-y-auto bg-linear-to-b from-(--bg-from) to-(--bg-to)"
        >
          <div className="sticky top-0 z-10 border-b border-surface-border bg-(--bg-from)/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1080px] items-center gap-2.5 px-4 py-3.5 sm:px-7">
              <BrandHeader />
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#1E1A30] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px"
              >
                <X size={16} aria-hidden="true" /> Închide
              </button>
            </div>
          </div>
          {open === "hiw" && <HowItWorksContent startHref={startHref} />}
          {open === "contrib" && <ContributionsContent startHref={startHref} />}
          {open === "planner" && <PlannerContent startHref={startHref} />}
          {open === "create" && <CreateContent startHref={startHref} />}
        </div>
      )}
    </OpenOverlayContext.Provider>
  );
}

export function OverlayButton({
  overlay,
  className,
  children,
}: {
  overlay: OverlayId;
  className?: string;
  children: React.ReactNode;
}) {
  const openOverlay = useContext(OpenOverlayContext);
  return (
    <button type="button" className={className} onClick={() => openOverlay(overlay)}>
      {children}
    </button>
  );
}
