"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { waLink } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening frame of the film. On desktop the tyre owns the viewport via
 * the 3D scene behind; on mobile (no WebGL) a real product photo stands in,
 * darkened so the type reads as a cinematic title card.
 */
export function Hero({ ready, isMobile }: { ready: boolean; isMobile: boolean }) {
  return (
    <section id="home" className="relative flex h-screen flex-col justify-end">
      {isMobile && (
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Image
            src="/images/products/jadeforce-zm209.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[64%_38%]"
          />
          {/* heavy, even darkening so the label recedes into texture */}
          <div className="absolute inset-0 bg-ink/60" />
          {/* deepen the lower third where the type sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
        </div>
      )}

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 2.2 }}
              className="label mb-6 text-steel"
            >
              Kendyn Batteries &amp; Tyres Ltd, Sagamu, Nigeria
            </motion.p>

            <h1 className="font-display text-5xl font-medium leading-[1.02] text-paper md:text-6xl lg:text-7xl">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "108%" }}
                  animate={ready ? { y: 0 } : {}}
                  transition={{ duration: 1.2, delay: 2.35, ease: EASE }}
                  className="block"
                >
                  Power. Performance.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "108%" }}
                  animate={ready ? { y: 0 } : {}}
                  transition={{ duration: 1.2, delay: 2.5, ease: EASE }}
                  className="block"
                >
                  Reliability.
                </motion.span>
              </span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 2.9, ease: EASE }}
            className="lg:max-w-xs lg:pb-2"
          >
            <p className="text-sm leading-relaxed text-steel">
              Tyres for articulated vehicles and cars. Batteries from six
              nations. Industrial tools. Supplied, fitted and guaranteed.
            </p>
            <div className="mt-7 flex items-center gap-7">
              <a
                href="#products"
                className="rounded-full bg-paper px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-white"
              >
                Explore products
              </a>
              <a
                href={waLink("Hello KENDYN, I'd like to talk about an order.")}
                target="_blank"
                rel="noreferrer"
                className="label border-b border-paper/40 pb-0.5 text-paper transition-colors duration-300 hover:border-paper"
              >
                Talk to us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 3.6, duration: 1 }}
        className="absolute bottom-0 left-1/2 hidden h-12 w-px -translate-x-1/2 bg-white/20 md:block"
        aria-hidden
      />
    </section>
  );
}
