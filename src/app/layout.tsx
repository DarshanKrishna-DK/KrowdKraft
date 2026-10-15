import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/shell';
import { getCommunity } from '@/lib/data';
import { BackToTop } from '@/components/back-to-top';
import localFont from 'next/font/local';
import '@/styles/anatomy.css';
import '@/styles/arcade.css';
import '@/styles/globals.css';
import '@/styles/forms.css';
import '@/styles/atelier.css';
import '@/styles/refinement.css';
import '@/styles/figure-motion.css';
import '@/styles/directories.css';
import '@/styles/project-dialog.css';
const displayFont = localFont({
  src: '../../public/fonts/jaini-latin.woff2',
  variable: '--font-display',
  weight: '400',
  style: 'normal',
  display: 'swap',
});
const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: { default: 'KrowdKraft | A place for curious builders', template: '%s | KrowdKraft' },
  description:
    'A Bengaluru developer community for curious people who learn together, build useful things, and share what they make.',
  openGraph: {
    title: 'KrowdKraft | A place for curious builders',
    description: 'Where what is becomes look what I made.',
    type: 'website',
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};
export const viewport: Viewport = { themeColor: '#131017', width: 'device-width', initialScale: 1 };
export async function generateMetadata(): Promise<Metadata> {
  const community = await getCommunity();
  return {
    ...baseMetadata,
    description: community.description,
    title: {
      default: `${community.name} | A place for curious builders`,
      template: `%s | ${community.name}`,
    },
  };
}
export const dynamic = 'force-dynamic';
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={displayFont.variable} data-scroll-behavior="smooth">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        {modal}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
