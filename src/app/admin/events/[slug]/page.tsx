import Link from 'next/link';
import { notFound } from 'next/navigation';
import { organizerPageContext } from '@/lib/organizer-page';
import { Icon } from '@/components/icon';
import { PageIntro } from '@/components/shell';
import { EventForm } from '@/components/forms/organizer-forms';
import type { EventRecord } from '@/lib/types';
export default async function EditEvent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db } = await organizerPageContext();
  let event: EventRecord | undefined;
  if (slug !== 'new') {
    const { data, error } = await db.from('workshop_events').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    if (!data) notFound();
    event = data;
  }
  return (
    <>
      <PageIntro
        eyebrow="Organizer desk · Events"
        title={event ? 'Give the details some care.' : 'Bring people together.'}
        description="Use the official source, keep registration status current, and save a draft whenever you need more time."
      />
      <section className="wrap page-body editor-wrap">
        <Link className="back-link" href="/admin?tab=events">
          <Icon name="back" size={16} /> Back to events
        </Link>
        <div className="form-panel">
          <EventForm event={event} />
        </div>
        {event?.published && (
          <Link href={`/events/${event.slug}`} className="text-link">
            View public event page <Icon name="diagonal" size={16} />
          </Link>
        )}
      </section>
    </>
  );
}
