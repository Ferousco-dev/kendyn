"use client";

import { motion } from "framer-motion";
import { SERVICES, waLink } from "@/lib/data";
import { SectionHeading } from "../ui/SectionHeading";
// import { VoltButton } from "../ui/MagneticButton";

const ICONS = [
  // battery
  <path
    key="0"
    d="M7 6V4h4v2h3a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h3zm2 4l-3 5h2.5l-.5 3 3-5h-2.5l.5-3z"
  />,
  // tyre
  <path
    key="1"
    d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 110 10 5 5 0 010-10zm0 3.2a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6z"
  />,
  // alignment
  <path
    key="2"
    d="M12 2l2.4 4.8L12 9.6 9.6 6.8 12 2zM4 13h6v2H4v-2zm10 0h6v2h-6v-2zm-3 4h2v5h-2v-5z"
  />,
  // fleet
  <path
    key="3"
    d="M3 7h11v8H3V7zm12 2h3l3 3v3h-6V9zM6 17a2 2 0 110 4 2 2 0 010-4zm11 0a2 2 0 110 4 2 2 0 010-4z"
  />,
  // solar
  <path
    key="4"
    d="M12 4l1.5 3h3.5l-2.5 2.5 1 3.5-3.5-2-3.5 2 1-3.5L7 7h3.5L12 4zm-8 13h16v2H4v-2zm2 3h12v2H6v-2z"
  />,
  // tools
  <path
    key="5"
    d="M21 6.5a4.5 4.5 0 01-6.1 4.2L8 17.6a2 2 0 11-2.8-2.8l6.9-6.9A4.5 4.5 0 0117.5 2l-2.3 2.3 1.4 2.8 2.8 1.4L21.7 6a4 4 0 01-.7.5z"
  />,
];

export function Services() {
  return (
    <section id="services" className="relative bg-graphite py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* <SectionHeading kicker="Services" title="More than a parts counter." /> */}

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.08,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-panel p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-volt/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt/10 text-volt transition-colors duration-500 group-hover:bg-volt group-hover:text-graphite">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 fill-current"
                  aria-hidden
                >
                  {ICONS[i]}
                </svg>
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-ice">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mist">
                {s.desc}
              </p>
              <span className="mt-5 block h-px w-0 bg-volt transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 flex justify-center"
        >
          <a href={waLink("Hello KENDYN, I'd like to book a service.")}>
            Book a service
          </a>
        </motion.div>
      </div>
    </section>
  );
}
