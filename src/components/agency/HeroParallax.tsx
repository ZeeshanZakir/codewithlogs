"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Restrained pointer parallax for the hero stage. Writes two CSS variables
 * (--px, --py in the range -1..1) that child layers use in their transforms.
 * Only runs for fine pointers and when reduced motion is not requested.
 */
export function HeroParallax({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      element.style.setProperty("--px", x.toFixed(3));
      element.style.setProperty("--py", y.toFixed(3));
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => { targetX = 0; targetY = 0; if (!frame) frame = requestAnimationFrame(tick); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
