"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductHeader } from "@/components/ProductHeader";
import { DOMAIN_META } from "@/lib/domains";
import { QUESTION_BANK } from "@/lib/questions";
import { loadAttempt } from "@/lib/storage";
import type { DomainId } from "@/lib/types";

export default function SecurityPlusLobbyPage() {
  const router = useRouter();
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const a = loadAttempt();
    setHasResume(!!a && !a.finishedAt);
    const params = new URLSearchParams(window.location.search);
    const drill = params.get("drill");
    if (drill && ["1", "2", "3", "4", "5"].includes(drill)) {
      sessionStorage.setItem("sy0701_pending", `drill-${drill}`);
      router.replace("/pre-exam");
    }
  }, [router]);

  function beginFull() {
    sessionStorage.setItem("sy0701_pending", "full");
    router.push("/pre-exam");
  }

  function beginQuick() {
    sessionStorage.setItem("sy0701_pending", "quick");
    router.push("/pre-exam");
  }

  function beginPractice() {
    sessionStorage.setItem("sy0701_pending", "practice");
    router.push("/pre-exam");
  }

  function beginDrill(domain: DomainId) {
    sessionStorage.setItem("sy0701_pending", `drill-${domain}`);
    router.push("/pre-exam");
  }

  const mcq = QUESTION_BANK.filter((q) => q.type.startsWith("mcq")).length;
  const pbq = QUESTION_BANK.filter((q) => q.type.startsWith("pbq")).length;

  return (
    <div className="lobby-shell">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Unofficial Practice Simulator"
        title="Security+"
        subtitle="SY0-701 timed exam practice with MCQs and PBQ simulations — Pearson VUE–style delivery."
        background="linear-gradient(135deg, #1a2332 0%, #1f4b7a 55%, #2a5f8f 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {hasResume && (
          <div className="panel p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold">Resume in-progress attempt</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Your previous session is still saved in this browser.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => router.push("/exam")}
            >
              Resume Exam
            </button>
          </div>
        )}

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel p-6 space-y-4">
            <h2 className="text-lg font-semibold">Full Exam</h2>
            <ul className="text-sm space-y-1" style={{ color: "var(--muted)" }}>
              <li>~90 items · 90 min</li>
              <li>PBQs + domain mix</li>
            </ul>
            <button type="button" className="btn btn-primary" onClick={beginFull}>
              Start Full Exam
            </button>
          </div>
          <div className="panel p-6 space-y-4">
            <h2 className="text-lg font-semibold">Quick Quiz</h2>
            <ul className="text-sm space-y-1" style={{ color: "var(--muted)" }}>
              <li>20 MCQs · 25 min</li>
              <li>Same chrome, no instant reveal</li>
            </ul>
            <button type="button" className="btn btn-primary" onClick={beginQuick}>
              Start Quick Quiz
            </button>
          </div>
          <div className="panel p-6 space-y-4">
            <h2 className="text-lg font-semibold">Instant Practice</h2>
            <ul className="text-sm space-y-1" style={{ color: "var(--muted)" }}>
              <li>20 MCQs · check each answer</li>
              <li>Misses saved to notebook</li>
            </ul>
            <button type="button" className="btn btn-primary" onClick={beginPractice}>
              Start Practice
            </button>
          </div>
          <div className="panel p-6 space-y-3">
            <h2 className="text-lg font-semibold">Question bank</h2>
            <p className="text-3xl font-semibold tabular-nums">
              {mcq + pbq}
              <span
                className="text-base font-normal ml-2"
                style={{ color: "var(--muted)" }}
              >
                items
              </span>
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {mcq} MCQs · {pbq} PBQs
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/notebook" className="btn inline-flex text-sm">
                Notebook →
              </Link>
              <Link href="/cram" className="btn inline-flex text-sm">
                Cram →
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Domain drills (20 items · 25 min)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {([1, 2, 3, 4, 5] as DomainId[]).map((d) => (
              <button
                key={d}
                type="button"
                className="panel p-4 text-left hover:bg-white transition-colors"
                onClick={() => beginDrill(d)}
              >
                <div
                  className="text-xs font-mono mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  Domain {d}.0 · {Math.round(DOMAIN_META[d].weight * 100)}%
                </div>
                <div className="font-medium text-sm">{DOMAIN_META[d].name}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="text-xs space-y-1" style={{ color: "var(--muted)" }}>
          <p>
            Scoring note: scaled scores use a linear map from percent correct to the
            100–900 range. CompTIA&apos;s live algorithm is proprietary and may differ.
          </p>
          <p>
            Tip: On the real exam, skip time-consuming PBQs early, finish MCQs, then
            return — this simulator supports the same workflow.
          </p>
        </section>
      </main>
    </div>
  );
}
