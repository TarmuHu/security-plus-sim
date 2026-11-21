import type { DomainId, Question, ScoreReport } from "./types";
import { DOMAIN_META } from "./domains";

export interface CoachAction {
  label: string;
  href: string;
  reason: string;
}

const CRAM_BY_DOMAIN: Record<DomainId, { id: string; title: string }> = {
  1: { id: "arch-crypto-v1", title: "Architecture + Crypto Core" },
  2: { id: "threats-v1", title: "Threats & Mitigations Sprint" },
  3: { id: "arch-crypto-v1", title: "Architecture + Crypto Core" },
  4: { id: "ops-ir-v1", title: "Ops + IR Crush" },
  5: { id: "gov-risk-v1", title: "Governance & Risk Blitz" },
};

const GUIDE_BY_DOMAIN: Partial<Record<DomainId, { slug: string; title: string }>> = {
  1: { slug: "control-and-crypto-basics", title: "Controls & Crypto Quick Guide" },
  2: { slug: "best-most-traps", title: "BEST / MOST Wording Traps" },
  4: { slug: "pbq-strategy", title: "PBQ Strategy Guide" },
  5: { slug: "domain-priorities", title: "SY0-701 Domain Priorities" },
};

/** Build remediation links from the weakest domains on a score report. */
export function buildCoachActions(report: ScoreReport): CoachAction[] {
  const ranked = [...report.domainScores].sort((a, b) => a.percent - b.percent);
  const weakest = ranked.filter((d) => d.total > 0).slice(0, 2);
  const actions: CoachAction[] = [];

  for (const d of weakest) {
    const cram = CRAM_BY_DOMAIN[d.domain];
    actions.push({
      label: `Cram: ${cram.title}`,
      href: `/cram/${cram.id}`,
      reason: `Domain ${d.domain} (${DOMAIN_META[d.domain].short}) at ${d.percent}%`,
    });
    actions.push({
      label: `Domain ${d.domain} drill`,
      href: `/security-plus?drill=${d.domain}`,
      reason: `20 focused MCQs · ${DOMAIN_META[d.domain].name}`,
    });
    const guide = GUIDE_BY_DOMAIN[d.domain];
    if (guide) {
      actions.push({
        label: `Guide: ${guide.title}`,
        href: `/guides/${guide.slug}`,
        reason: `Read before the next timed attempt`,
      });
    }
  }

  actions.push({
    label: "Exam-Day Rapid 30",
    href: "/cram/exam-day-v1",
    reason: "Cross-domain highest-hit mid-review",
  });

  actions.push({
    label: "Wrong-answer notebook",
    href: "/notebook",
    reason: "Retry misses with instant feedback across sessions",
  });

  const seen = new Set<string>();
  return actions.filter((a) => {
    if (seen.has(a.href)) return false;
    seen.add(a.href);
    return true;
  });
}

export function formatCorrectAnswer(question: Question): string | null {
  switch (question.type) {
    case "mcq_single":
    case "mcq_multi":
      return question.answer
        .map((id) => {
          const c = question.choices.find((x) => x.id === id);
          return c ? `${c.id}. ${c.text}` : id;
        })
        .join(" · ");
    case "pbq_match":
      return question.pairs.map((p) => `${p.left} → ${p.right}`).join("; ");
    case "pbq_topology":
      return question.slots.map((s) => `${s.label}: ${s.answer}`).join("; ");
    case "pbq_sequence":
      return question.answer
        .map((id) => question.steps.find((s) => s.id === id)?.text ?? id)
        .join(" → ");
    case "pbq_log_triage":
      return question.answer.join(", ");
    case "pbq_firewall":
      return question.answer
        .map(
          (r, i) =>
            `${i + 1}. ${r.action} ${r.protocol} ${r.source}→${r.destination}:${r.port}`
        )
        .join("; ");
    default:
      return null;
  }
}
