"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { assembleExam, assemblePbqLab, createAttempt, PBQ_LAB_BLUEPRINT } from "@/lib/assemble";
import { DOMAIN_META, FULL_EXAM_BLUEPRINT, drillBlueprint, missedRetryBlueprint, QUICK_QUIZ_BLUEPRINT, PRACTICE_BLUEPRINT } from "@/lib/domains";
import { QUESTION_BANK, getQuestionsByIds } from "@/lib/questions";
import { buildScoreReport, isAnswered, scoreQuestion } from "@/lib/scoring";
import { formatCorrectAnswer } from "@/lib/coach";
import { recordMisses } from "@/lib/notebook";
import {
  clearAttempt,
  loadAttempt,
  saveAttempt,
  saveReport,
} from "@/lib/storage";
import type { Attempt, DomainId, Question, ResponseValue } from "@/lib/types";
import { Calculator } from "./Calculator";
import { QuestionRenderer } from "./QuestionRenderer";
import { ScenarioWindow } from "./ScenarioWindow";
import { Timer } from "./Timer";

function scenarioOf(q: Question): string | null {
  if (
    q.type === "pbq_match" ||
    q.type === "pbq_firewall" ||
    q.type === "pbq_log_triage" ||
    q.type === "pbq_sequence" ||
    q.type === "pbq_topology"
  ) {
    return q.scenario;
  }
  return null;
}

