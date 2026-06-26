# Kendyn — image generation prompts

Generate these, then drop the files into `public/images/` with the exact
filenames below. Each prompt is written for photorealistic generators
(Midjourney v6+, Flux, Imagen, DALL·E 3). Keep every image monochrome-leaning
and moody so it sits inside the site's ink/paper design system.

**Global style suffix — append to every prompt:**

> shot on Phase One XF, 80mm lens, f/8, low-key studio lighting, charcoal
> background, single warm key light with soft falloff, deep shadows, subtle
> floor reflection, automotive commercial photography, hyper-detailed,
> no text, no watermark, 16:9

---

## Hero / Open Graph

**`og-hero.jpg`** — used for social sharing previews (1200×630)

> A heavy commercial truck tyre standing upright on a dark reflective studio
> floor, dramatic single light sweeping across the rubber revealing deep tread
> lugs, molded sidewall lettering catching the edge light, complete darkness
> behind, weighty and monumental

## Gallery (replace the six graphite tiles in `components/sections/Gallery.tsx`)

**`gallery-01-showroom.jpg`** — The Showroom (wide tile, 8:3 crop works best)

> Interior of a premium tyre and battery showroom in Nigeria at dusk, rows of
> truck tyres on dark steel racks along one wall, car batteries displayed on
> backlit shelves, polished concrete floor with reflections, a service counter
> in warm light, moody and clean, architectural photography

**`gallery-02-fitting.jpg`** — Fitting Bay

> A truck wheel being fitted in a professional workshop bay, computerised wheel
> balancing machine, mechanic's gloved hands on the rim, shallow depth of
> field, sparks of work light on steel, dark industrial atmosphere

**`gallery-03-battery-lab.jpg`** — Battery Lab

> Close-up of a digital battery load tester clipped to the terminals of a
> heavy-duty truck battery on a steel workbench, glowing test readout, coiled
> cables, dark workshop background, warm pool of task lighting

**`gallery-04-warehouse.jpg`** — The Warehouse

> A tall warehouse aisle stacked with hundreds of commercial truck tyres,
> dramatic perspective down the row, single overhead industrial lights making
> pools of light on the concrete, fog-like atmosphere in the distance

**`gallery-05-alignment.jpg`** — Alignment Rig

> A pickup truck on a four-post laser wheel-alignment lift in a dark workshop,
> red laser lines projected across the wheels, technician silhouetted, precise
> and technical, cinematic industrial photography

**`gallery-06-fleet.jpg`** — Delivery Fleet

> A line of articulated trucks with new tyres parked at dawn outside a depot
> in Ogun State Nigeria, low golden side light, long shadows, dust in the air,
> documentary fleet photography

## Product category headers (optional, for future use)

**`cat-batteries.jpg`**

> A family of heavy-duty automotive batteries arranged in a staggered row on a
> dark plinth, label faces lit by one soft strip light, terminals gleaming,
> studio product photography

**`cat-tyres.jpg`**

> Three commercial tyres of different sizes — car, SUV and 22.5-inch truck —
> leaning against each other on a dark stage, tread patterns lit in raking
> light to show depth

**`cat-tools.jpg`**

> A chrome-vanadium socket set, torque wrench and hydraulic jack arranged as a
> precise flat-lay on dark brushed steel, top-down, single soft light, every
> tool aligned to a grid

---

### Notes for swapping in

- Gallery tiles: in `Gallery.tsx`, each `<figure>` currently renders a
  graphite plate `<div>`. Replace that div with
  `<Image src="/images/gallery-0X-….jpg" alt="…" fill className="object-cover" />`
  (import `next/image`) — captions and indexes already overlay correctly.
- Keep images ≤ 400 KB each (export at 1600px wide, quality ~70 WebP).
