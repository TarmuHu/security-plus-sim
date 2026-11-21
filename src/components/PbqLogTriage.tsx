"use client";

import type { PbqLogTriageQuestion, ResponseValue } from "@/lib/types";

export function PbqLogTriage({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: PbqLogTriageQuestion;
  value: ResponseValue | undefined;
  onChange: (v: string[]) => void;
  hideScenario?: boolean;
}) {
  const selected: string[] =
    Array.isArray(value) && value.every((v) => typeof v === "string")
      ? value
      : [];
  const hosts = Array.from(new Set(question.logs.map((l) => l.host)));

  function toggle(host: string) {
    onChange(
      selected.includes(host)
        ? selected.filter((h) => h !== host)
        : [...selected, host]
    );
  }

  return (
    <div className="space-y-4">
      <p className="vue-stem">{question.stem}</p>
      {!hideScenario && (
        <div className="panel p-3 text-sm mb-3">{question.scenario}</div>
      )}
      <div
        className="panel overflow-auto max-h-72 font-mono text-xs"
        style={{ background: "#0f172a", color: "#e2e8f0" }}
      >
        <table className="w-full">
          <thead>
            <tr className="text-left" style={{ color: "#94a3b8" }}>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Host</th>
              <th className="px-3 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {question.logs.map((l) => (
              <tr key={l.id} className="border-t border-slate-700">
                <td className="px-3 py-2 whitespace-nowrap">{l.timestamp}</td>
                <td className="px-3 py-2 whitespace-nowrap">{l.host}</td>
                <td className="px-3 py-2">{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
          Select compromised hosts:
        </p>
        <div className="flex flex-wrap gap-2">
          {hosts.map((h) => (
            <label
              key={h}
              className="choice !w-auto items-center"
              data-selected={selected.includes(h)}
            >
              <input
                type="checkbox"
                checked={selected.includes(h)}
                onChange={() => toggle(h)}
              />
              <span className="font-mono text-sm">{h}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
