import Link from "next/link";
import { ProductHeader } from "@/components/ProductHeader";
import { GUIDES } from "@/lib/guides";

export default function GuidesPage() {
  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Tips & Guides · SY0-701"
        title="Tips & Guides"
        subtitle="Strategy, traps, and exam-day guidance — read before you grind."
        background="linear-gradient(135deg, #2a1845 0%, #6b3fa0 55%, #8b5cf6 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="panel p-5 block no-underline text-inherit hover:bg-white"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                ~{g.minutes} min
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {g.summary}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}
