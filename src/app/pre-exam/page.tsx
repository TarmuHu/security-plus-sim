"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  startDomainDrill,
  startFullExam,
  startMissedRetry,
  startNotebookRetry,
  startPbqLab,
  startPracticeQuiz,
  startQuickQuiz,
} from "@/components/ExamClient";
import { notebookIds } from "@/lib/notebook";
import type { DomainId } from "@/lib/types";

export default function PreExamPage() {
  const router = useRouter();
  const [step, setStep] = useState<"nda" | "tutorial">("nda");
  const [accepted, setAccepted] = useState(false);

  function launch() {
    const pending = sessionStorage.getItem("sy0701_pending") ?? "full";
    if (pending === "pbq") {
      startPbqLab();
    } else if (pending === "quick") {
      startQuickQuiz();
    } else if (pending === "practice") {
      startPracticeQuiz();
    } else if (pending === "notebook") {
      const ids = notebookIds();
      if (!startNotebookRetry(ids)) {
        router.push("/notebook");
        return;
      }
    } else if (pending === "missed") {
      const raw = sessionStorage.getItem("sy0701_missed_ids");
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      if (!startMissedRetry(ids)) {
        router.push("/security-plus");
        return;
      }
    } else if (pending.startsWith("drill-")) {
      const domain = Number(pending.split("-")[1]) as DomainId;
      startDomainDrill(domain);
    } else {
      startFullExam();
    }
    router.push("/exam");
  }

  return (
    <div className="vue-exam">
      <div className="vue-info">
        <div>
          <div className="vue-info-title">
            {step === "nda" ? "Non-Disclosure Agreement" : "Exam Tutorial"}
          </div>
          <div className="vue-info-meta">Security+ SY0-701 Practice Delivery</div>
        </div>
      </div>

      <div className="vue-body">
        <div className="vue-content" style={{ maxWidth: 760, margin: "0 auto" }}>
          {step === "nda" ? (
            <>
              <p className="vue-stem" style={{ fontSize: 14 }}>
                Please read the following agreement carefully. You must accept before
                continuing.
              </p>
              <div
                style={{
                  border: "1px solid #666",
                  background: "#fafafa",
                  padding: 12,
                  height: 280,
                  overflow: "auto",
                  fontSize: 13,
                  lineHeight: 1.45,
                  marginBottom: 14,
                }}
              >
                <p>
                  <strong>PRACTICE SIMULATOR NOTICE</strong> — This application is an
                  unofficial practice tool modeled after computer-based testing delivery.
                  It is <strong>not affiliated with CompTIA or Pearson VUE</strong>.
                </p>
                <p>
                  By continuing, you acknowledge that all practice items are original and
                  aligned to publicly available exam objectives. Reproduction or use of
                  live exam content (braindumps) is prohibited by CompTIA policies and
                  professional ethics.
                </p>
                <p>
                  During the timed session you may navigate freely, flag items for review,
                  and use available tools. When time expires, unanswered items are scored
                  as incorrect. Ending the exam from Item Review submits your attempt.
                </p>
                <p>
                  Responses are stored only in this browser&apos;s local storage. Scaled
                  scores use a public-aligned practice model (100–900, pass 750;
                  PBQs weighted higher; partial credit on PBQs/multi-select). CompTIA’s
                  live IRT/equating formula is confidential and cannot be reproduced.
                  and are not CompTIA official scores.
                </p>
                <p>
                  Click the checkbox below to indicate that you have read and agree to
                  these terms, then select Next.
                </p>
              </div>
              <label className="vue-flag-check" style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                I have read and understand this agreement.
              </label>
            </>
          ) : (
            <>
              <p className="vue-stem" style={{ fontSize: 14 }}>
                This short tutorial explains the testing interface you will use.
              </p>
              <ol style={{ fontSize: 13, lineHeight: 1.55, paddingLeft: 20 }}>
                <li>
                  <strong>Information pane (top)</strong> — shows item number, progress,
                  and Time Remaining. Click the clock icon to hide/show the timer.
                </li>
                <li>
                  <strong>Content pane (center)</strong> — question text and response
                  area. For PBQs, an <em>Exhibit / Scenario</em> window may open on top;
                  drag or close it if it covers the workspace, then reopen via{" "}
                  <strong>Exhibit</strong>.
                </li>
                <li>
                  <strong>Flag for Review</strong> — mark items to revisit from Item
                  Review.
                </li>
                <li>
                  <strong>Navigation (bottom)</strong> — Previous / Next (also Alt+P /
                  Alt+N). Review opens the Item Review screen. Tools includes Calculator.
                </li>
                <li>
                  <strong>Item Review</strong> — Review All, Review Incomplete, or Review
                  Flagged. <strong>End Review</strong> scores the exam permanently.
                </li>
                <li>
                  <strong>Instant Practice</strong> — if you started Practice mode,
                  use <strong>Check Answer</strong> on each item for immediate
                  feedback. Misses are saved to your Wrong-Answer Notebook.
                </li>
              </ol>
              <p style={{ fontSize: 12, color: "#444", marginTop: 16 }}>
                Tip: On the live exam, many candidates skip PBQs first, finish MCQs, then
                return — this simulator supports the same workflow.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="vue-nav">
        <button
          type="button"
          className="vue-btn"
          onClick={() => router.push("/security-plus")}
        >
          Exit
        </button>
        <div className="flex gap-2">
          {step === "tutorial" && (
            <button type="button" className="vue-btn" onClick={() => setStep("nda")}>
              Previous
            </button>
          )}
          {step === "nda" ? (
            <button
              type="button"
              className="vue-btn vue-btn-primary"
              disabled={!accepted}
              onClick={() => setStep("tutorial")}
            >
              Next
            </button>
          ) : (
            <button type="button" className="vue-btn vue-btn-primary" onClick={launch}>
              Start Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
