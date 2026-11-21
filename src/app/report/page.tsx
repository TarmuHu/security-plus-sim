"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { buildCoachActions, formatCorrectAnswer } from "@/lib/coach";
import { DOMAIN_META } from "@/lib/domains";
import { getQuestionsByIds } from "@/lib/questions";
import { loadReport } from "@/lib/storage";
import type { Question, ScoreReport } from "@/lib/types";

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    const r = loadReport();
    setReport(r);
    if (!r) return;
    try {
      const fromSession = sessionStorage.getItem("sy0701_last_question_ids");
      const ids = fromSession
        ? (JSON.parse(fromSession) as string[])
        : r.itemResults.map((i) => i.questionId);
      setQuestions(getQuestionsByIds(ids));
      const missed = sessionStorage.getItem("sy0701_missed_ids");
      if (missed) setMissedCount((JSON.parse(missed) as string[]).length);
      else setMissedCount(r.itemResults.filter((i) => !i.correct).length);
    } catch {
      setQuestions([]);
    }
  }, []);

  const byId = useMemo(
    () => new Map(questions.map((q) => [q.id, q])),
    [questions]
  );

  const coach = useMemo(
    () => (report ? buildCoachActions(report) : []),
    [report]
  );

  function retryMissed() {
    sessionStorage.setItem("sy0701_pending", "missed");
    router.push("/pre-exam");
  }

  if (!report) {
    return (
      <div className="vue-exam items-center justify-center p-6">
        <div className="vue-content" style={{ maxWidth: 420, margin: "40px auto" }}>
          <p>No score report found.</p>
          <Link
            href="/security-plus"
            className="vue-btn vue-btn-primary inline-flex mt-3"
          >
            Back to lobby
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vue-exam">
      <div className="vue-info">
        <div>
          <div className="vue-info-title">Examination Score Report</div>
          <div className="vue-info-meta">
            Practice Simulator · Not an official CompTIA result
          </div>
        </div>
      </div>

      <div className="vue-body">
        <div className="vue-content" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>
                {report.passed ? "PASS" : "FAIL"}
              </h1>
              <p style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
                Practice scaled estimate (pass at 750). Raw:{" "}
                {report.rawPercent ??
                  Math.round(
                    (report.rawCorrect / Math.max(report.rawTotal, 1)) * 100
                  )}
                % ({report.rawCorrect}/{report.rawTotal})
                {report.weightedPossible != null && (
                  <>
                    {" "}
                    · Weighted: {report.weightedEarned}/{report.weightedPossible}{" "}
                    pts
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: "Consolas, monospace",
                  color: report.passed ? "var(--ok)" : "var(--bad)",
                }}
              >
                {report.scaledScore}
              </div>
              <div style={{ fontSize: 13, color: "#444" }}>
                {report.passed ? "Pass estimate" : "Below 750 estimate"}
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              color: "#555",
              marginBottom: 20,
              padding: 10,
              border: "1px solid #ccc",
              background: "#f8f8f8",
            }}
          >
            {report.scoringModel ??
              "Practice scoring only — not CompTIA’s proprietary scaled algorithm."}
          </p>

          <h2 style={{ fontSize: 15, marginBottom: 10 }}>Domain performance</h2>
          <div style={{ marginBottom: 20 }}>
            {report.domainScores.map((d) => (
              <div key={d.domain} style={{ marginBottom: 10 }}>
                <div
                  className="flex justify-between"
                  style={{ fontSize: 13, marginBottom: 4 }}
                >
                  <span>
                    {d.domain}.0 {DOMAIN_META[d.domain].name}
                  </span>
                  <span style={{ fontFamily: "Consolas, monospace" }}>
                    {d.correct}/{d.total} ({d.percent}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 12,
                    background: "#fff",
                    border: "1px solid #666",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${d.percent}%`,
                      background: d.percent >= 75 ? "#4a7" : "#4a7ab0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 15, marginBottom: 10 }}>What to do next</h2>
          <div
            style={{
              border: "1px solid #999",
              background: "#f7fafc",
              padding: 12,
              marginBottom: 20,
            }}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                className="vue-btn vue-btn-primary"
                disabled={missedCount === 0}
                onClick={retryMissed}
              >
                Retry missed ({missedCount})
              </button>
              <Link href="/notebook" className="vue-btn">
                Open notebook
              </Link>
              <Link href="/security-plus" className="vue-btn">
                Quick quiz / drills
              </Link>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
              {coach.map((a) => (
                <li key={a.href} style={{ marginBottom: 6 }}>
                  <Link href={a.href} style={{ fontWeight: 600 }}>
                    {a.label}
                  </Link>
                  <span style={{ color: "#555" }}> — {a.reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 style={{ fontSize: 15, marginBottom: 10 }}>Item review</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {report.itemResults.map((item, idx) => {
              const q = byId.get(item.questionId);
              const key = q ? formatCorrectAnswer(q) : null;
              return (
                <details
                  key={item.questionId}
                  style={{ border: "1px solid #999", background: "#fafafa" }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      padding: "10px 12px",
                      fontSize: 13,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <strong style={{ marginRight: 8 }}>#{idx + 1}</strong>
                      {q?.stem.slice(0, 100) ?? item.questionId}
                      {(q?.stem.length ?? 0) > 100 ? "…" : ""}
                    </span>
                    <span
                      style={{
                        fontFamily: "Consolas, monospace",
                        fontSize: 12,
                        padding: "2px 6px",
                        border: "1px solid #999",
                        background: item.correct
                          ? "#e8f5e9"
                          : (item.credit ?? 0) > 0
                            ? "#fff8e1"
                            : "#fdecea",
                      }}
                    >
                      {item.correct
                        ? "Correct"
                        : (item.credit ?? 0) > 0
                          ? `Partial ${Math.round((item.credit ?? 0) * 100)}%`
                          : "Incorrect"}{" "}
                      · Obj {item.objective}
                    </span>
                  </summary>
                  {q && (
                    <div
                      style={{
                        padding: "10px 12px 14px",
                        borderTop: "1px solid #ccc",
                        fontSize: 13,
                        background: "#fff",
                      }}
                    >
                      <p style={{ whiteSpace: "pre-wrap" }}>{q.stem}</p>
                      {key && (
                        <p>
                          <strong>Correct: </strong>
                          {key}
                        </p>
                      )}
                      <p>
                        <strong>Explanation: </strong>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </div>
      </div>

      <div className="vue-nav" style={{ gap: 8 }}>
        <div />
        <div className="flex gap-2">
          <Link href="/security-plus" className="vue-btn vue-btn-primary">
            Return to Lobby
          </Link>
          <Link href="/certs/security-plus" className="vue-btn">
            Security+ products
          </Link>
          <Link href="/" className="vue-btn">
            All certifications
          </Link>
        </div>
      </div>
    </div>
  );
}
