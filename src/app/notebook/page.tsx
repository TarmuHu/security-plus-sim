"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductHeader } from "@/components/ProductHeader";
import { DOMAIN_META } from "@/lib/domains";
import {
  clearNotebook,
  loadNotebook,
  notebookIds,
  type NotebookEntry,
  type WrongNotebook,
} from "@/lib/notebook";
import { QUESTION_BANK } from "@/lib/questions";
import type { DomainId } from "@/lib/types";

export default function NotebookPage() {
  const router = useRouter();
  const [nb, setNb] = useState<WrongNotebook>({ updatedAt: 0, entries: {} });

  useEffect(() => {
    setNb(loadNotebook());
  }, []);

  const entries = useMemo(() => {
    return Object.values(nb.entries).sort(
      (a, b) => b.misses - a.misses || b.lastMissedAt - a.lastMissedAt
    );
  }, [nb]);

  const byId = useMemo(
    () => Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q])),
    []
  );

  function refresh() {
    setNb(loadNotebook());
  }

  function beginRetry() {
    const ids = notebookIds(nb);
    if (ids.length === 0) return;
    sessionStorage.setItem("sy0701_pending", "notebook");
    router.push("/pre-exam");
  }

  function onClear() {
    if (!confirm("Clear the entire wrong-answer notebook?")) return;
    clearNotebook();
    refresh();
  }

  function domainCount(d: DomainId) {
    return entries.filter((e) => e.domain === d).length;
  }

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Spaced review"
        title="Wrong-Answer Notebook"
        subtitle="Misses from practice and exams stay here across sessions until you answer them correctly."
        background="linear-gradient(135deg, #7f1d1d 0%, #b91c1c 55%, #dc2626 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <section className="panel p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tabular-nums">
              {entries.length}
              <span
                className="text-base font-normal ml-2"
                style={{ color: "var(--muted)" }}
              >
                open items
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {nb.updatedAt
                ? `Last updated ${new Date(nb.updatedAt).toLocaleString()}`
                : "No misses recorded yet — use Instant Practice or finish an exam."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={entries.length === 0}
              onClick={beginRetry}
            >
              Retry notebook (practice)
            </button>
            <button
              type="button"
              className="btn"
              disabled={entries.length === 0}
              onClick={onClear}
            >
              Clear all
            </button>
            <Link href="/security-plus" className="btn inline-flex">
              Exam lobby
            </Link>
          </div>
        </section>

        {entries.length > 0 && (
          <section className="grid sm:grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as DomainId[]).map((d) => (
              <div key={d} className="panel p-3 text-center">
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  D{d}
                </div>
                <div className="text-lg font-semibold tabular-nums">
                  {domainCount(d)}
                </div>
              </div>
            ))}
          </section>
        )}

        {entries.length === 0 ? (
          <section className="panel p-8 text-center space-y-3">
            <p className="font-medium">Notebook is empty</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Start Instant Practice from the exam lobby. Incorrect or partial
              answers are saved here automatically.
            </p>
            <Link href="/security-plus" className="btn btn-primary inline-flex">
              Go to exam lobby
            </Link>
          </section>
        ) : (
          <section className="space-y-3">
            {entries.map((e) => (
              <NotebookRow key={e.questionId} entry={e} stem={byId[e.questionId]?.stem} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function NotebookRow({
  entry,
  stem,
}: {
  entry: NotebookEntry;
  stem?: string;
}) {
  return (
    <div className="panel p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {entry.questionId} · Obj {entry.objective} ·{" "}
          {DOMAIN_META[entry.domain].name}
        </div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          Missed {entry.misses}× · last credit {Math.round(entry.lastCredit * 100)}%
        </div>
      </div>
      <p className="text-sm mt-2 m-0 line-clamp-2">
        {stem ?? "(Question not found in bank — may have been removed.)"}
      </p>
    </div>
  );
}
