import type {
  FirewallRule,
  Question,
  ResponseValue,
  ScoreReport,
  DomainId,
  Difficulty,
} from "./types";
import { DOMAIN_META } from "./domains";

function sameStringSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function rulesEqual(a: FirewallRule, b: FirewallRule): boolean {
  return (
    a.action === b.action &&
    a.protocol === b.protocol &&
    a.source === b.source &&
    a.destination === b.destination &&
    a.port === b.port
  );
}

export function isAnswered(value: ResponseValue | undefined): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    if (typeof value[0] === "object" && value[0] !== null && "action" in value[0]) {
      return (value as FirewallRule[]).some(
        (r) => r.source.trim() || r.destination.trim() || r.port.trim()
      );
    }
    return value.length > 0;
  }
  return Object.values(value).some((v) => typeof v === "string" && v.length > 0);
}

/**
 * Credit on [0, 1] for one item.
 * Aligns with CompTIA public notes: PBQs may allow partial credit; MCQ multi
 * is all-or-nothing in most practice banks (we still allow partial for multi).
 */
export function scoreQuestion(
  question: Question,
  response: ResponseValue | undefined
): number {
  if (response == null) return 0;

  switch (question.type) {
    case "mcq_single": {
      if (!Array.isArray(response) || !response.every((v) => typeof v === "string"))
        return 0;
      return sameStringSet(response, question.answer) ? 1 : 0;
    }
    case "mcq_multi": {
      if (!Array.isArray(response) || !response.every((v) => typeof v === "string"))
        return 0;
      const selected = new Set(response);
      const need = new Set(question.answer);
      let hits = 0;
      for (const id of need) if (selected.has(id)) hits += 1;
      let extras = 0;
      for (const id of selected) if (!need.has(id)) extras += 1;
      // Partial credit with penalty for wrong selections (common psychometric style)
      const raw = (hits - extras) / need.size;
      return Math.min(1, Math.max(0, raw));
    }
    case "pbq_match": {
      if (!response || Array.isArray(response) || typeof response === "string")
        return 0;
      const n = question.pairs.length;
      if (n === 0) return 0;
      const hits = question.pairs.filter(
        (p) => response[p.leftId] === p.rightId
      ).length;
      return hits / n;
    }
    case "pbq_firewall": {
      if (
        !Array.isArray(response) ||
        response.length === 0 ||
        typeof response[0] !== "object" ||
        response[0] === null ||
        !("action" in response[0])
      )
        return 0;
      const rules = response as FirewallRule[];
      const n = question.answer.length;
      if (n === 0) return 0;
      let hits = 0;
      for (let i = 0; i < n; i++) {
        if (rules[i] && rulesEqual(rules[i], question.answer[i])) hits += 1;
      }
      return hits / n;
    }
    case "pbq_log_triage": {
      if (!Array.isArray(response) || !response.every((v) => typeof v === "string"))
        return 0;
      const selected = new Set(response);
      const need = new Set(question.answer);
      let hits = 0;
      for (const h of need) if (selected.has(h)) hits += 1;
      let extras = 0;
      for (const h of selected) if (!need.has(h)) extras += 1;
      const denom = Math.max(need.size, 1);
      return Math.min(1, Math.max(0, (hits - extras) / denom));
    }
    case "pbq_sequence": {
      if (!Array.isArray(response) || !response.every((v) => typeof v === "string"))
        return 0;
      const n = question.answer.length;
      if (n === 0) return 0;
      let hits = 0;
      for (let i = 0; i < n; i++) {
        if (response[i] === question.answer[i]) hits += 1;
      }
      return hits / n;
    }
    case "pbq_topology": {
      if (!response || Array.isArray(response) || typeof response === "string")
        return 0;
      const n = question.slots.length;
      if (n === 0) return 0;
      const hits = question.slots.filter((s) => response[s.id] === s.answer)
        .length;
      return hits / n;
    }
    default:
      return 0;
  }
}

export function gradeQuestion(
  question: Question,
  response: ResponseValue | undefined
): boolean {
  return scoreQuestion(question, response) >= 0.999;
}

