"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const PILLARS = [
  {
    n: "01",
    title: "Power",
    desc: "Batteries that start engines on the first turn and keep inverters alive through the longest outage.",
  },
  {
    n: "02",
    title: "Performance",
    desc: "Tyres matched to your vehicle, your load and Nigerian roads — fitted and balanced by machine, not guesswork.",
  },
  {
    n: "03",
    title: "Reliability",
    desc: "Genuine products, honest testing, real warranties. The reason fleets and families keep coming back.",
  },
];

export function About() {
  return (
    <section id="about" data-nav="light" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading index="05" kicker="About us" title="A showroom built on trust." />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-serif text-2xl italic leading-snug text-ink md:text-[1.75rem] lg:col-span-5"
          >
            “Drivers and businesses in Ogun State deserve the same calibre of
            product and service you’d expect in any world-class showroom.”
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="space-y-6 text-[15px] leading-relaxed text-ash lg:col-span-5 lg:col-start-7"
          >
            <p>
              Kendyn Batteries and Tyres Ltd began with that simple conviction.
              Today, from our base on Oba Erinwole Road in Sagamu, we supply
              batteries sourced from Korea, Malaysia, Turkey, China and India —
              including Korea-Tech lines — and tyres from China, Thailand and
              India for everything from passenger cars to trucks, trailers,
              tractors and Caterpillar equipment.
            </p>
            <p>
              Every product is backed by free diagnostics, professional fitting
              and warranties we actually honour — since 2010.
            </p>
          </motion.div>
        </div>

        <div className="mt-24 grid gap-px border-t border-ink/15 lg:mt-32 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={`py-10 pr-10 ${i !== 0 ? "lg:border-l lg:border-ink/15 lg:pl-10" : ""}`}
            >
              <span className="font-mono text-xs tabular-nums text-ash">{p.n}</span>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
