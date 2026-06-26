"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Three voices, set large in the serif. No carousel, no marquee —
 * testimony reads better when it stands still.
 */
export function Testimonials() {
  return (
    <section id="testimonials" data-nav="dark" className="bg-ink pb-28 md:pb-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="label border-t border-white/15 pt-4 text-smoke"
        >
          What customers say
        </motion.p>

        <div className="mt-16 space-y-0 lg:mt-20">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className={`grid gap-6 py-12 md:grid-cols-12 md:py-16 ${
                i !== 0 ? "border-t border-white/10" : ""
              }`}
            >
              <blockquote className="font-serif text-xl italic leading-snug text-paper/90 md:col-span-8 md:text-2xl lg:text-[1.65rem]">
                “{t.quote}”
              </blockquote>
              <figcaption className="self-end md:col-span-3 md:col-start-10">
                <p className="font-display text-sm font-medium text-paper">{t.name}</p>
                <p className="label mt-1.5 text-smoke">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
