import { getPacks } from "@/lib/cram";

export function generateStaticParams() {
  return getPacks().map((p) => ({ packId: p.id }));
}

export default function CramPackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