/**
 * Base points before difficulty — mirrors public CompTIA notes that some PBQs
 * may carry higher point values. With ~3 PBQs in a 90-item form, weight 5
 * makes PBQs roughly ~15% of total points (community ballpark).
 */
export function baseItemWeight(question: Question): number {
  return question.type.startsWith("pbq_") ? 5 : 1;
}

/** Harder items contribute more (public descriptions of scaled/IRT-style exams). */
export function difficultyMultiplier(d: Difficulty | undefined): number {
  if (d === "easy") return 0.85;
  if (d === "hard") return 1.25;
  return 1;
}

export function itemWeight(question: Question): number {
  return baseItemWeight(question) * difficultyMultiplier(question.difficulty);
}

/**
 * Map weighted accuracy → 100–900 practice scale.
 * Anchors: 0%→100, ~75%→750 (Security+ published pass), 100%→900.
 * Real CompTIA equating is form-specific and unpublished.
 */
export function toScaledScoreFromPercent(weightedPct: number): number {
  const p = Math.min(1, Math.max(0, weightedPct));
  if (p <= 0.75) {
    return Math.round(100 + (p / 0.75) * (750 - 100));
  }
  return Math.round(750 + ((p - 0.75) / 0.25) * (900 - 750));
}

export function toScaledScore(
  correct: number,
  total: number,
  _maxScaled = 900
): number {
  if (total === 0) return 100;
  return toScaledScoreFromPercent(correct / total);
}

export const SCORING_MODEL_NOTE =
  "Closest public-aligned practice model: scale 100–900 (pass 750); PBQs worth 5× MCQs; harder items worth more; partial credit on multi-select & PBQs. CompTIA’s live equating/IRT weights remain confidential — this cannot match the real algorithm exactly.";

export function buildScoreReport(
  attemptId: string,
  questions: Question[],
  responses: Record<string, ResponseValue>,
  passScaled = 750,
  _maxScaled = 900
): ScoreReport {
  const itemResults = questions.map((q) => {
    const credit = scoreQuestion(q, responses[q.id]);
    return {
      questionId: q.id,
      correct: credit >= 0.999,
      credit,
      domain: q.domain,
      objective: q.objective,
    };
  });

  const rawCorrect = itemResults.filter((r) => r.correct).length;
  const rawTotal = itemResults.length;
  const rawPercent =
    rawTotal === 0 ? 0 : Math.round((rawCorrect / rawTotal) * 100);

  let weightedEarned = 0;
  let weightedPossible = 0;
  for (const q of questions) {
    const w = itemWeight(q);
    weightedPossible += w;
    const result = itemResults.find((i) => i.questionId === q.id);
    weightedEarned += w * (result?.credit ?? 0);
  }

  const weightedPct =
    weightedPossible === 0 ? 0 : weightedEarned / weightedPossible;
  const scaledScore = toScaledScoreFromPercent(weightedPct);

  const domainScores = ([1, 2, 3, 4, 5] as DomainId[]).map((domain) => {
    const qInDomain = questions.filter((q) => q.domain === domain);
    let earned = 0;
    let possible = 0;
    for (const q of qInDomain) {
      const w = itemWeight(q);
      possible += w;
      const credit =
        itemResults.find((i) => i.questionId === q.id)?.credit ?? 0;
      earned += w * credit;
    }
    const items = itemResults.filter((r) => r.domain === domain);
    const correct = items.filter((r) => r.correct).length;
    const total = items.length;
    return {
      domain,
      correct,
      total,
      percent:
        possible === 0 ? 0 : Math.round((earned / possible) * 100),
    };
  });

  return {
    attemptId,
    rawCorrect,
    rawTotal,
    rawPercent,
    weightedEarned: Math.round(weightedEarned * 100) / 100,
    weightedPossible: Math.round(weightedPossible * 100) / 100,
    scoringModel: SCORING_MODEL_NOTE,
    scaledScore,
    passed: scaledScore >= passScaled,
    domainScores: domainScores.filter((d) => d.total > 0),
    itemResults,
  };
}

export function domainLabel(domain: DomainId): string {
  return DOMAIN_META[domain].name;
}
