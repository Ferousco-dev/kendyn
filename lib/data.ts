export const COMPANY = {
  name: "KENDYN BATTERIES AND TYRES LTD",
  short: "KENDYN",
  address: "52, Oba Erinwole Road, Off GRA Road, Sagamu, Ogun State, Nigeria",
  phones: [
    { display: "0816 373 2941", tel: "+2348163732941" },
    { display: "0902 705 5418", tel: "+2349027055418" },
  ],
  whatsapp: "2348163732941",
};

export function waLink(message: string): string {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type ProductCategory = "battery" | "tyre" | "tool";

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  tagline: string;
  specs: { label: string; value: string }[];
  highlight: string;
  /** real client photo under /public */
  image?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "kdd-n150",
    category: "battery",
    name: "KDD Power Extra MF N150",
    tagline: "Sealed maintenance-free muscle for trucks & buses",
    highlight: "Korea",
    specs: [
      { label: "Capacity", value: "12V 150 Ah" },
      { label: "Cold Crank", value: "960 A (CCA)" },
      { label: "Standard", value: "Korea" },
      { label: "Type", value: "Sealed MF" },
    ],
  },
  {
    id: "croyal-din100",
    category: "battery",
    name: "C-Royal MF DIN100",
    tagline: "Silver-calcium starting power for SUVs & light trucks",
    highlight: "Malaysia",
    specs: [
      { label: "Capacity", value: "12V 100 Ah" },
      { label: "Technology", value: "Silver calcium" },
      { label: "Origin", value: "Malaysia" },
      { label: "Type", value: "Sealed MF" },
    ],
  },
  {
    id: "synergy-din75",
    category: "battery",
    name: "Synergy MF DIN75",
    tagline: "Extreme-power sedan & SUV starter, Korea technology",
    highlight: "Korea Tech",
    specs: [
      { label: "Capacity", value: "12V 75 Ah" },
      { label: "Cold Crank", value: "420 A (CCA)" },
      { label: "Technology", value: "Korea Tech" },
      { label: "Type", value: "Maintenance free" },
    ],
  },
  {
    id: "rocket-85d26l",
    category: "battery",
    name: "Rocket SMF 85D26L",
    tagline: "The Korean original, quiet, sealed, relentless",
    highlight: "Korea",
    specs: [
      { label: "Capacity", value: "12V 80 Ah" },
      { label: "Terminal", value: "L, left layout" },
      { label: "Origin", value: "Korea" },
      { label: "Type", value: "Sealed MF" },
    ],
  },
  {
    id: "fleet-king-900",
    category: "tyre",
    name: "JK Fleet King 9.00-20",
    tagline: "The bias-ply workhorse Nigerian fleets swear by",
    highlight: "India",
    image: "/images/products/fleet-king.jpeg",
    specs: [
      { label: "Size", value: "9.00-20" },
      { label: "Build", value: "Tube type" },
      { label: "Origin", value: "India" },
      { label: "Duty", value: "Truck / trailer" },
    ],
  },
  {
    id: "atlas-k1t307",
    category: "tyre",
    name: "Atlas K1T307 11R22.5",
    tagline: "All-position radial from Chelsea FC's global tyre partner",
    highlight: "Thailand",
    image: "/images/products/atlas-k1t307.jpeg",
    specs: [
      { label: "Size", value: "11R22.5 16PR" },
      { label: "Load Index", value: "148/145L" },
      { label: "Origin", value: "Thailand" },
      { label: "Position", value: "Steer / all" },
    ],
  },
  {
    id: "maxchee-ma312",
    category: "tyre",
    name: "Maxchee MA312 315/80 R22.5",
    tagline: "All-position rib radial for heavy long-haul axles",
    highlight: "China",
    image: "/images/products/maxchee-ma312.jpeg",
    specs: [
      { label: "Size", value: "315/80 R22.5" },
      { label: "Ply Rating", value: "20 PR" },
      { label: "Origin", value: "China" },
      { label: "Position", value: "All-position" },
    ],
  },
  {
    id: "jadeforce-zm209",
    category: "tyre",
    name: "JadeForce ZM209 315/80 R22.5",
    tagline: "Mixed-service lug pattern for on/off-road drive axles",
    highlight: "China",
    image: "/images/products/jadeforce-zm209.jpeg",
    specs: [
      { label: "Size", value: "315/80 R22.5" },
      { label: "Pattern", value: "Lug, drive axle" },
      { label: "Origin", value: "China" },
      { label: "Duty", value: "On / off road" },
    ],
  },
  {
    id: "agate-hf703",
    category: "tyre",
    name: "Agate HF703 315/80 R22.5",
    tagline: "TBR radial built for kilometres under full load",
    highlight: "China",
    image: "/images/products/agate-hf703.jpeg",
    specs: [
      { label: "Size", value: "315/80 R22.5" },
      { label: "Ply Rating", value: "20 PR" },
      { label: "Origin", value: "China" },
      { label: "Class", value: "TBR radial" },
    ],
  },
  {
    id: "impact-wrench",
    category: "tool",
    name: "Impact Wrench Pro 1\"",
    tagline: "Workshop-grade torque for heavy assembly",
    highlight: "2,400 Nm",
    specs: [
      { label: "Max Torque", value: "2,400 Nm" },
      { label: "Drive", value: "1\" square" },
      { label: "Speed", value: "4,500 rpm" },
      { label: "Build", value: "Alloy housing" },
    ],
  },
  {
    id: "hydraulic-jack",
    category: "tool",
    name: "Hydraulic Jack 5T",
    tagline: "Low-profile lifting engineered for safety",
    highlight: "5,000 kg",
    specs: [
      { label: "Capacity", value: "5 tonnes" },
      { label: "Min Height", value: "85 mm" },
      { label: "Max Height", value: "500 mm" },
      { label: "Safety", value: "Overload valve" },
    ],
  },
  {
    id: "socket-set",
    category: "tool",
    name: "Industrial Socket Set 108pc",
    tagline: "Chrome-vanadium precision for every fastener",
    highlight: "108 pc",
    specs: [
      { label: "Pieces", value: "108" },
      { label: "Drives", value: "1/4 to 1/2\"" },
      { label: "Steel", value: "Cr-V" },
      { label: "Finish", value: "Mirror chrome" },
    ],
  },
];

