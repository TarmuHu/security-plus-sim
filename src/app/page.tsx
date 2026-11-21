import Link from "next/link";
import { ProductHeader } from "@/components/ProductHeader";
import { CERTIFICATIONS } from "@/lib/certs";

export default function HomePage() {
  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        eyebrow="Cyber Practice Lab"
        title="Choose a certification"
        subtitle="Pick an exam family first, then open its practice products. Switch anytime from the cert menu."
        background="linear-gradient(135deg, #0c1220 0%, #152033 55%, #1a2740 100%)"
        showCertSwitcher={false}
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATIONS.map((cert) => {
            const live = cert.status === "live";
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5"
                    style={{
                      background: `${cert.accent}18`,
                      color: cert.accent,
                      border: `1px solid ${cert.accent}44`,
                    }}
                  >
                    {cert.examCode}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {live ? "Live" : "Coming soon"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-1">{cert.shortName}</h2>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                  {cert.name}
                </p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
                  {cert.tagline}
                </p>
                <span
                  className="text-sm font-medium"
                  style={{ color: live ? cert.accent : "var(--muted)" }}
                >
                  {live ? "Open suite →" : "View placeholder →"}
                </span>
              </>
            );

            return (
              <Link
                key={cert.id}
                href={cert.href}
                className={`panel p-6 block no-underline text-inherit hover:bg-white transition-colors ${
                  live ? "" : "opacity-80"
                }`}
                style={{ borderTop: `3px solid ${cert.accent}` }}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-xs" style={{ color: "var(--muted)" }}>
          Not affiliated with CompTIA or Pearson VUE. Structure supports multiple
          exam lines; only Security+ content is live today.
        </p>
      </main>
    </div>
  );
}
