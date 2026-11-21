"use client";

import type { McqQuestion, ResponseValue } from "@/lib/types";

export function McqItem({
  question,
  value,
  onChange,
}: {
  question: McqQuestion;
  value: ResponseValue | undefined;
  onChange: (v: string[]) => void;
}) {
  const selected: string[] =
    Array.isArray(value) && value.every((v) => typeof v === "string")
      ? value
      : [];
  const multi = question.type === "mcq_multi";

  function toggle(id: string) {
    if (multi) {
      onChange(
        selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id]
      );
    } else {
      onChange([id]);
    }
  }

  return (
    <div>
      <p className="vue-stem">{question.stem}</p>
      {multi && (
        <p style={{ fontSize: 12, color: "#444", marginTop: -8, marginBottom: 12 }}>
          (Select all that apply — {question.answer.length} correct)
        </p>
      )}
      <div>
        {question.choices.map((c) => (
          <label
            key={c.id}
            className="vue-choice"
            data-selected={selected.includes(c.id)}
          >
            <input
              type={multi ? "checkbox" : "radio"}
              name={question.id}
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            <span>
              <strong style={{ marginRight: 8 }}>{c.id}.</strong>
              {c.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
