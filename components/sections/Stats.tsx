"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { STATS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current!;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: node, start: "top 85%", once: true },
      onUpdate: () => {
        node.textContent = Math.round(obj.v).toLocaleString();
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <span className="font-display text-6xl font-medium tracking-tight text-ink md:text-7xl">
      <span ref={el} className="tabular-nums">0</span>
      {suffix}
    </span>
  );
}

/**
 * The first light section — the page steps out of the cinema into print.
 */
export function Stats() {
  return (
    <section id="light-start" data-nav="light" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex items-baseline justify-between border-t border-ink/15 pt-4"
        >
          <span className="label text-ash">The record</span>
          <span className="font-mono text-xs tabular-nums text-ash">04</span>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col gap-4 border-b border-ink/15 py-12 pr-8 md:py-16 ${
                i % 4 !== 0 ? "lg:border-l lg:border-ink/15 lg:pl-8" : ""
              } ${i % 2 !== 0 ? "sm:border-l sm:border-ink/15 sm:pl-8 lg:pl-8" : ""}`}
            >
              <Counter value={s.value} suffix={s.suffix} />
              <p className="label text-ash">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
