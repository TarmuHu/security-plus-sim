import type { DomainId } from "./types";

export const DOMAIN_META: Record<
  DomainId,
  { name: string; short: string; weight: number }
> = {
  1: {
    name: "General Security Concepts",
    short: "Concepts",
    weight: 0.12,
  },
  2: {
    name: "Threats, Vulnerabilities, and Mitigations",
    short: "Threats",
    weight: 0.22,
  },
  3: {
    name: "Security Architecture",
    short: "Architecture",
    weight: 0.18,
  },
  4: {
    name: "Security Operations",
    short: "Operations",
    weight: 0.28,
  },
  5: {
    name: "Security Program Management and Oversight",
    short: "Governance",
    weight: 0.2,
  },
};

export const FULL_EXAM_BLUEPRINT = {
  id: "sy0-701-full",
  title: "Security+ SY0-701 Full Practice Exam",
  mode: "full" as const,
  durationMs: 90 * 60 * 1000,
  itemCount: 90,
  domainWeights: {
    1: 0.12,
    2: 0.22,
    3: 0.18,
    4: 0.28,
    5: 0.2,
  } as Record<DomainId, number>,
  passScaled: 750,
  maxScaled: 900,
  pbqCount: 3,
};

export const DRILL_ITEM_COUNT = 20;
export const DRILL_DURATION_MS = 25 * 60 * 1000;

export const QUICK_QUIZ_BLUEPRINT = {
  id: "sy0-701-quick",
  title: "Security+ Quick Quiz (20)",
  mode: "drill" as const,
  durationMs: 25 * 60 * 1000,
  itemCount: 20,
  domainWeights: {
    1: 0.12,
    2: 0.22,
    3: 0.18,
    4: 0.28,
    5: 0.2,
  } as Record<DomainId, number>,
  passScaled: 750,
  maxScaled: 900,
  pbqCount: 0,
};

export const PRACTICE_BLUEPRINT = {
  id: "sy0-701-practice",
  title: "Security+ Instant Practice (20)",
  mode: "drill" as const,
  durationMs: 40 * 60 * 1000,
  itemCount: 20,
  domainWeights: {
    1: 0.12,
    2: 0.22,
    3: 0.18,
    4: 0.28,
    5: 0.2,
  } as Record<DomainId, number>,
  passScaled: 750,
  maxScaled: 900,
  pbqCount: 0,
};

export function missedRetryBlueprint(count: number) {
  return {
    id: "sy0-701-missed-retry",
    title: "Retry Missed Items",
    mode: "drill" as const,
    durationMs: Math.max(15, count * 1.5) * 60 * 1000,
    itemCount: count,
    domainWeights: {
      1: 0.2,
      2: 0.2,
      3: 0.2,
      4: 0.2,
      5: 0.2,
    } as Record<DomainId, number>,
    passScaled: 750,
    maxScaled: 900,
    pbqCount: 0,
  };
}

export function drillBlueprint(domain: DomainId) {
  return {
    id: `sy0-701-drill-${domain}`,
    title: `Domain ${domain} Drill — ${DOMAIN_META[domain].name}`,
    mode: "drill" as const,
    durationMs: DRILL_DURATION_MS,
    itemCount: DRILL_ITEM_COUNT,
    domainWeights: {
      1: domain === 1 ? 1 : 0,
      2: domain === 2 ? 1 : 0,
      3: domain === 3 ? 1 : 0,
      4: domain === 4 ? 1 : 0,
      5: domain === 5 ? 1 : 0,
    } as Record<DomainId, number>,
    passScaled: 750,
    maxScaled: 900,
    pbqCount: 0,
    domainFilter: domain,
  };
}
