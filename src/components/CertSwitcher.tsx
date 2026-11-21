"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CERTIFICATIONS, DEFAULT_CERT_ID, getCert } from "@/lib/certs";

function certIdFromPath(pathname: string): string {
  const m = pathname.match(/^\/certs\/([^/]+)/);
  if (m) return m[1];
  // Existing Security+ deep routes
  if (
    pathname.startsWith("/security-plus") ||
    pathname.startsWith("/cram") ||
    pathname.startsWith("/guides") ||
    pathname.startsWith("/links") ||
    pathname.startsWith("/pbq-lab") ||
    pathname.startsWith("/drills") ||
    pathname.startsWith("/memory") ||
    pathname.startsWith("/notebook") ||
    pathname.startsWith("/exam") ||
    pathname.startsWith("/pre-exam") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/report")
  ) {
    return DEFAULT_CERT_ID;
  }
  return DEFAULT_CERT_ID;
}

/** Compact certification switcher for headers and hubs. */
export function CertSwitcher({
  activeCertId,
  variant = "light",
}: {
  activeCertId?: string;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname() || "/";
  const currentId = activeCertId ?? certIdFromPath(pathname);
  const current = getCert(currentId);

  const onDark = variant === "light"; // light text on dark header
  // Inline colors beat global `a { color: accent }` on dark headers.
  const idleClass = onDark
    ? "border-white/50 hover:border-white hover:bg-white/10"
    : "border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900";
  const activeClass = onDark
    ? "border-white bg-white/20 font-semibold"
    : "border-slate-800 bg-slate-900 text-white font-semibold";
  const idleColor = onDark ? "rgba(255,255,255,0.88)" : undefined;
  const activeColor = onDark ? "#ffffff" : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Certifications">
      <span
        className="text-[10px] uppercase tracking-wider mr-1"
        style={{ color: onDark ? "rgba(255,255,255,0.7)" : "var(--muted)" }}
      >
        Cert
      </span>
      {CERTIFICATIONS.map((cert) => {
        const isActive = cert.id === current?.id;
        const className = `text-xs px-2.5 py-1 border transition-colors ${
          isActive ? activeClass : idleClass
        }`;
        const color = isActive ? activeColor : idleColor;

        if (cert.status === "soon") {
          return (
            <Link
              key={cert.id}
              href={cert.href}
              className={className}
              title={`${cert.name} — coming soon`}
              style={{ textDecoration: "none", color }}
            >
              {cert.shortName}
              <span className="ml-1" style={{ opacity: 0.75 }}>
                soon
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={cert.id}
            href={cert.href}
            className={className}
            style={{ textDecoration: "none", color }}
            aria-current={isActive ? "page" : undefined}
          >
            {cert.shortName}
          </Link>
        );
      })}
    </div>
  );
}