export function ExamClient({ mode }: { mode: "exam" | "review" }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [timerHidden, setTimerHidden] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(true);

  useEffect(() => {
    const existing = loadAttempt();
    if (!existing) {
      router.replace("/security-plus");
      return;
    }
    setAttempt(existing);
  }, [router]);

  const questions = useMemo(() => {
    if (!attempt) return [];
    return getQuestionsByIds(attempt.questionIds);
  }, [attempt]);

  const persist = useCallback((next: Attempt) => {
    setAttempt(next);
    saveAttempt(next);
  }, []);

  const finish = useCallback(() => {
    if (!attempt) return;
    const report = buildScoreReport(
      attempt.id,
      questions,
      attempt.responses,
      FULL_EXAM_BLUEPRINT.passScaled,
      FULL_EXAM_BLUEPRINT.maxScaled
    );
    sessionStorage.setItem(
      "sy0701_last_responses",
      JSON.stringify(attempt.responses)
    );
    sessionStorage.setItem(
      "sy0701_last_question_ids",
      JSON.stringify(attempt.questionIds)
    );
    const missed = report.itemResults
      .filter((i) => (i.credit ?? (i.correct ? 1 : 0)) < 0.999)
      .map((i) => i.questionId);
    sessionStorage.setItem("sy0701_missed_ids", JSON.stringify(missed));
    recordMisses(
      report.itemResults.map((i) => ({
        questionId: i.questionId,
        domain: i.domain,
        objective: i.objective,
        credit: i.credit ?? (i.correct ? 1 : 0),
      }))
    );
    saveReport(report);
    clearAttempt();
    router.push("/report");
  }, [attempt, questions, router]);

  const q = attempt ? questions[attempt.currentIndex] : null;

  useEffect(() => {
    setScenarioOpen(true);
  }, [q?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!attempt || mode !== "exam") return;
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        const next = Math.min(
          attempt.currentIndex + 1,
          attempt.questionIds.length - 1
        );
        if (next === attempt.currentIndex) router.push("/review");
        else persist({ ...attempt, currentIndex: next });
      }
      if (e.altKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        persist({
          ...attempt,
          currentIndex: Math.max(attempt.currentIndex - 1, 0),
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [attempt, mode, persist, router]);

  if (!attempt || questions.length === 0 || !q) {
    return (
      <div className="vue-exam items-center justify-center p-8">
        <p>Loading exam session…</p>
      </div>
    );
  }

  const session = attempt;
  const item = q;

  const flagged = !!session.flags[item.id];
  const answeredCount = session.questionIds.filter((id) =>
    isAnswered(session.responses[id])
  ).length;
  const incomplete = session.questionIds.length - answeredCount;
  const flaggedCount = Object.values(session.flags).filter(Boolean).length;
  const progressPct = Math.round(
    (answeredCount / session.questionIds.length) * 100
  );
  const scenario = scenarioOf(item);
  const isPbq = item.type.startsWith("pbq_");
  const practice = !!session.practiceMode;
  const revealed = !!session.revealed?.[item.id];
  const credit = revealed
    ? scoreQuestion(item, session.responses[item.id])
    : null;

  function setResponse(v: ResponseValue) {
    persist({
      ...session,
      responses: { ...session.responses, [item.id]: v },
      // changing answer hides prior reveal so they can re-check
      revealed: practice
        ? { ...session.revealed, [item.id]: false }
        : session.revealed,
    });
  }

  function revealFeedback() {
    if (!isAnswered(session.responses[item.id])) return;
    const c = scoreQuestion(item, session.responses[item.id]);
    persist({
      ...session,
      revealed: { ...session.revealed, [item.id]: true },
    });
    recordMisses([
      {
        questionId: item.id,
        domain: item.domain,
        objective: item.objective,
        credit: c,
      },
    ]);
  }

  function go(delta: number) {
    const next = Math.min(
      Math.max(session.currentIndex + delta, 0),
      session.questionIds.length - 1
    );
    persist({ ...session, currentIndex: next });
  }

  function jumpFirst(predicate: (id: string, i: number) => boolean) {
    const idx = session.questionIds.findIndex((id, i) => predicate(id, i));
    if (idx >= 0) {
      persist({ ...session, currentIndex: idx });
      router.push("/exam");
    }
  }

  const infoBar = (
    <div className="vue-info">
      <div>
        <div className="vue-info-title">CompTIA Security+ Practice Exam</div>
        <div className="vue-info-meta">
          Item {session.currentIndex + 1} of {session.questionIds.length}
          {isPbq ? "  |  Performance-Based Question" : ""}
          {practice ? "  |  Practice (instant feedback)" : ""}
        </div>
      </div>
      <div className="vue-progress" title={`${progressPct}% answered`}>
        <span style={{ width: `${progressPct}%` }} />
      </div>
      <Timer
        endsAt={session.endsAt}
        onExpire={finish}
        hidden={timerHidden}
        onToggleHide={() => setTimerHidden((h) => !h)}
      />
    </div>
  );

  if (mode === "review") {
    return (
      <div className="vue-exam">
        {infoBar}
        <div className="vue-body">
          <div className="vue-content">
            <h1 style={{ fontSize: 18, margin: "0 0 8px" }}>Item Review</h1>
            <p style={{ fontSize: 13, marginBottom: 16, color: "#333" }}>
              Select an item number to return to that question. Flagged items show a
              marker. When finished reviewing, select <strong>End Review</strong>.
            </p>
            <div className="vue-review-grid mb-4">
              {session.questionIds.map((id, i) => {
                const answered = isAnswered(session.responses[id]);
                const isFlag = !!session.flags[id];
                return (
                  <button
                    key={id}
                    type="button"
                    className="vue-review-cell"
                    data-answered={answered}
                    data-incomplete={!answered}
                    data-flagged={isFlag}
                    data-current={i === session.currentIndex}
                    onClick={() => {
                      persist({ ...session, currentIndex: i });
                      router.push("/exam");
                    }}
                  >
                    {i + 1}
                    {isFlag ? " ▮" : ""}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#444" }}>
              Answered: {answeredCount} &nbsp;|&nbsp; Incomplete: {incomplete}{" "}
              &nbsp;|&nbsp; Flagged: {flaggedCount}
            </p>
          </div>
        </div>
        <div className="vue-nav">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="vue-btn"
              onClick={() => jumpFirst(() => true)}
            >
              Review All
            </button>
            <button
              type="button"
              className="vue-btn"
              onClick={() =>
                jumpFirst((id) => !isAnswered(session.responses[id]))
              }
              disabled={incomplete === 0}
            >
              Review Incomplete
            </button>
            <button
              type="button"
              className="vue-btn"
              onClick={() => jumpFirst((id) => !!session.flags[id])}
              disabled={flaggedCount === 0}
            >
              Review Flagged
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="vue-btn"
              onClick={() => router.push("/exam")}
            >
              Return to Exam
            </button>
            <button
              type="button"
              className="vue-btn vue-btn-danger"
              onClick={() => setConfirmEnd(true)}
            >
              End Review
            </button>
          </div>
        </div>
        {confirmEnd && (
          <ConfirmEnd
            unanswered={incomplete}
            flagged={flaggedCount}
            onCancel={() => setConfirmEnd(false)}
            onConfirm={finish}
          />
        )}
      </div>
    );
  }

  return (
    <div className="vue-exam">
      {infoBar}
      <div className="vue-body">
        <div className="vue-content">
          <div className="vue-item-head">
            <div className="vue-info-meta">
              {isPbq
                ? "Complete the simulation. You may skip and return later; your work is saved."
                : multiHint(item)}
            </div>
            <label className="vue-flag-check">
              <input
                type="checkbox"
                checked={flagged}
                onChange={() =>
                  persist({
                    ...session,
                    flags: { ...session.flags, [item.id]: !flagged },
                  })
                }
              />
              Flag for Review
            </label>
          </div>

          <QuestionRenderer
            question={item}
            value={session.responses[item.id]}
            onChange={setResponse}
            hideScenario
          />

          {practice && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                border: "1px solid #404040",
                background: revealed
                  ? credit !== null && credit >= 0.999
                    ? "#e8f5e9"
                    : credit !== null && credit > 0
                      ? "#fff8e1"
                      : "#fdecea"
                  : "#f5f5f5",
              }}
            >
              {!revealed ? (
                <button
                  type="button"
                  className="vue-btn vue-btn-primary"
                  disabled={!isAnswered(session.responses[item.id])}
                  onClick={revealFeedback}
                >
                  Check Answer
                </button>
              ) : (
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {credit !== null && credit >= 0.999
                      ? "Correct"
                      : credit !== null && credit > 0
                        ? `Partial credit (${Math.round(credit * 100)}%)`
                        : "Incorrect"}
                  </div>
                  {formatCorrectAnswer(item) && (
                    <p style={{ margin: "0 0 8px" }}>
                      <strong>Answer:</strong> {formatCorrectAnswer(item)}
                    </p>
                  )}
                  <p style={{ margin: 0 }}>
                    <strong>Explanation:</strong> {item.explanation}
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#555" }}>
                    Objective {item.objective} · {item.difficulty}
                  </p>
                </div>
              )}
            </div>
          )}

          {scenario && (
            <ScenarioWindow
              title={isPbq ? "Exhibit / Scenario" : "Scenario"}
              body={scenario}
              open={scenarioOpen}
              onClose={() => setScenarioOpen(false)}
            />
          )}
        </div>
      </div>

      <div className="vue-nav">
        <div className="flex flex-wrap gap-2 relative">
          <button
            type="button"
            className="vue-btn vue-btn-flag"
            data-on={flagged}
            onClick={() =>
              persist({
                ...session,
                flags: { ...session.flags, [item.id]: !flagged },
              })
            }
          >
            {flagged ? "Unflag" : "Flag for Review"}
          </button>
          {scenario && (
            <button
              type="button"
              className="vue-btn"
              onClick={() => setScenarioOpen(true)}
            >
              Exhibit
            </button>
          )}
          <button
            type="button"
            className="vue-btn"
            onClick={() => setToolsOpen((o) => !o)}
          >
            Tools
          </button>
          {toolsOpen && (
            <div
              style={{
                position: "absolute",
                bottom: "110%",
                left: 0,
                background: "#fff",
                border: "1px solid #404040",
                boxShadow: "2px 2px 8px rgba(0,0,0,.25)",
                zIndex: 50,
                minWidth: 160,
              }}
            >
              <button
                type="button"
                className="vue-btn"
                style={{
                  width: "100%",
                  border: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setCalcOpen(true);
                  setToolsOpen(false);
                }}
              >
                Calculator
              </button>
              <button
                type="button"
                className="vue-btn"
                style={{
                  width: "100%",
                  border: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setToolsOpen(false);
                  alert(
                    "Practice simulator help:\n\n• Alt+N Next · Alt+P Previous\n• Flag items to revisit\n• Close Exhibit if it covers the PBQ workspace\n• Item Review → End Review to score"
                  );
                }}
              >
                Help
              </button>
            </div>
          )}
          <button
            type="button"
            className="vue-btn"
            onClick={() => router.push("/review")}
          >
            Review
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="vue-btn"
            disabled={session.currentIndex === 0}
            onClick={() => go(-1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="vue-btn vue-btn-primary"
            onClick={() => {
              if (session.currentIndex >= session.questionIds.length - 1) {
                router.push("/review");
              } else {
                go(1);
              }
            }}
          >
            {session.currentIndex >= session.questionIds.length - 1
              ? "Item Review"
              : "Next"}
          </button>
        </div>
      </div>

      <Calculator open={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  );
}

function multiHint(q: Question): string {
  if (q.type === "mcq_multi") {
    return `Select ${q.answer.length} options.`;
  }
  return "Select the best answer.";
}

function ConfirmEnd({
  unanswered,
  flagged,
  onCancel,
  onConfirm,
}: {
  unanswered: number;
  flagged: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="vue-modal-backdrop">
      <div className="vue-modal">
        <div className="vue-modal-title">End Review</div>
        <div className="vue-modal-body">
          <p style={{ marginTop: 0 }}>
            You are about to end the exam. You will not be able to return and change
            answers.
          </p>
          <ul style={{ margin: "8px 0", paddingLeft: 18 }}>
            <li>Incomplete items: {unanswered}</li>
            <li>Flagged items: {flagged}</li>
          </ul>
          <p style={{ marginBottom: 0 }}>Do you want to end the exam now?</p>
        </div>
        <div className="vue-modal-actions">
          <button type="button" className="vue-btn" onClick={onCancel}>
            No, return to review
          </button>
          <button type="button" className="vue-btn vue-btn-danger" onClick={onConfirm}>
            Yes, end exam
          </button>
        </div>
      </div>
    </div>
  );
}

export function startFullExam(): Attempt {
  const ids = assembleExam(QUESTION_BANK, FULL_EXAM_BLUEPRINT);
  const attempt = createAttempt(ids, FULL_EXAM_BLUEPRINT);
  saveAttempt(attempt);
  return attempt;
}

export function startDomainDrill(domain: DomainId): Attempt {
  const bp = drillBlueprint(domain);
  const ids = assembleExam(QUESTION_BANK, bp);
  const attempt = createAttempt(ids, bp);
  saveAttempt(attempt);
  return attempt;
}

export function startPbqLab(): Attempt {
  const ids = assemblePbqLab(QUESTION_BANK, 6);
  const attempt = createAttempt(ids, {
    ...PBQ_LAB_BLUEPRINT,
    itemCount: ids.length,
  });
  saveAttempt(attempt);
  return attempt;
}

export function startQuickQuiz(): Attempt {
  const ids = assembleExam(QUESTION_BANK, QUICK_QUIZ_BLUEPRINT);
  const attempt = createAttempt(ids, QUICK_QUIZ_BLUEPRINT);
  saveAttempt(attempt);
  return attempt;
}

export function startPracticeQuiz(): Attempt {
  const ids = assembleExam(QUESTION_BANK, PRACTICE_BLUEPRINT);
  const attempt = createAttempt(ids, PRACTICE_BLUEPRINT, { practiceMode: true });
  saveAttempt(attempt);
  return attempt;
}

export function startMissedRetry(ids: string[]): Attempt | null {
  if (ids.length === 0) return null;
  const bp = missedRetryBlueprint(ids.length);
  const attempt = createAttempt(ids, bp);
  saveAttempt(attempt);
  return attempt;
}

export function startNotebookRetry(ids: string[]): Attempt | null {
  const valid = ids.filter((id) => QUESTION_BANK.some((q) => q.id === id));
  if (valid.length === 0) return null;
  const bp = {
    ...missedRetryBlueprint(Math.min(valid.length, 30)),
    id: "sy0-701-notebook",
    title: "Wrong-Answer Notebook",
  };
  const attempt = createAttempt(valid.slice(0, 30), bp, { practiceMode: true });
  saveAttempt(attempt);
  return attempt;
}

export { DOMAIN_META };
