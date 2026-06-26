"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Quiet preloader: wordmark, a single hairline that fills, a counter.
 * Then the curtain lifts.
 */
export function Preloader({
  onComplete,
  reducedMotion,
}: {
  onComplete: () => void;
  reducedMotion: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  });

  useEffect(() => {
    if (reducedMotion) {
      const id = requestAnimationFrame(() => {
        completeRef.current();
        setDone(true);
      });
      return () => cancelAnimationFrame(id);
    }
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          completeRef.current();
          setDone(true);
        },
      });
      tl.to(counter, {
        v: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (pct.current)
            pct.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (line.current) line.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      }).to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.2,
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink"
      aria-hidden
    >
      <div className="w-[min(420px,80vw)]">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-sm font-semibold tracking-[0.35em] text-paper">
            KENDYN
          </span>
          <span className="font-mono text-xs tabular-nums text-smoke">
            <span ref={pct}>000</span>
          </span>
        </div>
        <div className="mt-5 h-px w-full bg-white/15">
          <div
            ref={line}
            className="h-px w-full origin-left scale-x-0 bg-paper"
          />
        </div>
        <p className="label mt-5 text-smoke">Batteries · Tyres · Industrial tools</p>
      </div>
    </div>
  );
}
