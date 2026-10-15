import Link from 'next/link';
import { organizerPageContext } from '@/lib/organizer-page';
import { Icon } from '@/components/icon';
import { PageIntro } from '@/components/shell';
import { SettingsForm } from '@/components/forms/organizer-forms';
export default async function Settings() {
  const { db } = await organizerPageContext();
  const { data, error } = await db.from('workshop_settings').select('*').eq('id', 'community').single();
  if (error) throw error;
  return (
    <>
      <PageIntro
        eyebrow="Organizer desk · Community"
        title="The details that connect us."
        description="Public community information, social destinations, and organizer introductions."
      />
      <section className="wrap page-body editor-wrap">
        <Link href="/admin" className="back-link">
          <Icon name="back" size={16} /> Back to the organizer desk
        </Link>
        <div className="form-panel">
          <SettingsForm community={data} />
        </div>
      </section>
    </>
  );
}
