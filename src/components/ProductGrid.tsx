import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product) => {
        const live = product.status === "live";
        const inner = (
          <>
            <div className="flex items-start justify-between gap-3 mb-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5"
                style={{
                  background: `${product.accent}18`,
                  color: product.accent,
                  border: `1px solid ${product.accent}44`,
                }}
              >
                {product.badge ?? product.status}
              </span>
              {!live && (
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                  Coming soon
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
            <p className="text-xs font-mono mb-3" style={{ color: "var(--muted)" }}>
              {product.tagline}
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
              {product.description}
            </p>
            <span
              className="text-sm font-medium"
              style={{ color: live ? product.accent : "var(--muted)" }}
            >
              {live ? "Open →" : "Not available yet"}
            </span>
          </>
        );

        if (!live) {
          return (
            <div
              key={product.id}
              className="panel p-6 opacity-60 cursor-not-allowed"
              aria-disabled
            >
              {inner}
            </div>
          );
        }

        return (
          <Link
            key={product.id}
            href={product.href}
            className="panel p-6 block no-underline text-inherit hover:bg-white transition-colors"
            style={{ borderTop: `3px solid ${product.accent}` }}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
