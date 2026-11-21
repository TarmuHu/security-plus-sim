"use client";

import type { PbqSequenceQuestion, ResponseValue } from "@/lib/types";

export function PbqSequence({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: PbqSequenceQuestion;
  value: ResponseValue | undefined;
  onChange: (v: string[]) => void;
  hideScenario?: boolean;
}) {
  const order: string[] =
    Array.isArray(value) && value.every((v) => typeof v === "string")
      ? value
      : [];
  const remaining = question.steps.filter((s) => !order.includes(s.id));

  function add(id: string) {
    onChange([...order, id]);
  }

  function removeAt(i: number) {
    onChange(order.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  const label = (id: string) =>
    question.steps.find((s) => s.id === id)?.text ?? id;

  return (
    <div className="space-y-4">
      <p className="vue-stem">{question.stem}</p>
      {!hideScenario && (
        <div className="panel p-3 text-sm mb-3">{question.scenario}</div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold mb-2">Available steps</h3>
          <div className="space-y-2">
            {remaining.map((s) => (
              <button
                key={s.id}
                type="button"
                className="choice"
                onClick={() => add(s.id)}
              >
                {s.text}
              </button>
            ))}
            {remaining.length === 0 && (
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                All steps placed.
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Your order</h3>
          <ol className="space-y-2">
            {order.map((id, i) => (
              <li
                key={`${id}-${i}`}
                className="panel flex items-center gap-2 px-3 py-2 text-sm"
              >
                <span className="font-mono w-6">{i + 1}.</span>
                <span className="flex-1">{label(id)}</span>
                <button type="button" className="btn text-xs" onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="btn text-xs" onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button type="button" className="btn text-xs" onClick={() => removeAt(i)}>
                  ✕
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn mt-3 text-xs"
            onClick={() => onChange([])}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
