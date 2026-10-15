import fs from 'node:fs';

const read = (file) =>
  JSON.parse(fs.readFileSync(new URL(`../details/${file}`, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const community = read('community.json');

export const contentRecords = [
  {
    table: 'workshop_settings',
    key: 'id',
    rows: [
      {
        id: 'community',
        name: community.name,
        description: community.description,
        city: community.city,
        email: community.email,
        links: read('links.json'),
        organizers: community.organizers,
        stats: community.stats,
        partners: community.partners,
      },
    ],
  },
  {
    table: 'workshop_events',
    key: 'slug',
    rows: read('events.json').map((event) => ({
      slug: event.slug,
      title: event.title,
      description: event.description,
      date: event.date,
      starts_at: event.startsAt || null,
      ends_at: event.endsAt || null,
      venue: event.venue,
      city: event.city,
      type: event.type,
      relationship: event.relationship,
      image: event.image,
      source_url: event.sourceUrl,
      registration_url: event.registrationUrl,
      participant_url: event.participantUrl || null,
      registration_deadline: event.registrationDeadline || null,
      registration_status: event.registrationDeadline
        ? 'closed'
        : event.registrationUrl
          ? 'unknown'
          : 'not-applicable',
      lifecycle: 'scheduled',
      partners: event.partners || [],
      featured: event.featured,
      published: true,
      verified_at:
        event.verifiedAt ||
        (['hacktoberfest-2026', 'x402-prehack-2026'].includes(event.id) ? '2026-10-14T18:00:00Z' : null),
    })),
  },
  {
    table: 'workshop_articles',
    key: 'slug',
    rows: read('journal-history.json').map(({ cover, ...article }) => ({ ...article, published: true })),
  },
];
