import type { Metadata } from 'next';
import { ShareContent, type ShareSearchParams } from '@/components/share-content';

export const metadata: Metadata = { title: 'Share a project', robots: { index: false, follow: false } };

export default function Share({ searchParams }: { searchParams: Promise<ShareSearchParams> }) {
  return <ShareContent searchParams={searchParams} />;
}
