"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy deck path → identity flash deck */
export default function LegacyAcronymsDrillRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/drills/identity");
  }, [router]);
  return (
    <p className="lobby-shell p-8 text-sm" style={{ color: "var(--muted)" }}>
      Redirecting to Identity drill…
    </p>
  );
}
