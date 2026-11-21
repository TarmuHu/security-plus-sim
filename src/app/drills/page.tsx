"use client";

import Link from "next/link";
import { ProductHeader } from "@/components/ProductHeader";
import {
  DRILL_KIND_GROUP,
  DRILL_KINDS,
  DRILL_META,
  drillCount,
  memoryListHref,
} from "@/lib/drills";

export default function DrillsHubPage() {
  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Rapid Recall"
        title="Ports & Acronyms Drill"
        subtitle="Flash decks synced from the Memory List (Must / Often — ports also include Useful)."
        background="linear-gradient(135deg, #713f12 0%, #a16207 55%, #ca8a04 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <p className="text-sm panel p-4 m-0" style={{ color: "var(--muted)" }}>
          Decks update when the{" "}
          <Link href="/memory" style={{ color: "#a16207", fontWeight: 600 }}>
            Memory List
          </Link>{" "}
          changes. Use the list to read; use drills to recall cold.
        </p>

        <section>
          <h2 className="text-lg font-semibold mb-3">Flash drills</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {DRILL_KINDS.map((kind) => (
              <div key={kind} className="panel p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold m-0">
                    {DRILL_META[kind].title}
                  </h3>
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {drillCount(kind)} cards
                  </span>
                </div>
                <p className="text-sm m-0 mt-3" style={{ color: "var(--muted)" }}>
                  {DRILL_META[kind].blurb}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-5">
                  <Link
                    href={`/drills/${kind}`}
                    className="btn btn-primary text-sm"
                  >
                    Start drill →
                  </Link>
                  <Link
                    href={memoryListHref({ group: DRILL_KIND_GROUP[kind] })}
                    className="link-quiet text-sm"
                  >
                    View in memory list
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
