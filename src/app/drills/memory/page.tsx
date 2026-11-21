"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Old path — memory list is now a standalone product at /memory */
export default function DrillsMemoryRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/memory");
  }, [router]);
  return (
    <p className="lobby-shell p-8 text-sm" style={{ color: "var(--muted)" }}>
      Redirecting to Memory List…
    </p>
  );
}
