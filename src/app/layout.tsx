import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyber Practice Lab",
  description:
    "Unofficial Security+ practice: exam simulator, cram packs, guides, links, PBQ lab, and memory drills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
