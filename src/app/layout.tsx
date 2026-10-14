import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { heroDescription } from "@/data/community";
import { Krafty } from "@/components/duck/krafty";
import { Motion } from "@/components/motion";
import { RouteScroll } from "@/components/route-scroll";
import { Analytics } from "@/components/analytics";
import { analyticsId } from "@/lib/analytics";
import { siteOrigin } from "@/lib/site";
import "@/styles/clubhouse.css";
import "@/styles/theme.css";
import "@/styles/details.css";
import "@/styles/exhibition.css";
const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const displayFont = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const origin = siteOrigin();
export const metadata: Metadata = {
  metadataBase: new URL(origin || "http://localhost:3000"),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
  title: "KrowdKraft | Where Bengaluru's developers connect",
  description: heroDescription,
  openGraph: {
    title: "KrowdKraft | Where Bengaluru’s developers connect",
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
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: "KrowdKraft | Where Bengaluru’s developers connect",
    description: heroDescription,
    images: ["/brand/og.png"],
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        {children}
        <Krafty />
        <Motion />
        <RouteScroll />
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
