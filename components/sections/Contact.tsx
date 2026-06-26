"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COMPANY, waLink } from "@/lib/data";
import { SectionHeading } from "../ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const [form, setForm] = useState({ name: "", need: "Batteries", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello KENDYN, my name is ${form.name || "—"}. I'm interested in: ${form.need}. ${form.message}`;
    window.open(waLink(text), "_blank", "noopener");
  };

  const field =
    "w-full border-b border-ink/25 bg-transparent py-3 text-base text-ink placeholder:text-ash/50 outline-none transition-colors duration-300 focus:border-ink";

  return (
    <section id="contact" data-nav="light" className="bg-paper pt-28 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-12 md:pb-36">
        <SectionHeading index="09" kicker="Contact" title="Come and see the showroom." />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <motion.address
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="space-y-10 not-italic lg:col-span-5"
          >
            <div>
              <p className="label text-ash">Address</p>
              <p className="mt-3 font-display text-xl font-medium leading-relaxed text-ink md:text-2xl">
                52, Oba Erinwole Road,
                <br />
                Off GRA Road, Sagamu,
                <br />
                Ogun State, Nigeria
              </p>
            </div>

            <div>
              <p className="label text-ash">Phone</p>
              <div className="mt-3 flex flex-col gap-1">
                {COMPANY.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    className="w-fit font-display text-xl font-medium text-ink transition-opacity duration-300 hover:opacity-60 md:text-2xl"
                  >
                    {p.display}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-12">
              <div>
                <p className="label text-ash">Hours</p>
                <p className="mt-3 text-sm text-ink">Mon – Sat · 8:00 — 18:00</p>
              </div>
              <div>
                <p className="label text-ash">WhatsApp</p>
                <a
                  href={waLink("Hello KENDYN, I'd like to make an enquiry.")}
                  target="_blank"
                  rel="noreferrer"
                  className="label mt-3 inline-flex items-center gap-2 border-b border-ink/40 pb-0.5 text-ink transition-colors hover:border-ink"
                >
                  Start a chat <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </motion.address>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            onSubmit={submit}
            className="lg:col-span-6 lg:col-start-7"
          >
            <p className="font-display text-xl font-medium text-ink">
              Get a quote in minutes.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ash">
              Fill this in and it opens straight into WhatsApp — we reply fast.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <label htmlFor="q-name" className="label text-ash">
                  Your name
                </label>
                <input
                  id="q-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Adewale"
                  className={field}
                  required
                />
              </div>
              <div>
                <label htmlFor="q-need" className="label text-ash">
                  I need
                </label>
                <select
                  id="q-need"
                  value={form.need}
                  onChange={(e) => setForm({ ...form, need: e.target.value })}
                  className={`${field} appearance-none`}
                >
                  {["Batteries", "Tyres", "Industrial tools", "Fitting / servicing", "Fleet supply"].map(
                    (o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="q-msg" className="label text-ash">
                  Details
                </label>
                <textarea
                  id="q-msg"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Vehicle model, battery size, tyre size, quantity…"
                  rows={3}
                  className={`${field} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-ink px-8 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-carbon"
              >
                Send via WhatsApp
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer data-nav="dark" className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.35em] text-paper">
              KENDYN
            </p>
            <p className="label mt-3 text-smoke">Batteries · Tyres · Industrial tools</p>
          </div>
          <div className="flex flex-col gap-1 md:text-right">
            <p className="text-sm text-smoke">52, Oba Erinwole Road, Sagamu, Ogun State</p>
            <p className="text-sm text-smoke">
              {COMPANY.phones.map((p) => p.display).join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-mono text-[10px] tracking-[0.15em] text-smoke">
            © {new Date().getFullYear()} {COMPANY.name}
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] text-smoke">
            SAGAMU · OGUN STATE · NIGERIA
          </p>
        </div>
      </div>
    </footer>
  );
}
