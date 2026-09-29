"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TOUR_STEPS } from "./data";

const AUTO_DELAY_MS = 5000;
/** Added to the section being explained in guided mode. */
const HIGHLIGHT = "relative z-[2405] rounded-2xl shadow-[0_0_0_4px_var(--accent),0_0_0_9999px_rgba(26,26,46,0.55)]".split(" ");

type Mode = "auto" | "guided" | null;

function scrollToStep(index: number): HTMLElement | null {
  const el = document.querySelector<HTMLElement>(TOUR_STEPS[index].sel);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  return el;
}

/** Floating "Tur ghidat" button: an auto-scrolling tour or a step-by-step guided one. */
export function Tour() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [index, setIndex] = useState(0);
  const highlighted = useRef<{ el: HTMLElement; added: string[] } | null>(null);

  const clearHighlight = useCallback(() => {
    const current = highlighted.current;
    if (current !== null) current.el.classList.remove(...current.added);
    highlighted.current = null;
  }, []);

  const stop = useCallback(() => {
    clearHighlight();
    setMode(null);
  }, [clearHighlight]);

  const start = (next: Exclude<Mode, null>) => {
    setMenuOpen(false);
    setIndex(0);
    setMode(next);
  };

  const nextStep = useCallback(() => {
    if (index + 1 >= TOUR_STEPS.length) stop();
    else setIndex(index + 1);
  }, [index, stop]);

  // Scroll (and highlight in guided mode) whenever the step changes.
  useEffect(() => {
    if (mode === null) return;
    const el = scrollToStep(index);
    if (mode === "auto") {
      const timer = setTimeout(nextStep, AUTO_DELAY_MS);
      return () => clearTimeout(timer);
    }
    clearHighlight();
    if (el === null) return;
    const timer = setTimeout(() => {
      const added = HIGHLIGHT.filter((c) => !el.classList.contains(c));
      el.classList.add(...added);
      highlighted.current = { el, added };
    }, 400);
    return () => clearTimeout(timer);
  }, [mode, index, nextStep, clearHighlight]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stop();
        setMenuOpen(false);
      } else if (e.key === "ArrowRight" && mode === "guided") {
        nextStep();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, nextStep, stop]);

  useEffect(() => clearHighlight, [clearHighlight]);

  const step = TOUR_STEPS[index];
  const progress = `${index + 1} / ${TOUR_STEPS.length}`;
  const isLast = index === TOUR_STEPS.length - 1;

  return (
    <>
      {mode === null && (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            className="fixed bottom-4 right-4 z-[200] inline-flex size-13 items-center justify-center gap-2 rounded-full bg-[#1E1A30] text-xl font-semibold text-white shadow-xl shadow-black/30 transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:size-auto sm:px-5 sm:py-3 sm:text-sm"
          >
            🎬<span className="hidden sm:inline"> Tur ghidat</span>
          </button>
          {menuOpen && (
            <div className="fixed bottom-[76px] right-4 z-[200] flex min-w-[210px] flex-col gap-1 rounded-2xl bg-white p-2 text-[#2B2740] shadow-2xl shadow-black/25 sm:bottom-[78px] sm:right-6">
              <button type="button" onClick={() => start("auto")} className="rounded-xl px-3.5 py-3 text-left text-sm hover:bg-[#FFF8F1]">
                ▶️ Tur automat <span className="text-xs text-[#8A8496]">(se derulează singur)</span>
              </button>
              <button type="button" onClick={() => start("guided")} className="rounded-xl px-3.5 py-3 text-left text-sm hover:bg-[#FFF8F1]">
                👆 Tur ghidat <span className="text-xs text-[#8A8496]">(pas cu pas)</span>
              </button>
            </div>
          )}
        </>
      )}

      {mode === "auto" && (
        <div className="fixed inset-x-0 top-0 z-[2500] flex flex-wrap items-center gap-2 bg-[#1E1A30] px-3.5 py-2.5 text-white shadow-xl shadow-black/30 sm:flex-nowrap sm:gap-4 sm:px-5.5 sm:py-3.5">
          <span className="size-2.5 shrink-0 animate-pulse rounded-full bg-gold" />
          <span className="order-1 line-clamp-2 basis-full text-[12.5px] leading-snug sm:order-none sm:basis-auto sm:text-[14.5px]">
            <b className="text-gold">{step.title}</b> — {step.text}
          </span>
          <span className="order-2 shrink-0 text-[11px] text-[#B5B4C8] sm:order-none sm:ml-auto sm:text-xs">{progress}</span>
          <button
            type="button"
            onClick={stop}
            className="order-3 ml-auto shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25 sm:order-none sm:ml-0 sm:px-4 sm:py-2 sm:text-[13px]"
          >
            ✕ Oprește turul
          </button>
        </div>
      )}

      {mode === "guided" && (
        <>
          {/* Blocks clicks on the page; the highlighted section (z-2405) sits above it. */}
          <div className="fixed inset-0 z-[2400]" />
          <div
            role="dialog"
            aria-live="polite"
            className="fixed bottom-7 left-1/2 z-[2410] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl bg-white p-5 text-[#2B2740] shadow-2xl shadow-black/40"
          >
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">Pasul {index + 1}</p>
            <p className="mb-1.5 font-display text-[21px] font-bold">{step.title}</p>
            <p className="text-[14.5px] leading-normal text-[#5F5E5A]">{step.text}</p>
            <div className="mt-4 flex items-center gap-2.5">
              <span className="mr-auto text-xs text-[#8A8496]">{progress}</span>
              <button type="button" onClick={stop} className="text-[13px] text-[#8A8496] hover:text-[#2B2740]">
                Sari peste
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-accent px-5 py-2.5 text-[13.5px] font-semibold text-white hover:brightness-105"
              >
                {isLast ? "Gata ✓" : "Următorul →"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
