"use client";

import { isAnswered } from "@/lib/scoring";
import type { ResponseValue } from "@/lib/types";

export function QuestionNavigator({
  count,
  currentIndex,
  responses,
  flags,
  questionIds,
  onJump,
}: {
  count: number;
  currentIndex: number;
  responses: Record<string, ResponseValue>;
  flags: Record<string, boolean>;
  questionIds: string[];
  onJump: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: count }, (_, i) => {
        const id = questionIds[i];
        const answered = isAnswered(responses[id]);
        const flagged = !!flags[id];
        const current = i === currentIndex;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onJump(i)}
            title={`Item ${i + 1}${flagged ? " (flagged)" : ""}${answered ? " (answered)" : ""}`}
            className="h-8 text-xs border"
            style={{
              borderColor: current ? "var(--accent)" : "var(--line)",
              background: current
                ? "#dbeafe"
                : flagged
                  ? "#ffedd5"
                  : answered
                    ? "#dcfce7"
                    : "#fff",
              fontWeight: current ? 600 : 400,
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
