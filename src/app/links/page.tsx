import { ProductHeader } from "@/components/ProductHeader";
import { LINK_GROUPS } from "@/lib/links";

export default function LinksPage() {
  return (
    <div className="lobby-shell min-h-screen">
      <ProductHeader
        backHref="/certs/security-plus"
        backLabel="← Security+ products"
        activeCertId="security-plus"
        eyebrow="Resources"
        title="Useful Links"
        subtitle="Official blueprints, delivery info, and public references — no dump sites."
        background="linear-gradient(135deg, #083344 0%, #0e7490 55%, #06b6d4 100%)"
      />

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <p className="text-sm panel p-4" style={{ color: "var(--muted)" }}>
          Prefer primary sources. Avoid “actual exam questions” marketplaces — they
          violate CompTIA policy and often teach wrong answers.
        </p>

        {LINK_GROUPS.map((group) => (
          <section key={group.id}>
            <h2 className="text-lg font-semibold mb-3">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel p-4 block no-underline text-inherit hover:bg-white"
                >
                  <div className="font-medium" style={{ color: "#0e7490" }}>
                    {item.title} ↗
                  </div>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                    {item.note}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
