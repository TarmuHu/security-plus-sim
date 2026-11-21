"use client";

import Link from "next/link";
import { ProductHeader } from "@/components/ProductHeader";
import { CRAM_BANK, getCardsForPack, getPacks, hitLabel } from "@/lib/cram";
import { DOMAIN_META } from "@/lib/domains";

export default function CramLobbyPage() {
  const packs = getPacks();

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="30-Minute Mid-Review · SY0-701"
        title="High-Yield Cram Packs"
        subtitle="Ranked 30-minute reviews from official domain weights and public high-yield patterns — not dumps."
        background="linear-gradient(135deg, #0f1a14 0%, #1a3d2e 50%, #245c42 100%)"
        color="#f0fdf4"
        linkClassName="text-xs font-medium no-underline hover:underline underline-offset-2"
      />

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        <div className="panel p-4 text-sm space-y-2" style={{ color: "var(--muted)" }}>
          <p>
            <strong>How frequency is estimated:</strong> {CRAM_BANK.generatedFrom}
          </p>
          <p>{CRAM_BANK.disclaimer}</p>
          <p>
            Domain weights used: Ops <strong>28%</strong> · Threats <strong>22%</strong> ·
            Governance <strong>20%</strong> · Architecture <strong>18%</strong> · Concepts{" "}
            <strong>12%</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {packs.map((pack) => {
            const cards = getCardsForPack(pack);
            const avg = Math.round(
              cards.reduce((s, c) => s + c.frequency, 0) / Math.max(cards.length, 1)
            );
            const criticals = cards.filter((c) => c.hit === "critical").length;
            return (
              <Link
                key={pack.id}
                href={`/cram/${pack.id}`}
                className="panel p-5 hover:bg-white transition-colors block no-underline text-inherit"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                      {pack.version} · {pack.durationMin} min · {cards.length} secrets
                    </div>
                    <h2 className="text-lg font-semibold mt-1">{pack.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tabular-nums text-emerald-800">
                      {avg}
                    </div>
                    <div className="text-[10px] uppercase" style={{ color: "var(--muted)" }}>
                      avg hit score
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                  {pack.subtitle}
                </p>
                <p className="text-xs mb-3">{pack.focus}</p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 border bg-red-50 border-red-200 text-red-800">
                    {criticals} {hitLabel("critical")}
                  </span>
                  <span className="px-2 py-0.5 border bg-slate-50" style={{ borderColor: "var(--line)" }}>
                    Start session →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="panel p-5">
          <h2 className="font-semibold mb-2">Why Ops-first packs exist</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            On SY0-701, Security Operations alone is ~{Math.round(DOMAIN_META[4].weight * 100)}%
            of the exam. A precise 30-minute mid-review should overweight IR order, IAM/MFA,
            SIEM/EDR, hardening, and PBQ pacing — not memorize rare trivia.
          </p>
        </section>

        <Link href="/certs/security-plus" className="btn inline-flex">
          ← Security+ products
        </Link>
      </main>
    </div>
  );
}