export const SERVICES = [
  {
    title: "Battery Testing & Installation",
    desc: "Free diagnostic load-testing, professional fitting and old-unit recycling on every battery we supply.",
  },
  {
    title: "Tyre Fitting & Balancing",
    desc: "Computerised wheel balancing and precision fitting that protects your suspension and your tread life.",
  },
  {
    title: "Wheel Alignment",
    desc: "Laser-guided alignment that keeps your vehicle tracking straight and your tyres wearing evenly.",
  },
  {
    title: "Fleet & Corporate Supply",
    desc: "Volume supply programmes for logistics fleets, factories and government, with scheduled servicing.",
  },
  {
    title: "Inverter & Solar Power Systems",
    desc: "Deep-cycle battery banks sized, installed and maintained for homes and businesses that can't go dark.",
  },
  {
    title: "Industrial Tool Sourcing",
    desc: "Workshop-grade tools and equipment sourced to spec, backed by genuine manufacturer warranties.",
  },
];

export const STATS = [
  { value: 15, suffix: "+", label: "Years in business" },
  { value: 12000, suffix: "+", label: "Vehicles powered" },
  { value: 6, suffix: "", label: "Sourcing nations" },
  { value: 40, suffix: "+", label: "Brands stocked" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Kendyn fitted my entire delivery fleet with HaulPro tyres. Eighteen months on Lagos–Ibadan expressway and the wear is still even. Nobody else in Ogun State operates at this level.",
    name: "Adebayo O.",
    role: "Fleet Manager, Logistics Co.",
  },
  {
    quote:
      "They load-tested my old battery for free, showed me the readout, and had a TitanCell installed in twenty minutes. Honest people, serious equipment.",
    name: "Chinedu E.",
    role: "Private motorist, Sagamu",
  },
  {
    quote:
      "Our factory inverter bank runs on their SolarCore units. Two years, zero downtime. Their after-sales follow-up is something I've never seen from a parts dealer.",
    name: "Mrs. Funke A.",
    role: "Operations Director, Manufacturing",
  },
  {
    quote:
      "The alignment and balancing service is world class. My steering has never felt this precise, and I drive a German car that's picky about everything.",
    name: "Tunde K.",
    role: "Engineer, Abeokuta",
  },
];

