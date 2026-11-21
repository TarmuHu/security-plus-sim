"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCardsForPack, getPack, hitLabel } from "@/lib/cram";
import { DOMAIN_META } from "@/lib/domains";

export default function CramSessionPage() {
  const params = useParams();
  const router = useRouter();
  const packId = String(params.packId ?? "");
  const pack = getPack(packId);
  const cards = useMemo(
    () => (pack ? getCardsForPack(pack) : []),
    [pack]
  );

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const durationMs = (pack?.durationMin ?? 30) * 60 * 1000;
  const remaining = Math.max(0, durationMs - (now - startedAt));

  useEffect(() => {
    if (remaining === 0) setDone(true);
  }, [remaining]);

  if (!pack || cards.length === 0) {
    return (
      <div className="lobby-shell p-8">
        <p>Pack not found.</p>
        <Link href="/cram">Back</Link>
      </div>
    );
  }

  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const card = cards[Math.min(index, cards.length - 1)];
  const knownCount = Object.values(known).filter(Boolean).length;

  function mark(solid: boolean) {
    setKnown((k) => ({ ...k, [card.id]: solid }));
    setFlipped(false);
    if (index >= cards.length - 1) setDone(true);
    else setIndex((i) => i + 1);
  }

  if (done) {
    const weak = cards.filter((c) => known[c.id] === false);
    const unseen = cards.filter((c) => known[c.id] == null);
    return (
      <div className="lobby-shell min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-12 space-y-6">
          <h1 className="text-3xl font-semibold">Session complete</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {pack.title} · marked solid: {knownCount}/{cards.length}
          </p>
          {(weak.length > 0 || unseen.length > 0) && (
            <div className="panel p-4 space-y-2">
              <h2 className="font-semibold text-sm">Revisit these</h2>
              {[...weak, ...unseen].map((c) => (
                <div
                  key={c.id}
                  className="text-sm border-b py-2"
                  style={{ borderColor: "var(--line)" }}
                >
                  <strong>{c.title}</strong> — {c.secret}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIndex(0);
                setKnown({});
                setFlipped(false);
                setDone(false);
              }}
            >
              Run again
            </button>
            <Link href="/cram" className="btn">
              Other packs
            </Link>
          <Link href="/certs/security-plus" className="btn">
            Security+ products
          </Link>
            <button
              type="button"
              className="btn"
              onClick={() => {
                sessionStorage.setItem("sy0701_pending", "full");
                router.push("/pre-exam");
              }}
            >
              Start full exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-shell min-h-screen flex flex-col">
      <header
        className="border-b bg-white px-4 py-3"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              {pack.title} · {pack.version}
            </div>
            <div className="text-sm font-semibold">
              Secret {index + 1} / {cards.length}
            </div>
          </div>
          <div className="font-mono text-sm tabular-nums">
            {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")} left
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-2 h-1.5 bg-slate-200">
          <div
            className="h-full bg-emerald-700"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8">
        <button
          type="button"
          className="w-full text-left panel bg-white p-6 min-h-[320px] space-y-4"
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span
              className="px-2 py-0.5 border font-semibold"
              style={{
                background:
                  card.hit === "critical"
                    ? "#fef2f2"
                    : card.hit === "high"
                      ? "#fff7ed"
                      : "#f8fafc",
                borderColor: "#cbd5e1",
              }}
            >
              {hitLabel(card.hit)} · score {card.frequency}
            </span>
            <span className="px-2 py-0.5 border" style={{ borderColor: "#cbd5e1" }}>
              Domain {card.domain} · {DOMAIN_META[card.domain].short}
            </span>
            <span
              className="px-2 py-0.5 border font-mono"
              style={{ borderColor: "#cbd5e1" }}
            >
              Obj {card.objective}
            </span>
          </div>

          <h1 className="text-2xl font-semibold">{card.title}</h1>

          {!flipped ? (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Tap to reveal the mid-review secret
              </p>
              <p className="text-lg font-medium text-emerald-900 border-l-4 border-emerald-700 pl-3">
                Recall cue: {card.recall}
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <div className="text-xs uppercase tracking-wide mb-1 text-emerald-800 font-semibold">
                  Secret
                </div>
                <p className="text-base">{card.secret}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide mb-1 text-amber-800 font-semibold">
                  Trap
                </div>
                <p>{card.trap}</p>
              </div>
            </div>
          )}
        </button>

        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" className="btn" onClick={() => setFlipped((f) => !f)}>
            {flipped ? "Hide" : "Reveal"}
          </button>
          <button type="button" className="btn" onClick={() => mark(false)} disabled={!flipped}>
            Still shaky
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => mark(true)}
            disabled={!flipped}
          >
            Solid — next
          </button>
          <Link href="/cram" className="btn ml-auto">
            Exit pack
          </Link>
        </div>

        <details className="mt-8 text-xs" style={{ color: "var(--muted)" }}>
          <summary className="cursor-pointer">Pack methodology</summary>
          <p className="mt-2">{pack.methodology}</p>
        </details>
      </main>
    </div>
  );
}
