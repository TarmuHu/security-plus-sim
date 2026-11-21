"use client";

import type {
  FirewallRule,
  PbqFirewallQuestion,
  ResponseValue,
} from "@/lib/types";

const emptyRule = (): FirewallRule => ({
  action: "allow",
  protocol: "tcp",
  source: "",
  destination: "",
  port: "",
});

export function PbqFirewall({
  question,
  value,
  onChange,
  hideScenario = false,
}: {
  question: PbqFirewallQuestion;
  value: ResponseValue | undefined;
  onChange: (v: FirewallRule[]) => void;
  hideScenario?: boolean;
}) {
  const rules: FirewallRule[] =
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object" &&
    value[0] !== null &&
    "action" in value[0]
      ? (value as FirewallRule[])
      : question.existingRules.length
        ? [...question.existingRules]
        : [emptyRule()];

  function update(i: number, patch: Partial<FirewallRule>) {
    const next = rules.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <p className="vue-stem">{question.stem}</p>
      {!hideScenario && (
        <div className="panel p-3 text-sm whitespace-pre-wrap mb-3">
          {question.scenario}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white text-left">
              {["#", "Action", "Protocol", "Source", "Destination", "Port", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="border px-2 py-1 font-medium"
                    style={{ borderColor: "var(--line)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i}>
                <td className="border px-2 py-1" style={{ borderColor: "var(--line)" }}>
                  {i + 1}
                </td>
                {(
                  [
                    ["action", ["allow", "deny"]],
                    ["protocol", ["tcp", "udp", "icmp", "any"]],
                  ] as const
                ).map(([field, opts]) => (
                  <td
                    key={field}
                    className="border px-1 py-1"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <select
                      className="w-full bg-white border-0"
                      value={r[field]}
                      onChange={(e) =>
                        update(i, {
                          [field]: e.target.value,
                        } as Partial<FirewallRule>)
                      }
                    >
                      {opts.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                {(["source", "destination", "port"] as const).map((field) => (
                  <td
                    key={field}
                    className="border px-1 py-1"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <input
                      className="w-full px-1 py-1 border-0 bg-white"
                      placeholder={field === "port" ? "443 / any" : "IP / any"}
                      value={r[field]}
                      onChange={(e) => update(i, { [field]: e.target.value })}
                    />
                  </td>
                ))}
                <td className="border px-1 py-1" style={{ borderColor: "var(--line)" }}>
                  <button
                    type="button"
                    className="btn text-xs"
                    onClick={() => onChange(rules.filter((_, idx) => idx !== i))}
                    disabled={rules.length <= 1}
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => onChange([...rules, emptyRule()])}
        >
          Add rule
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onChange([emptyRule()])}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
