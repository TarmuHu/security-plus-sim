#!/usr/bin/env python3
"""Assign easy/medium/hard difficulty across the SY0-701 question bank.

Heuristics:
  easy   — definitional, ports/acronyms, short single-concept stems
  hard   — multi-step scenarios, BEST/MOST/FIRST wording, multi-select,
           PBQ firewall/log triage
  medium — default remainder

Primary goal: bank-wide ~25% easy / ~50% medium / ~25% hard.
Existing intentional labels are preferred only when balancing still allows.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MCQ_PATH = ROOT / "content" / "sy0-701" / "mcq.json"
PBQ_PATH = ROOT / "content" / "sy0-701" / "pbq.json"

EASY_HINTS = re.compile(
    r"\b(stands for|is called|which port|TCP \d+|UDP \d+|"
    r"acronym|BEST defined|primarily means|is BEST described as|"
    r"WEP|SSH|HTTPS|AAA )\b",
    re.I,
)
HARD_HINTS = re.compile(
    r"\b(MOST|BEST|FIRST|NEXT|scenario|multi-step|simultaneously|"
    r"which TWO|select ALL|order-sensitive|first match)\b",
    re.I,
)
SHORT_STEM = 90


def heuristic_difficulty(q: dict) -> str:
    qtype = q.get("type", "")
    stem = q.get("stem", "") + " " + q.get("scenario", "")

    if qtype == "mcq_multi":
        return "hard"
    if qtype in ("pbq_firewall", "pbq_log_triage"):
        return "hard"
    if qtype == "pbq_sequence" and len(q.get("steps", [])) >= 5:
        return "hard"
    if qtype in ("pbq_match", "pbq_topology", "pbq_sequence"):
        # start as medium; rebalance may promote/demote
        if HARD_HINTS.search(stem):
            return "medium"
        return "medium"

    if qtype.startswith("mcq"):
        answers = q.get("answer") or []
        if len(answers) >= 2:
            return "hard"
        if EASY_HINTS.search(stem) and len(stem) < SHORT_STEM + 40:
            return "easy"
        if HARD_HINTS.search(stem) and (
            "scenario" in stem.lower()
            or stem.count("?") > 1
            or len(stem) > 180
        ):
            return "hard"
        if EASY_HINTS.search(stem) or len(stem) < SHORT_STEM:
            return "easy"
        if HARD_HINTS.search(stem):
            return "hard"
        return "medium"

    return "medium"


def rebalance(questions: list[dict]) -> None:
    n = len(questions)
    target_easy = max(1, round(n * 0.25))
    target_hard = max(1, round(n * 0.25))
    # medium gets the remainder (~50%)
    target_medium = n - target_easy - target_hard

    # Score how "sticky" a heuristic label is (higher = keep if possible)
    def stickiness(q: dict, label: str) -> int:
        score = 0
        qtype = q.get("type", "")
        stem = (q.get("stem") or "") + " " + (q.get("scenario") or "")
        if label == "hard":
            if qtype == "mcq_multi":
                score += 5
            if qtype in ("pbq_firewall", "pbq_log_triage"):
                score += 5
            if HARD_HINTS.search(stem):
                score += 2
            if len(stem) > 160:
                score += 1
        elif label == "easy":
            if EASY_HINTS.search(stem):
                score += 3
            if len(stem) < SHORT_STEM:
                score += 2
            if qtype.startswith("pbq") and qtype not in ("pbq_sequence",):
                score -= 2
        else:
            score += 1
        # Prefer prior intentional labels slightly
        prior = q.get("_prior_difficulty")
        if prior == label:
            score += 2
        return score

    # Initial pass from heuristics (preserve prior in sidecar)
    for q in questions:
        q["_prior_difficulty"] = q.get("difficulty", "medium")
        q["difficulty"] = heuristic_difficulty(q)

    def by_stick(label: str):
        return sorted(
            questions,
            key=lambda q: stickiness(q, label),
            reverse=True,
        )

    # Reset all to medium, then assign hard then easy by stickiness
    for q in questions:
        q["difficulty"] = "medium"

    hard_candidates = by_stick("hard")
    for q in hard_candidates[:target_hard]:
        q["difficulty"] = "hard"

    easy_candidates = [
        q for q in by_stick("easy") if q["difficulty"] == "medium"
    ]
    # Prefer not to force easy onto firewall/log PBQs or multi-select
    easy_candidates.sort(
        key=lambda q: (
            0
            if q.get("type")
            not in ("mcq_multi", "pbq_firewall", "pbq_log_triage")
            else 1,
            -stickiness(q, "easy"),
        )
    )
    for q in easy_candidates[:target_easy]:
        q["difficulty"] = "easy"

    # Fix counts if short on easy (steal from medium)
    counts = Counter(q["difficulty"] for q in questions)
    if counts["easy"] < target_easy:
        need = target_easy - counts["easy"]
        for q in questions:
            if need <= 0:
                break
            if q["difficulty"] == "medium" and q.get("type") not in (
                "mcq_multi",
                "pbq_firewall",
                "pbq_log_triage",
            ):
                q["difficulty"] = "easy"
                need -= 1

    counts = Counter(q["difficulty"] for q in questions)
    if counts["hard"] < target_hard:
        need = target_hard - counts["hard"]
        for q in questions:
            if need <= 0:
                break
            if q["difficulty"] == "medium":
                q["difficulty"] = "hard"
                need -= 1

    # If too many hard, demote lowest-stickiness hard to medium
    counts = Counter(q["difficulty"] for q in questions)
    if counts["hard"] > target_hard:
        extras = counts["hard"] - target_hard
        hard_qs = [q for q in questions if q["difficulty"] == "hard"]
        hard_qs.sort(key=lambda q: stickiness(q, "hard"))
        for q in hard_qs[:extras]:
            # never demote multi / fw / log below hard if we can avoid —
            # but balancing is primary goal
            if q.get("type") in ("mcq_multi", "pbq_firewall", "pbq_log_triage"):
                continue
            q["difficulty"] = "medium"
            extras -= 1
            if extras <= 0:
                break
        # If still over, demote even protected ones
        if extras > 0:
            hard_qs = [q for q in questions if q["difficulty"] == "hard"]
            hard_qs.sort(key=lambda q: stickiness(q, "hard"))
            for q in hard_qs[:extras]:
                q["difficulty"] = "medium"

    counts = Counter(q["difficulty"] for q in questions)
    if counts["easy"] > target_easy:
        extras = counts["easy"] - target_easy
        easy_qs = [q for q in questions if q["difficulty"] == "easy"]
        easy_qs.sort(key=lambda q: stickiness(q, "easy"))
        for q in easy_qs[:extras]:
            q["difficulty"] = "medium"

    # Cleanup sidecar
    for q in questions:
        q.pop("_prior_difficulty", None)

    # Final sanity: ensure only valid labels and approximate targets
    for q in questions:
        if q.get("difficulty") not in ("easy", "medium", "hard"):
            q["difficulty"] = "medium"


def load(path: Path) -> list:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def dump(path: Path, data: list) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main() -> None:
    mcq = load(MCQ_PATH)
    pbq = load(PBQ_PATH)
    all_q = mcq + pbq
    rebalance(all_q)

    # Split back — objects were mutated in place
    dump(MCQ_PATH, mcq)
    dump(PBQ_PATH, pbq)

    counts = Counter(q["difficulty"] for q in all_q)
    total = len(all_q)
    print(f"Total questions: {total} (mcq={len(mcq)}, pbq={len(pbq)})")
    for level in ("easy", "medium", "hard"):
        c = counts[level]
        print(f"  {level}: {c} ({100 * c / total:.1f}%)")


if __name__ == "__main__":
    main()
