import type { Metadata } from 'next';
import { organizerPageContext } from '@/lib/organizer-page';
export const metadata: Metadata = { title: 'Organizer desk', robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await organizerPageContext();
  return children;
}
