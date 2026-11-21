"use client";

import type { PbqTopologyQuestion, ResponseValue } from "@/lib/types";

export function PbqTopology({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: PbqTopologyQuestion;
  value: ResponseValue | undefined;
  onChange: (v: Record<string, string>) => void;
  hideScenario?: boolean;
}) {
  const mapping =
    value && !Array.isArray(value) && typeof value !== "string" ? value : {};

  return (
    <div className="space-y-4">
      <p className="vue-stem">{question.stem}</p>
      {!hideScenario && (
        <div className="panel p-3 text-sm mb-3">{question.scenario}</div>
      )}
      <div
        className="panel p-4 flex flex-wrap items-center justify-center gap-3 text-sm"
        style={{ background: "#eef2f6" }}
      >
        <span className="px-3 py-2 bg-white border" style={{ borderColor: "var(--line)" }}>
          Internet
        </span>
        <span>→</span>
        <span className="px-3 py-2 bg-amber-50 border border-amber-200">Edge</span>
        <span>→</span>
        <span className="px-3 py-2 bg-white border" style={{ borderColor: "var(--line)" }}>
          DMZ
        </span>
        <span>→</span>
        <span className="px-3 py-2 bg-sky-50 border border-sky-200">Internal</span>
        <span>→</span>
        <span className="px-3 py-2 bg-white border" style={{ borderColor: "var(--line)" }}>
          App / DB
        </span>
      </div>
      <div className="space-y-3">
        {question.slots.map((slot) => (
          <label key={slot.id} className="block space-y-1">
            <span className="text-sm font-medium">{slot.label}</span>
            <select
              className="w-full border px-2 py-2 bg-white"
              style={{ borderColor: "var(--line)" }}
              value={mapping[slot.id] ?? ""}
              onChange={(e) =>
                onChange({ ...mapping, [slot.id]: e.target.value })
              }
            >
              <option value="">Select control…</option>
              {slot.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
