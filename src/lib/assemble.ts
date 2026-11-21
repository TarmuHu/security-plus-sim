import type {
  Attempt,
  DomainId,
  ExamBlueprint,
  Question,
} from "./types";
import { FULL_EXAM_BLUEPRINT } from "./domains";

function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function allocateCounts(
  total: number,
  weights: Record<DomainId, number>
): Record<DomainId, number> {
  const domains = Object.keys(weights).map(Number) as DomainId[];
  const raw = domains.map((d) => ({ d, n: weights[d] * total }));
  const floors = raw.map(({ d, n }) => ({ d, n: Math.floor(n), frac: n - Math.floor(n) }));
  let used = floors.reduce((s, x) => s + x.n, 0);
  const byFrac = [...floors].sort((a, b) => b.frac - a.frac);
  let i = 0;
  while (used < total && i < byFrac.length * 3) {
    floors.find((f) => f.d === byFrac[i % byFrac.length].d)!.n += 1;
    used += 1;
    i += 1;
  }
  return Object.fromEntries(floors.map((f) => [f.d, f.n])) as Record<
    DomainId,
    number
  >;
}

export function assembleExam(
  pool: Question[],
  blueprint: ExamBlueprint = FULL_EXAM_BLUEPRINT
): string[] {
  const mcq = pool.filter((q) => q.type === "mcq_single" || q.type === "mcq_multi");
  const pbq = pool.filter((q) => q.type.startsWith("pbq_"));

  if (blueprint.domainFilter) {
    const filtered = shuffle(
      mcq.filter((q) => q.domain === blueprint.domainFilter)
    );
    return filtered.slice(0, blueprint.itemCount).map((q) => q.id);
  }

  const pbqPick = shuffle(pbq).slice(0, blueprint.pbqCount);
  const remaining = blueprint.itemCount - pbqPick.length;
  const counts = allocateCounts(remaining, blueprint.domainWeights);

  const picked: Question[] = [...pbqPick];
  for (const domain of [1, 2, 3, 4, 5] as DomainId[]) {
    const candidates = shuffle(mcq.filter((q) => q.domain === domain));
    picked.push(...candidates.slice(0, counts[domain] ?? 0));
  }

  // If pool is short in a domain, backfill from any remaining MCQs
  if (picked.length < blueprint.itemCount) {
    const have = new Set(picked.map((q) => q.id));
    const extra = shuffle(mcq.filter((q) => !have.has(q.id)));
    picked.push(...extra.slice(0, blueprint.itemCount - picked.length));
  }

  // PBQs first (realistic), then shuffled MCQs
  const mcqIds = shuffle(picked.filter((q) => !q.type.startsWith("pbq_"))).map(
    (q) => q.id
  );
  const pbqIds = picked.filter((q) => q.type.startsWith("pbq_")).map((q) => q.id);
  return [...pbqIds, ...mcqIds].slice(0, blueprint.itemCount);
}

/** PBQ Lab: all (or N) performance-based items only. */
export function assemblePbqLab(pool: Question[], count = 6): string[] {
  const pbq = shuffle(pool.filter((q) => q.type.startsWith("pbq_")));
  return pbq.slice(0, Math.min(count, pbq.length)).map((q) => q.id);
}

export const PBQ_LAB_BLUEPRINT: ExamBlueprint = {
  id: "sy0-701-pbq-lab",
  title: "PBQ Lab",
  mode: "drill",
  durationMs: 45 * 60 * 1000,
  itemCount: 6,
  domainWeights: { 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2 },
  passScaled: 750,
  maxScaled: 900,
  pbqCount: 6,
};

export function createAttempt(
  questionIds: string[],
  blueprint: ExamBlueprint,
  opts?: { practiceMode?: boolean }
): Attempt {
  const now = Date.now();
  return {
    id: `att_${now}_${Math.random().toString(36).slice(2, 8)}`,
    blueprintId: blueprint.id,
    questionIds,
    responses: {},
    flags: {},
    practiceMode: opts?.practiceMode ?? false,
    revealed: {},
    currentIndex: 0,
    startedAt: now,
    endsAt: now + blueprint.durationMs,
    ndaAccepted: true,
    tutorialSeen: true,
  };
}
