#!/usr/bin/env python3
"""Merge expansion batches into the SY0-701 bank and assign difficulty (~25/50/25)."""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MCQ_PATH = ROOT / "content/sy0-701/mcq.json"
PBQ_PATH = ROOT / "content/sy0-701/pbq.json"
BATCH_DIR = ROOT / "content/sy0-701/batches"

EASY_HINTS = re.compile(
    r"\b(which\s+port|acronym|stands for|definition of|what does .* mean|"
    r"cia triad|integrity|confidentiality|availability|hash|md5|sha-|"
    r"symmetric|asymmetric|aes|rsa|tls|ssh|https|mfa|least privilege)\b",
    re.I,
)
HARD_HINTS = re.compile(
    r"\b(BEST|MOST|FIRST|NEXT|LEAST|scenario|analyst|SOC|configure|"
    r"which of the following is the MOST|which action should|"
    r"order the|partial|multi-)\b",
    re.I,
)


def load_json(path: Path):
    return json.loads(path.read_text())


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def merge(existing: list, extras: list) -> tuple[list, int]:
    seen = {q["id"] for q in existing}
    added = 0
    out = list(existing)
    for q in extras:
        if q["id"] in seen:
            continue
        out.append(q)
        seen.add(q["id"])
        added += 1
    return out, added


def score_difficulty(q: dict) -> str:
    """Heuristic prior for difficulty ranking."""
    stem = q.get("stem", "") + " " + q.get("scenario", "")
    t = q.get("type", "")
    if t.startswith("pbq_firewall") or t.startswith("pbq_log"):
        return "hard"
    if t == "mcq_multi":
        return "hard"
    if t.startswith("pbq_"):
        return "medium"
    hard = 0
    easy = 0
    if HARD_HINTS.search(stem):
        hard += 2
    if EASY_HINTS.search(stem) and len(stem) < 140:
        easy += 2
    if q.get("type") == "mcq_single" and len(stem) < 100:
        easy += 1
    if "BEST" in stem or "MOST" in stem or "FIRST" in stem:
        hard += 2
    if hard >= 2:
        return "hard"
    if easy >= 2:
        return "easy"
    return "medium"


def assign_difficulty(items: list) -> None:
    n = len(items)
    target_easy = max(1, round(n * 0.25))
    target_hard = max(1, round(n * 0.25))
    # Rank: more "hard-like" first for hard slots, more "easy-like" for easy
    ranked = sorted(
        items,
        key=lambda q: (
            {"hard": 0, "medium": 1, "easy": 2}[score_difficulty(q)],
            -len(q.get("stem", "")),
            q["id"],
        ),
    )
    for i, q in enumerate(ranked):
        if i < target_hard:
            q["difficulty"] = "hard"
        elif i >= n - target_easy:
            q["difficulty"] = "easy"
        else:
            q["difficulty"] = "medium"


def validate_mcq(q: dict) -> None:
    assert q["type"] in ("mcq_single", "mcq_multi"), q["id"]
    assert len(q["choices"]) >= 4, q["id"]
    assert q["answer"], q["id"]
    ids = {c["id"] for c in q["choices"]}
    for a in q["answer"]:
        assert a in ids, f"{q['id']} bad answer {a}"
    assert q.get("explanation"), q["id"]
    assert q["domain"] in (1, 2, 3, 4, 5), q["id"]


def main() -> None:
    mcq = load_json(MCQ_PATH)
    pbq = load_json(PBQ_PATH)
    added_m = added_p = 0
    for path in sorted(BATCH_DIR.glob("*.json")):
        batch = load_json(path)
        if isinstance(batch, dict):
            m_list = batch.get("mcq", [])
            p_list = batch.get("pbq", [])
        elif isinstance(batch, list):
            m_list = [x for x in batch if str(x.get("type", "")).startswith("mcq")]
            p_list = [x for x in batch if str(x.get("type", "")).startswith("pbq")]
        else:
            continue
        mcq, a = merge(mcq, m_list)
        added_m += a
        pbq, b = merge(pbq, p_list)
        added_p += b

    for q in mcq:
        validate_mcq(q)

    ids = [q["id"] for q in mcq + pbq]
    assert len(ids) == len(set(ids)), "duplicate ids"

    assign_difficulty(mcq + pbq)

    save_json(MCQ_PATH, mcq)
    save_json(PBQ_PATH, pbq)

    diff = Counter(q["difficulty"] for q in mcq + pbq)
    print(
        f"mcq={len(mcq)} (+{added_m}) pbq={len(pbq)} (+{added_p}) "
        f"diff={dict(diff)}"
    )


if __name__ == "__main__":
    main()
