import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { heroDescription } from "@/data/community";
import { DuckGuide } from "@/components/duck/duck-guide";
import "@/styles/globals.css";
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});
const origin = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
  title: "KrowdKraft — Where Bengaluru's developers connect",
  description: heroDescription,
  openGraph: {
    title: "KrowdKraft",
    description: heroDescription,
    images: origin ? [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "KrowdKraft, Bengaluru developer community",
      },
    ] : undefined,
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}<DuckGuide /><noscript><style>{".duck-guide { display: none; }"}</style></noscript></body>
    </html>
  );
}
