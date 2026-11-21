export type ProductStatus = "live" | "soon";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  status: ProductStatus;
  badge?: string;
  accent: string;
}

/** Security+ product suite (live). Other certs use placeholders from certs.ts. */
export const SECURITY_PLUS_PRODUCTS: Product[] = [
  {
    id: "sy0-701-exam",
    name: "Security+ Exam Simulator",
    tagline: "SY0-701 · Pearson-style delivery",
    description:
      "Timed full exam and domain drills with MCQs, PBQ simulations, flag/review, and score reports.",
    href: "/security-plus",
    status: "live",
    badge: "Exam",
    accent: "#1f4b7a",
  },
  {
    id: "sy0-701-cram",
    name: "30-Min Mid-Review",
    tagline: "High-yield cram packs",
    description:
      "Six ranked secret packs built from official domain weights and public high-frequency patterns — not braindumps.",
    href: "/cram",
    status: "live",
    badge: "Cram",
    accent: "#1a3d2e",
  },
  {
    id: "tips-guides",
    name: "Tips & Guides",
    tagline: "Strategy · traps · exam-day",
    description:
      "Read guides on PBQ pacing, BEST/MOST wording, domain priorities, and what to expect on test day.",
    href: "/guides",
    status: "live",
    badge: "Guides",
    accent: "#6b3fa0",
  },
  {
    id: "useful-links",
    name: "Useful Links",
    tagline: "Official & trusted resources",
    description:
      "Curated links to CompTIA objectives, Pearson VUE delivery info, and legitimate study references.",
    href: "/links",
    status: "live",
    badge: "Links",
    accent: "#0e7490",
  },
  {
    id: "pbq-lab",
    name: "PBQ Lab",
    tagline: "Simulations only",
    description:
      "Practice performance-based items in isolation — firewall rules, log triage, matching, sequencing, and topology.",
    href: "/pbq-lab",
    status: "live",
    badge: "PBQ",
    accent: "#9a3412",
  },
  {
    id: "memory-list",
    name: "Memory List",
    tagline: "Topic tables · Must / Often tags",
    description:
      "Searchable high-yield SY0-701 reference — ports, crypto, wireless, auth, ops, governance — with official CompTIA PDF links.",
    href: "/memory",
    status: "live",
    badge: "Memory",
    accent: "#0f766e",
  },
  {
    id: "memory-drills",
    name: "Ports & Acronyms Drill",
    tagline: "Rapid recall flash trainer",
    description:
      "Flash decks synced from the Memory List — ports, crypto, wireless, identity, ops, cloud/gov, controls, recovery.",
    href: "/drills",
    status: "live",
    badge: "Drill",
    accent: "#a16207",
  },
  {
    id: "wrong-notebook",
    name: "Wrong-Answer Notebook",
    tagline: "Cross-session miss tracker",
    description:
      "Items you miss in practice or exams stay here until you get them right. Retry with instant feedback.",
    href: "/notebook",
    status: "live",
    badge: "Notebook",
    accent: "#b91c1c",
  },
];

/** @deprecated Use SECURITY_PLUS_PRODUCTS or getCert(id).products */
export const PRODUCTS = SECURITY_PLUS_PRODUCTS;
