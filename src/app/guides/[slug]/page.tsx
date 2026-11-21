import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductHeader } from "@/components/ProductHeader";
import { getGuide } from "@/lib/guides";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/guides"
        backLabel="← All guides"
        eyebrow="Tips & Guides"
        title={guide.title}
        subtitle={guide.summary}
        background="linear-gradient(135deg, #2a1845 0%, #6b3fa0 55%, #8b5cf6 100%)"
        activeCertId="security-plus"
      />

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {guide.sections.map((s) => (
          <section key={s.heading} className="panel p-5 bg-white">
            <h2 className="text-base font-semibold mb-3">{s.heading}</h2>
            <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "#333" }}>
              {s.body.map((line) => (
                <li key={line} className="pl-3 border-l-2" style={{ borderColor: "#c4b5fd" }}>
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className="flex flex-wrap gap-2">
          <Link href="/guides" className="btn">
            More guides
          </Link>
          <Link href="/certs/security-plus" className="btn">
            Security+ products
          </Link>
        </div>
      </main>
    </div>
  );
}
