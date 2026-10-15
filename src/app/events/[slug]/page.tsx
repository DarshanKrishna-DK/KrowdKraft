import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/data';
import { officialEventUrl } from '@/lib/events';
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();
  redirect(officialEventUrl(event));
}
