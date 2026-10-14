import type { Metadata } from "next";
import { Manrope, Yatra_One } from "next/font/google";
import { heroDescription } from "@/data/community";
import { Krafty } from "@/components/duck/krafty";
import { Motion } from "@/components/motion";
import { Analytics } from "@/components/analytics";
import { analyticsId } from "@/lib/analytics";
import { siteOrigin } from "@/lib/site";
import "@/styles/clubhouse.css";
import "@/styles/cream.css";
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const yatra = Yatra_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const origin = siteOrigin();
export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
  title: "KrowdKraft — Where Bengaluru's developers connect",
  description: heroDescription,
  openGraph: {
    title: "KrowdKraft",
    description: heroDescription,
    images: origin
      ? [
          {
            url: "/brand/og.png",
            width: 1200,
            height: 630,
            alt: "KrowdKraft, Bengaluru developer community",
          },
        ]
      : undefined,
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${yatra.variable}`}>
      <body>
        {children}
        <Krafty />
        <Motion />
        <Analytics
          id={analyticsId}
          enabled={
            process.env.NODE_ENV === "production" &&
            process.env.GOOGLE_ANALYTICS_ENABLED === "true" &&
            process.env.VERCEL_ENV !== "preview"
          }
        />
        <noscript>
          <style>{".krafty-traveller { display: none; }"}</style>
        </noscript>
      </body>
    </html>
  );
}
