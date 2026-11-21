"use client";

import type { PbqMatchQuestion, ResponseValue } from "@/lib/types";
import { useMemo } from "react";

export function PbqMatch({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: PbqMatchQuestion;
  value: ResponseValue | undefined;
  onChange: (v: Record<string, string>) => void;
  hideScenario?: boolean;
}) {
  const mapping =
    value && !Array.isArray(value) && typeof value !== "string" ? value : {};

  const rights = useMemo(() => {
    const base = question.pairs.map((p) => ({
      id: p.rightId,
      text: p.right,
    }));
    const extras = (question.distractors ?? []).map((t, i) => ({
      id: `D${i + 1}`,
      text: t,
    }));
    return [...base, ...extras];
  }, [question]);

  return (
    <div className="space-y-4">
      <p className="vue-stem">{question.stem}</p>
      {!hideScenario && (
        <div className="panel p-3 text-sm mb-3" style={{ color: "var(--muted)" }}>
          {question.scenario}
        </div>
      )}
      <div className="space-y-3">
        {question.pairs.map((p) => (
          <div
            key={p.leftId}
            className="grid gap-2 md:grid-cols-[1fr_auto_1fr] items-center"
          >
            <div className="panel px-3 py-2 text-sm">{p.left}</div>
            <div className="text-center text-xs" style={{ color: "var(--muted)" }}>
              →
            </div>
            <select
              className="border px-2 py-2 bg-white"
              style={{ borderColor: "var(--line)" }}
              value={mapping[p.leftId] ?? ""}
              onChange={(e) =>
                onChange({ ...mapping, [p.leftId]: e.target.value })
              }
            >
              <option value="">Select match…</option>
              {rights.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.text}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
