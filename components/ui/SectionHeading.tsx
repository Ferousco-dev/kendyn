"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial section opener: index + kicker on the hairline, then a large
 * display headline. Tone follows the section background.
 */
export function SectionHeading({
  index,
  kicker,
  title,
  tone = "light",
  className = "",
}: {
  index: string;
  kicker: string;
  title: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const rule = tone === "light" ? "border-ink/15" : "border-white/15";
  const mutedCls = tone === "light" ? "text-ash" : "text-smoke";
  const fg = tone === "light" ? "text-ink" : "text-paper";

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className={`flex items-baseline justify-between border-t pt-4 ${rule}`}
      >
        <span className={`label ${mutedCls}`}>{kicker}</span>
        <span className={`font-mono text-xs tabular-nums ${mutedCls}`}>{index}</span>
      </motion.div>
      {/* the clipped child can never intersect, so observe the wrapper */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 overflow-hidden md:mt-14"
      >
        <motion.h2
          variants={{
            hidden: { y: "105%" },
            visible: { y: 0, transition: { duration: 1, ease: EASE } },
          }}
          className={`font-display text-4xl font-medium leading-[1.04] md:text-6xl ${fg}`}
        >
          {title}
        </motion.h2>
      </motion.div>
    </div>
  );
}

export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1faa53] shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.05 2a9.95 9.95 0 0 0-8.6 14.93L2 22l5.2-1.36A9.95 9.95 0 1 0 12.05 2zm0 18.18a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.09.81.83-3.01-.2-.31a8.23 8.23 0 1 1 6.94 3.83z" />
      </svg>
    </a>
  );
}
