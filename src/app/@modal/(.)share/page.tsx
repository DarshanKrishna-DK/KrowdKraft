import { ShareContent, type ShareSearchParams } from '@/components/share-content';

export default function SharePopup({ searchParams }: { searchParams: Promise<ShareSearchParams> }) {
  return <ShareContent searchParams={searchParams} modal />;
}
