import Link from "next/link";
import type { ReactNode } from "react";
import { CertSwitcher } from "./CertSwitcher";

/** Shared lobby/product header shell — keeps height consistent across pages. */
export function ProductHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel = "← Back",
  background,
  color = "#f8fafc",
  linkClassName = "text-xs font-medium underline underline-offset-2 decoration-white/60 hover:decoration-white",
  showCertSwitcher = true,
  activeCertId,
}: {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
  backHref?: string;
  backLabel?: string;
  background: string;
  color?: string;
  linkClassName?: string;
  showCertSwitcher?: boolean;
  activeCertId?: string;
}) {
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--line)", background, color }}
    >
      <div
        className="mx-auto max-w-5xl px-6 py-10 flex flex-col justify-center"
        style={{ minHeight: 220 }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 min-h-[1.75rem]">
          <div className="min-h-[1.25rem]">
            {backHref ? (
              <Link
                href={backHref}
                className={linkClassName}
                style={{ color: "#ffffff" }}
              >
                {backLabel}
              </Link>
            ) : (
              <span className="invisible text-xs" aria-hidden>
                {backLabel}
              </span>
            )}
          </div>
          {showCertSwitcher && (
            <CertSwitcher activeCertId={activeCertId} variant="light" />
          )}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-3">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">{title}</h1>
        <p className="text-base max-w-2xl opacity-90">{subtitle}</p>
      </div>
    </header>
  );
}
