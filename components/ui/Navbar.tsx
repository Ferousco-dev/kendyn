"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { waLink } from "@/lib/data";

const LINKS = [
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Minimal bar. Transparent over the dark showroom; once the page reaches
 * a light section it inverts to paper. The mobile menu is a full-screen
 * overlay above the page (z-50) but below the bar (z-60), so the close
 * button stays on top and tappable.
 */
export function Navbar({ ready }: { ready: boolean }) {
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const markers = document.querySelectorAll<HTMLElement>("[data-nav]");
      let tone = "dark";
      markers.forEach((m) => {
        if (m.getBoundingClientRect().top <= 64) tone = m.dataset.nav ?? "dark";
      });
      setLight(tone === "light");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overLight = light && !open;
  const fg = overLight ? "text-ink" : "text-paper";
  const muted = overLight ? "text-ash hover:text-ink" : "text-smoke hover:text-paper";

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-500 ${
          overLight ? "border-b border-ink/10 bg-paper/92 backdrop-blur-sm" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
          <a
            href="#home"
            onClick={() => setOpen(false)}
            className={`font-display text-sm font-semibold tracking-[0.35em] transition-colors duration-500 ${fg}`}
          >
            KENDYN
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`label transition-colors duration-300 ${muted}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={waLink("Hello KENDYN, I'd like a quote.")}
              target="_blank"
              rel="noreferrer"
              className={`label inline-flex items-center gap-2 border-b pb-0.5 transition-colors duration-300 ${
                overLight
                  ? "border-ink/40 text-ink hover:border-ink"
                  : "border-paper/40 text-paper hover:border-paper"
              }`}
            >
              Get a quote
              <span aria-hidden>&rarr;</span>
            </a>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`h-px w-6 transition-all duration-300 ${
                open ? "translate-y-[3.5px] rotate-45 bg-paper" : overLight ? "bg-ink" : "bg-paper"
              }`}
            />
            <span
              className={`h-px w-6 transition-all duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45 bg-paper" : overLight ? "bg-ink" : "bg-paper"
              }`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-center bg-ink px-8 lg:hidden"
          >
            {/* About is hidden on mobile, so drop its link from the menu */}
            {LINKS.filter((l) => l.href !== "#about").map((l, i) => (
              <motion.a
                key={l.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-5 font-display text-3xl font-medium text-paper"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5 }}
              href={waLink("Hello KENDYN, I'd like a quote.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="label mt-10 inline-flex items-center gap-2 text-paper"
            >
              Get a quote <span aria-hidden>&rarr;</span>
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
