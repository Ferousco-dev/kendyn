"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, waLink, type Product, type ProductCategory } from "@/lib/data";
import { SectionHeading } from "../ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const ProductViewer = dynamic(
  () => import("../three/ProductViewer").then((m) => m.ProductViewer),
  { ssr: false }
);

const TABS: { key: ProductCategory; label: string }[] = [
  { key: "battery", label: "Batteries" },
  { key: "tyre", label: "Tyres" },
  { key: "tool", label: "Industrial tools" },
];

function ProductCard({
  product,
  onInspect,
}: {
  product: Product;
  onInspect: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group flex flex-col border-t border-ink/20 pt-6"
    >
      {product.image && (
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-paper-2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-medium text-ink">{product.name}</h3>
        <span className="font-mono text-xs text-ash">{product.highlight}</span>
      </div>
      <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-ash">{product.tagline}</p>

      <dl className="mt-8 flex-1">
        {product.specs.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline justify-between border-b border-ink/10 py-2.5"
          >
            <dt className="label text-ash">{s.label}</dt>
            <dd className="text-sm font-medium text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex items-center gap-8">
        <button
          type="button"
          onClick={onInspect}
          className="label border-b border-ink/40 pb-0.5 text-ink transition-colors duration-300 hover:border-ink"
        >
          View in 3D
        </button>
        <a
          href={waLink(`Hello KENDYN, I'm interested in the ${product.name}.`)}
          target="_blank"
          rel="noreferrer"
          className="label text-ash transition-colors duration-300 hover:text-ink"
        >
          Enquire <span aria-hidden>→</span>
        </a>
      </div>
    </motion.article>
  );
}

function InspectorModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-90 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`3D view of ${product.name}`}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 8 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-[82vh] w-full max-w-5xl grid-rows-[1fr_auto] overflow-hidden bg-paper lg:grid-cols-[1.6fr_1fr] lg:grid-rows-1"
        data-lenis-prevent
      >
        <div className="relative min-h-[40vh] bg-paper-2">
          <ProductViewer category={product.category} />
          <span className="label absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-ash">
            Drag to rotate · Scroll to zoom
          </span>
        </div>

        <div className="flex flex-col justify-center border-t border-ink/10 p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="label text-ash">{product.category}</p>
          <h3 className="mt-3 font-display text-3xl font-medium text-ink">{product.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ash">{product.tagline}</p>
          <dl className="mt-8">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between border-b border-ink/10 py-2.5"
              >
                <dt className="label text-ash">{s.label}</dt>
                <dd className="text-sm font-medium text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={waLink(`Hello KENDYN, please send me a quote for the ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block rounded-full bg-ink px-7 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-carbon"
          >
            Request a quote
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close 3D viewer"
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-ink transition-opacity hover:opacity-60"
        >
          <svg viewBox="0 0 14 14" className="h-4 w-4" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Products() {
  const [tab, setTab] = useState<ProductCategory>("battery");
  const [inspecting, setInspecting] = useState<Product | null>(null);
  const visible = PRODUCTS.filter((p) => p.category === tab);

  return (
    <section id="products" data-nav="light" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <SectionHeading index="06" kicker="The catalogue" title="Built for work." />

        <div
          className="mt-14 flex gap-10 border-b border-ink/15"
          role="tablist"
          aria-label="Product categories"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`label -mb-px border-b pb-4 transition-colors duration-300 ${
                tab === t.key
                  ? "border-ink text-ink"
                  : "border-transparent text-ash hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onInspect={() => setInspecting(p)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* the shelf itself — client's real stock wall */}
        {tab === "battery" && (
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-20"
          >
            <div className="relative aspect-[16/7] w-full overflow-hidden bg-paper-2">
              <Image
                src="/images/products/battery-brands.jpeg"
                alt="Battery brands in stock at the Kendyn showroom — KDD, C-Royal, Synergy, Rocket, GBM, Hi-Force, I.M.P and Gales"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-col justify-between gap-1 md:flex-row">
              <span className="label text-ash">On the shelf — photographed at the showroom</span>
              <span className="font-mono text-xs text-ash">
                KDD · C-Royal · Synergy · Rocket · GBM · Hi-Force · I.M.P · Gales
              </span>
            </figcaption>
          </motion.figure>
        )}
      </div>

      <AnimatePresence>
        {inspecting && (
          <InspectorModal product={inspecting} onClose={() => setInspecting(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
