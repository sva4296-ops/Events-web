"use client";

import { useEffect, useRef } from "react";

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** A soft circle of light, fading to nothing; `color` is a #rrggbb token. */
function glow(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, radius: number, alpha: number) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, `${color}00`);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/**
 * The window's living backdrop, behind every page: two slow lights drifting in
 * the theme's colors and fine dust rising like stars. Decorative only; one still
 * frame with reduced motion.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";
    let width = 0;
    let height = 0;
    let frame = 0;
    let accent = token("--ambient-a");
    let gold = token("--ambient-b");
    let dark = isDark();
    const dust = Array.from({ length: window.innerWidth < 768 ? 25 : 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      driftX: (Math.random() - 0.5) * 0.00012,
      driftY: -0.00004 - Math.random() * 0.00012,
      size: 0.8 + Math.random() * 1.4,
      gold: Math.random() < 0.25,
    }));

    const draw = (now: number) => {
      const seconds = now / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const reach = Math.max(width, height);
      glow(ctx, accent, width * (0.2 + Math.sin(seconds * 0.11) * 0.15), height * (0.2 + Math.cos(seconds * 0.09) * 0.15), reach * 0.55, dark ? 0.14 : 0.2);
      glow(ctx, gold, width * (0.82 + Math.cos(seconds * 0.07) * 0.14), height * (0.75 + Math.sin(seconds * 0.1) * 0.18), reach * 0.42, dark ? 0.09 : 0.22);

      for (const speck of dust) {
        speck.x = (speck.x + speck.driftX + 1) % 1;
        speck.y = (speck.y + speck.driftY + 1) % 1;
        ctx.globalAlpha = dark ? 0.55 : 0.4;
        ctx.fillStyle = speck.gold ? gold : accent;
        ctx.beginPath();
        ctx.arc(speck.x * width, speck.y * height, speck.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!still) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      if (still) draw(performance.now());
    };
    const onScheme = () => {
      accent = token("--ambient-a");
      gold = token("--ambient-b");
      dark = isDark();
      if (still) draw(performance.now());
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pn-theme-change", onScheme);
    if (still) {
      draw(performance.now());
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pn-theme-change", onScheme);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
