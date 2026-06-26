"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Spec {
  label: string;
  value: string;
}

interface ChapterData {
  id: string;
  index: string;
  kicker: string;
  title: string;
  copy: string;
  specs: Spec[];
  side: "left" | "right";
  /** real product photo used in the mobile (no-WebGL) layout */
  image: string;
}

const CHAPTERS: ChapterData[] = [
  {
    id: "tyres",
    index: "01",
    kicker: "The tyre",
    title: "Built for the long haul.",
    copy: "Articulated vehicles are our specialty — trucks, trailers, tractors and Caterpillar equipment — alongside every major car brand. Each casing is sourced directly from manufacturers in China, Thailand and India, and rated for Nigerian heat and distance.",
    specs: [
      { label: "Origin", value: "China · Thailand · India" },
      { label: "Duty", value: "Articulated & passenger" },
      { label: "Range", value: "R13 — R22.5+" },
      { label: "Fitting", value: "Computerised" },
    ],
    side: "left",
    image: "/images/products/jadeforce-zm209.jpeg",
  },
  {
    id: "tread",
    index: "02",
    kicker: "The tread",
    title: "Grip you can measure.",
    copy: "Get close and the engineering reads like a blueprint: shoulder lugs for cornering load, siped centre ribs for wet braking, compounds that hold their grip at highway temperature with thirty tonnes behind them.",
    specs: [
      { label: "Pattern", value: "Rib + lug" },
      { label: "Max load", value: "3,550 kg / tyre" },
      { label: "Wet grip", value: "Class A" },
      { label: "Casing", value: "Retreadable" },
    ],
    side: "right",
    image: "/images/products/steer-close.jpeg",
  },
  {
    id: "batteries",
    index: "03",
    kicker: "The battery",
    title: "Quietly relentless.",
    copy: "Korean, Korea-Tech, Malaysian, Turkish, Chinese and Indian lines — every unit load-tested at the counter before it goes near your terminal posts. Starting power for cars and trucks; deep-cycle banks for inverters and solar.",
    specs: [
      { label: "Origin", value: "Korea · Malaysia · Turkey" },
      { label: "Also from", value: "China · India" },
      { label: "Capacity", value: "45 — 200 Ah" },
      { label: "Warranty", value: "Up to 24 months" },
    ],
    side: "left",
    image: "/images/products/battery-brands.jpeg",
  },
  {
    id: "promise",
    index: "04",
    kicker: "The promise",
    title: "Power. Performance. Reliability.",
    copy: "Two objects, one standard. Free load-testing before you buy, computerised fitting the same day, and warranties we honour in person at the counter — for one car or an entire fleet.",
    specs: [
      { label: "Testing", value: "Free, on site" },
      { label: "Fitting", value: "Same day" },
      { label: "Fleets", value: "Supply programmes" },
      { label: "Support", value: "Mon — Sat" },
    ],
    side: "right",
    image: "/images/products/fleet-king-stack.jpeg",
  },
];

/* ── Desktop: a sticky title card that scrubs over the moving 3D scene ── */
function CinematicChapter({ chapter }: { chapter: ChapterData }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.3, 0.44, 0.7, 0.82], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.3, 0.46], [36, 0]);

  return (
    <section ref={ref} id={chapter.id} className="relative h-[240vh]">
      <div className="pointer-events-none sticky top-0 flex h-screen items-center">
        <div
          className={`mx-auto flex w-full max-w-[1400px] px-6 lg:px-12 ${
            chapter.side === "left" ? "justify-start" : "justify-end"
          }`}
        >
          <motion.div
            style={{ opacity, y }}
            className="pointer-events-auto relative w-full max-w-sm"
          >
            <div
              className="absolute -inset-12 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(8,9,11,0.62),transparent_72%)]"
              aria-hidden
            />
            <div className="flex items-baseline justify-between border-t border-white/20 pt-4">
              <p className="label text-smoke">{chapter.kicker}</p>
              <span className="font-mono text-xs tabular-nums text-smoke">{chapter.index}</span>
            </div>
            <h2 className="mt-8 font-display text-4xl font-medium leading-[1.05] text-paper md:text-5xl">
              {chapter.title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-smoke">{chapter.copy}</p>
            <dl className="mt-10">
              {chapter.specs.map((s) => (
                <SpecRow key={s.label} spec={s} progress={scrollYProgress} />
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ spec, progress }: { spec: Spec; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.44, 0.52], [0, 1]);
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

/* ── Mobile: compact, normal-flow sections with the real product photos ── */
function MobileChapter({ chapter }: { chapter: ChapterData }) {
  return (
    <section id={chapter.id} className="px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-carbon">
          <Image
            src={chapter.image}
            alt={chapter.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-7 flex items-baseline justify-between border-t border-white/20 pt-4">
          <p className="label text-smoke">{chapter.kicker}</p>
          <span className="font-mono text-xs tabular-nums text-smoke">{chapter.index}</span>
        </div>
        <h2 className="mt-5 font-display text-3xl font-medium leading-[1.06] text-paper">
          {chapter.title}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-smoke">{chapter.copy}</p>
        <dl className="mt-7">
          {chapter.specs.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between border-b border-white/12 py-3"
            >
              <dt className="label text-smoke">{s.label}</dt>
              <dd className="font-display text-base font-medium text-paper">{s.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}

export function StoryChapters({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="bg-ink">
        {CHAPTERS.map((c) => (
          <MobileChapter key={c.id} chapter={c} />
        ))}
      </div>
    );
  }
  return (
    <>
      {CHAPTERS.map((c) => (
        <CinematicChapter key={c.id} chapter={c} />
      ))}
    </>
  );
}
