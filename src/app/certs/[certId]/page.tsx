import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductHeader } from "@/components/ProductHeader";
import { CERTIFICATIONS, getCert } from "@/lib/certs";

export function generateStaticParams() {
  return CERTIFICATIONS.map((c) => ({ certId: c.id }));
}

export default async function CertHubPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();

  const live = cert.status === "live";

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/"
        backLabel="← All certifications"
        eyebrow={`${cert.name} · ${cert.examCode}`}
        title={cert.shortName}
        subtitle={
          live
            ? "Choose a product in this suite. Use the cert menu to switch exam families."
            : "This certification is scaffolded — same product slots as Security+, content coming soon."
        }
        background={`linear-gradient(135deg, #0c1220 0%, ${cert.accent} 70%, ${cert.accent}cc 100%)`}
        activeCertId={cert.id}
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {!live && (
          <div className="panel p-4 text-sm" style={{ color: "var(--muted)" }}>
            <strong>Placeholder suite.</strong> Product cards below show the planned
            shape (Exam, Cram, Guides, Links, PBQ, Drills). Nothing is wired for{" "}
            {cert.shortName} yet — switch to Security+ to practice.
          </div>
        )}

        <ProductGrid products={cert.products} />

        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/" className="btn">
            All certifications
          </Link>
          {cert.id !== "security-plus" && (
            <Link href="/certs/security-plus" className="btn btn-primary">
              Go to Security+ suite
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
