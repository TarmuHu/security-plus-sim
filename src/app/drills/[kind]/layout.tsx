import { DRILL_KINDS } from "@/lib/drills";

export function generateStaticParams() {
  return DRILL_KINDS.map((kind) => ({ kind }));
}

export default function DrillKindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
