"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductHeader } from "@/components/ProductHeader";
import {
  DRILL_KIND_GROUP,
  DRILL_KIND_SECTIONS,
  DRILL_META,
  cardsForKind,
  memoryListHref,
  type DrillKind,
} from "@/lib/drills";
import { MEMORY_SECTIONS } from "@/lib/memory-list";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DrillSessionPage() {
  const params = useParams();
  const kind = String(params.kind ?? "") as DrillKind;
  const valid = kind in DRILL_META;

  const deck = useMemo(
    () => (valid ? shuffle(cardsForKind(kind)) : []),
    [kind, valid]
  );

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);

  if (!valid) {
    return (
      <div className="lobby-shell p-8">
        <p>Unknown drill.</p>
        <Link href="/drills">Back</Link>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="lobby-shell p-8 space-y-3">
        <p>No cards in this deck yet.</p>
        <Link href="/drills">Back to drills</Link>
      </div>
    );
  }

  const card = deck[index];
  const meta = DRILL_META[kind];
  const sectionIds = DRILL_KIND_SECTIONS[kind];
  const memoryGroupHref = memoryListHref({ group: DRILL_KIND_GROUP[kind] });

  function grade(ok: boolean) {
    setAnswered((n) => n + 1);
    if (ok) setCorrect((n) => n + 1);
    setRevealed(false);
    if (index >= deck.length - 1) setDone(true);
    else setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="lobby-shell min-h-screen">
        <ProductHeader
          backHref="/drills"
          backLabel="← All drills"
          eyebrow={meta.title}
          title="Drill complete"
          subtitle={`You marked ${correct} / ${answered} as solid.`}
          background="linear-gradient(135deg, #713f12 0%, #a16207 55%, #ca8a04 100%)"
          activeCertId="security-plus"
        />
        <main className="mx-auto max-w-xl px-6 py-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setIndex(0);
                  setCorrect(0);
                  setAnswered(0);
                  setRevealed(false);
                  setDone(false);
                }}
              >
                Run again
              </button>
              <Link href="/drills" className="btn">
                Other drills
              </Link>
            </div>
            <Link href={memoryGroupHref} className="link-quiet text-sm">
              View in memory list
            </Link>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Topics in this deck:{" "}
            {sectionIds.map((id, i) => {
              const title =
                MEMORY_SECTIONS.find((s) => s.id === id)?.title ?? id;
              return (
                <span key={id}>
                  {i > 0 ? " · " : ""}
                  <Link
                    href={memoryListHref({ section: id })}
                    style={{ color: "#a16207", fontWeight: 600 }}
                  >
                    {title}
                  </Link>
                </span>
              );
            })}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/drills"
        backLabel="← All drills"
        eyebrow={meta.title}
        title={`Card ${index + 1} / ${deck.length}`}
        subtitle={meta.blurb}
        background="linear-gradient(135deg, #713f12 0%, #a16207 55%, #ca8a04 100%)"
        activeCertId="security-plus"
      />

      <main className="mx-auto max-w-xl px-6 py-8 space-y-4">
        <button
          type="button"
          className="w-full panel bg-white p-8 text-left min-h-[220px]"
          onClick={() => setRevealed(true)}
        >
          <p
            className="text-xs uppercase tracking-wide mb-3"
            style={{ color: "var(--muted)" }}
          >
            {revealed ? "Answer" : "Prompt — tap to reveal"}
            {" · "}
            {card.freq}
          </p>
          <p className="text-2xl font-semibold">{card.prompt}</p>
          {revealed && (
            <div
              className="mt-6 pt-4 border-t"
              style={{ borderColor: "var(--line)" }}
            >
              <p className="text-lg text-amber-900 font-medium">{card.answer}</p>
              {card.hint && (
                <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                  Note: {card.hint}
                </p>
              )}
            </div>
          )}
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => setRevealed(true)}
            disabled={revealed}
          >
            Reveal
          </button>
          <button
            type="button"
            className="btn"
            disabled={!revealed}
            onClick={() => grade(false)}
          >
            Missed
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!revealed}
            onClick={() => grade(true)}
          >
            Got it
          </button>
        </div>
        <p className="text-xs m-0" style={{ color: "var(--muted)" }}>
          Score so far: {correct}/{answered}
          {" · "}
          <Link href={memoryGroupHref} className="link-quiet text-xs">
            View in memory list
          </Link>
        </p>
      </main>
    </div>
  );
}
