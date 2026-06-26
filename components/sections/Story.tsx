"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface Spec {
  label: string;
  value: string;
}

/**
 * One chapter of the product film. Typography sits directly in the scene
 * like a title sequence — no cards — and scrubs in and out with scroll
 * while the camera does the real storytelling behind it.
 */
function Chapter({
  id,
  index,
  kicker,
  title,
  copy,
  specs,
  side,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  copy: string;
  specs: Spec[];
  side: "left" | "right";
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.3, 0.44, 0.7, 0.82], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.3, 0.46], [36, 0]);

  return (
    <section ref={ref} id={id} className="relative h-[240vh]">
      <div className="pointer-events-none sticky top-0 flex h-screen items-center">
        <div
          className={`mx-auto flex w-full max-w-[1400px] px-6 lg:px-12 ${
            side === "left" ? "justify-start" : "justify-end"
          }`}
        >
          <motion.div
            style={{ opacity, y }}
            className="pointer-events-auto relative w-full max-w-sm"
          >
            {/* whisper of vignette so type holds against lit rubber */}
            <div
              className="absolute -inset-12 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(8,9,11,0.62),transparent_72%)]"
              aria-hidden
            />
            <div className="flex items-baseline justify-between border-t border-white/20 pt-4">
              <p className="label text-smoke">{kicker}</p>
              <span className="font-mono text-xs tabular-nums text-smoke">{index}</span>
            </div>
            <h2 className="mt-8 font-display text-4xl font-medium leading-[1.05] text-paper md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-smoke">{copy}</p>

            <dl className="mt-10">
              {specs.map((s, i) => (
                <SpecRow key={s.label} spec={s} i={i} progress={scrollYProgress} />
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpecRow({
  spec,
  i,
  progress,
}: {
  spec: Spec;
  i: number;
  progress: MotionValue<number>;
}) {
  const start = 0.44 + i * 0.03;
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="flex items-baseline justify-between border-b border-white/12 py-3"
    >
      <dt className="label text-smoke">{spec.label}</dt>
      <dd className="font-display text-base font-medium text-paper">{spec.value}</dd>
    </motion.div>
  );
}

export function StoryChapters() {
  return (
    <>
      <Chapter
        id="tyres"
        index="01"
        kicker="The tyre"
        title="Built for the long haul."
        copy="Articulated vehicles are our specialty — trucks, trailers, tractors and Caterpillar equipment — alongside every major car brand. Each casing is sourced directly from manufacturers in China, Thailand and India, and rated for Nigerian heat and distance."
        specs={[
          { label: "Origin", value: "China · Thailand · India" },
          { label: "Duty", value: "Articulated & passenger" },
          { label: "Range", value: "R13 — R22.5+" },
          { label: "Fitting", value: "Computerised" },
        ]}
        side="left"
      />
      <Chapter
        id="tread"
        index="02"
        kicker="The tread"
        title="Grip you can measure."
        copy="Get close and the engineering reads like a blueprint: shoulder lugs for cornering load, siped centre ribs for wet braking, compounds that hold their grip at highway temperature with thirty tonnes behind them."
        specs={[
          { label: "Pattern", value: "Rib + lug" },
          { label: "Max load", value: "3,550 kg / tyre" },
          { label: "Wet grip", value: "Class A" },
          { label: "Casing", value: "Retreadable" },
        ]}
        side="right"
      />
      <Chapter
        id="batteries"
        index="03"
        kicker="The battery"
        title="Quietly relentless."
        copy="Korean, Korea-Tech, Malaysian, Turkish, Chinese and Indian lines — every unit load-tested at the counter before it goes near your terminal posts. Starting power for cars and trucks; deep-cycle banks for inverters and solar."
        specs={[
          { label: "Origin", value: "Korea · Malaysia · Turkey" },
          { label: "Also from", value: "China · India" },
          { label: "Capacity", value: "45 — 200 Ah" },
          { label: "Warranty", value: "Up to 24 months" },
        ]}
        side="left"
      />
      <Chapter
        id="promise"
        index="04"
        kicker="The promise"
        title="Power. Performance. Reliability."
        copy="Two objects, one standard. Free load-testing before you buy, computerised fitting the same day, and warranties we honour in person at the counter — for one car or an entire fleet."
        specs={[
          { label: "Testing", value: "Free, on site" },
          { label: "Fitting", value: "Same day" },
          { label: "Fleets", value: "Supply programmes" },
          { label: "Support", value: "Mon — Sat" },
        ]}
        side="right"
      />
    </>
  );
}
