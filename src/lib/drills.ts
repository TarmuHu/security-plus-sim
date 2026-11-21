import {
  MEMORY_FREQ_META,
  MEMORY_SECTIONS,
  type MemoryFreq,
  type MemoryGroupId,
  type MemorySectionId,
} from "./memory-list";

export type DrillKind =
  | "ports"
  | "crypto"
  | "network-sec"
  | "identity"
  | "ops"
  | "cloud-gov"
  | "controls"
  | "recovery";

export interface DrillCard {
  id: string;
  kind: DrillKind;
  /** Memory-list section this card came from (for deep links). */
  sectionId: MemorySectionId;
  prompt: string;
  answer: string;
  hint?: string;
  freq: MemoryFreq;
}

/** Which memory-list sections feed each flash deck. */
export const DRILL_KIND_SECTIONS: Record<DrillKind, MemorySectionId[]> = {
  ports: ["ports"],
  crypto: ["crypto-concepts", "symmetric", "asymmetric", "hashing"],
  "network-sec": ["wireless", "secure-protocols"],
  identity: [
    "auth-protocols",
    "email-auth",
    "acronyms-core",
    "acronyms-identity",
  ],
  ops: ["acronyms-threats", "acronyms-ops"],
  "cloud-gov": ["acronyms-cloud", "acronyms-gov"],
  controls: ["control-types", "control-functions", "control-examples"],
  recovery: ["recovery"],
};

/** Primary memory category to open for a drill deck. */
export const DRILL_KIND_GROUP: Record<DrillKind, MemoryGroupId> = {
  ports: "network",
  crypto: "crypto",
  "network-sec": "network",
  identity: "identity",
  ops: "threats-ops",
  "cloud-gov": "cloud-gov",
  controls: "controls-recovery",
  recovery: "controls-recovery",
};

/** Include rows up to this frequency (ports also pull Useful). */
const KIND_MAX_FREQ: Record<DrillKind, MemoryFreq> = {
  ports: "useful",
  crypto: "often",
  "network-sec": "often",
  identity: "often",
  ops: "often",
  "cloud-gov": "often",
  controls: "often",
  recovery: "often",
};

export const DRILL_META: Record<
  DrillKind,
  { title: string; blurb: string }
> = {
  ports: {
    title: "Ports & protocols",
    blurb: "Service ↔ port — Must / Often / Useful from the memory list.",
  },
  crypto: {
    title: "Cryptography",
    blurb: "Concepts, symmetric/asymmetric, hashing, PKI — Must / Often.",
  },
  "network-sec": {
    title: "Wireless & secure protocols",
    blurb: "WPA/WEP, IPsec, TLS, DNSSEC — Must / Often.",
  },
  identity: {
    title: "Identity & access",
    blurb: "Auth, federation, email auth, core IAM terms — Must / Often.",
  },
  ops: {
    title: "Threats & operations",
    blurb: "Attacks, SIEM/IR, detection tools — Must / Often.",
  },
  "cloud-gov": {
    title: "Cloud & governance",
    blurb: "Cloud models, privacy, risk, agreements — Must / Often.",
  },
  controls: {
    title: "Controls",
    blurb: "Types, functions, and type+function examples — Must / Often.",
  },
  recovery: {
    title: "Recovery & risk terms",
    blurb: "RTO, RPO, sites, backups, HA — Must / Often.",
  },
};

function freqAllowed(freq: MemoryFreq, max: MemoryFreq): boolean {
  return MEMORY_FREQ_META[freq].order <= MEMORY_FREQ_META[max].order;
}

function buildCards(): DrillCard[] {
  const cards: DrillCard[] = [];
  for (const kind of Object.keys(DRILL_KIND_SECTIONS) as DrillKind[]) {
    const max = KIND_MAX_FREQ[kind];
    for (const sectionId of DRILL_KIND_SECTIONS[kind]) {
      const section = MEMORY_SECTIONS.find((s) => s.id === sectionId);
      if (!section) continue;
      for (const r of section.rows) {
        if (!freqAllowed(r.freq, max)) continue;
        cards.push({
          id: `${sectionId}:${r.term}`,
          kind,
          sectionId,
          prompt: r.term,
          answer: r.value,
          hint: r.note,
          freq: r.freq,
        });
      }
    }
  }
  return cards;
}

export const DRILL_CARDS: DrillCard[] = buildCards();

export function cardsForKind(kind: DrillKind): DrillCard[] {
  return DRILL_CARDS.filter((c) => c.kind === kind);
}

export function drillCount(kind: DrillKind): number {
  return cardsForKind(kind).length;
}

export const DRILL_KINDS = Object.keys(DRILL_META) as DrillKind[];

export function drillKindForSection(
  sectionId: MemorySectionId
): DrillKind | null {
  for (const kind of DRILL_KINDS) {
    if (DRILL_KIND_SECTIONS[kind].includes(sectionId)) return kind;
  }
  return null;
}

/** Deep link into Memory List (section + optional term search). */
export function memoryListHref(opts: {
  section?: MemorySectionId;
  group?: MemoryGroupId;
  q?: string;
  /** Scroll to this term row (requires section). */
  term?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.section) params.set("section", opts.section);
  else if (opts.group) params.set("group", opts.group);
  if (opts.q) params.set("q", opts.q);
  const qs = params.toString();
  let hash = "";
  if (opts.section && opts.term) {
    hash = `#${termAnchorId(opts.section, opts.term)}`;
  } else if (opts.section) {
    hash = `#${opts.section}`;
  }
  return qs ? `/memory?${qs}${hash}` : `/memory${hash}`;
}

export function drillHref(kind: DrillKind): string {
  return `/drills/${kind}`;
}

export function slugTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function termAnchorId(sectionId: MemorySectionId, term: string): string {
  return `term-${sectionId}-${slugTerm(term)}`;
}
