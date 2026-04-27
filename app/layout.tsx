import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "旅ノート",
  description: "旅行の記録・計画アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={geist.className}>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
