"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductHeader } from "@/components/ProductHeader";
import { QUESTION_BANK } from "@/lib/questions";

export default function PbqLabPage() {
  const router = useRouter();
  const pbqCount = QUESTION_BANK.filter((q) => q.type.startsWith("pbq_")).length;

  function start() {
    sessionStorage.setItem("sy0701_pending", "pbq");
    router.push("/pre-exam");
  }

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Performance-Based Practice"
        title="PBQ Lab"
        subtitle="Simulations only — build speed on firewall, logs, matching, sequencing, and topology."
        background="linear-gradient(135deg, #7c2d12 0%, #9a3412 55%, #c2410c 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="panel p-6 space-y-4">
          <h2 className="text-xl font-semibold">Lab session</h2>
          <ul className="text-sm space-y-1" style={{ color: "var(--muted)" }}>
            <li>Up to {pbqCount} PBQ items in the bank (session draws 6)</li>
            <li>45-minute timer · same exam chrome as the full simulator</li>
            <li>Flag, Exhibit window, Review, End Review → score report</li>
            <li>Strategy tip: still practice skipping early if stuck</li>
          </ul>
          <button type="button" className="btn btn-primary" onClick={start}>
            Start PBQ Lab
          </button>
        </div>

        <div className="panel p-5 text-sm" style={{ color: "var(--muted)" }}>
          <p className="mb-2">
            <strong>Included patterns:</strong> control matching, firewall ACL builder,
            log triage, IR sequencing, topology placement.
          </p>
          <p>
            Want pacing theory first? Read the{" "}
            <Link href="/guides/pbq-strategy">PBQ Strategy Guide</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
