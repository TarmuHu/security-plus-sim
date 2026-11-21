import type { Product, ProductStatus } from "./products";
import { SECURITY_PLUS_PRODUCTS } from "./products";

export type CertStatus = "live" | "soon";

export interface Certification {
  id: string;
  shortName: string;
  name: string;
  examCode: string;
  tagline: string;
  status: CertStatus;
  accent: string;
  /** Product hub for this cert */
  href: string;
  products: Product[];
}

/** Shared product slots used when a cert is not built yet (all soon). */
export function placeholderProducts(certId: string, accent: string): Product[] {
  const slots: Omit<Product, "href" | "status" | "accent">[] = [
    {
      id: `${certId}-exam`,
      name: "Exam Simulator",
      tagline: "Full timed practice",
      description: "Pearson-style delivery with MCQs and performance items.",
      badge: "Exam",
    },
    {
      id: `${certId}-cram`,
      name: "30-Min Mid-Review",
      tagline: "High-yield cram packs",
      description: "Ranked secrets for a fast mid-review session.",
      badge: "Cram",
    },
    {
      id: `${certId}-guides`,
      name: "Tips & Guides",
      tagline: "Strategy · traps · exam-day",
      description: "Guides tailored to this certification.",
      badge: "Guides",
    },
    {
      id: `${certId}-links`,
      name: "Useful Links",
      tagline: "Official & trusted resources",
      description: "Blueprint and delivery links for this exam family.",
      badge: "Links",
    },
    {
      id: `${certId}-pbq`,
      name: "PBQ Lab",
      tagline: "Simulations only",
      description: "Performance-based practice lab.",
      badge: "PBQ",
    },
    {
      id: `${certId}-drills`,
      name: "Memory Drills",
      tagline: "Rapid recall trainer",
      description: "Ports, acronyms, and high-frequency facts.",
      badge: "Drill",
    },
  ];

  return slots.map((s) => ({
    ...s,
    href: `/certs/${certId}`,
    status: "soon" as ProductStatus,
    accent,
  }));
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "security-plus",
    shortName: "Security+",
    name: "CompTIA Security+",
    examCode: "SY0-701",
    tagline: "Core cybersecurity baseline — live practice suite",
    status: "live",
    accent: "#1f4b7a",
    href: "/certs/security-plus",
    products: SECURITY_PLUS_PRODUCTS,
  },
  {
    id: "a-plus",
    shortName: "A+",
    name: "CompTIA A+",
    examCode: "220-1101 / 220-1102",
    tagline: "IT support fundamentals — structure ready, content soon",
    status: "soon",
    accent: "#b45309",
    href: "/certs/a-plus",
    products: placeholderProducts("a-plus", "#b45309"),
  },
  {
    id: "network-plus",
    shortName: "Network+",
    name: "CompTIA Network+",
    examCode: "N10-009",
    tagline: "Networking skills — planned next",
    status: "soon",
    accent: "#0f766e",
    href: "/certs/network-plus",
    products: placeholderProducts("network-plus", "#0f766e"),
  },
];

export function getCert(id: string): Certification | undefined {
  return CERTIFICATIONS.find((c) => c.id === id);
}

export function getLiveCerts(): Certification[] {
  return CERTIFICATIONS.filter((c) => c.status === "live");
}

/** Default cert for deep links that still live under Security+ routes. */
export const DEFAULT_CERT_ID = "security-plus";
