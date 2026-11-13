import { describe, expect, it } from 'vitest';
import { quarterRange } from '../src/lib/scoring';
import { articleSchema, eventSchema } from '../src/lib/validation';
import {
  articleValues,
  eventValues,
  handle,
  istToday,
  pointValues,
  type Input,
  type Outcome,
  type Session,
} from '../src/lib/telegram/flows';

const ctx = { today: '2026-11-13' };

function run(...inputs: (string | Input)[]) {
  let session: Session | null = null;
  let outcome: Outcome = { session: null, reply: '' };
  for (const input of inputs) {
    outcome = handle(session, typeof input === 'string' ? { text: input } : input, ctx);
    session = outcome.session;
  }
  return outcome;
}

describe('telegram bot flows', () => {
  it('walks through a new event and produces values the organizer schema accepts', () => {
    const outcome = run(
      '/new_event',
      'Build Night: Agents',
      '/skip',
      'meetup',
      'community partner',
      '2026-12-05',
      '18:30',
      '21:00',
      'Bangalore International Centre',
      '/skip',
      'An evening of demos and pairing on AI agents.',
      'https://lu.ma/build-night',
      'https://lu.ma/build-night',
      'Lightspeed, Devfolio',
      { photo: 'file-123' },
      'yes',
    );
    expect(outcome.reply).toContain('Save this?');
    expect(outcome.reply).toContain('Poster: photo attached');
    const saved = handle(outcome.session, { text: 'yes' }, ctx);
    expect(saved.session).toBeNull();
    expect(saved.commit?.flow).toBe('new_event');
    const values = eventValues(saved.commit!.data, ctx.today);
    expect(values).toMatchObject({
      slug: 'build-night-agents',
      relationship: 'community partner',
      starts_at: '2026-12-05T18:30:00+05:30',
      registration_status: 'open',
      lifecycle: 'scheduled',
      published: true,
    });
    const parsed = eventSchema.safeParse(values);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.partners).toEqual(['Lightspeed', 'Devfolio']);
    expect(saved.commit!.data.poster).toBe('file-123');
  });

  it('re-asks with a reason when an answer is invalid and refuses to skip required questions', () => {
    const start = run('/new_event', 'Hack Day');
    expect(handle(start.session, { text: '/skip' }, ctx).session?.step).toBe(2);
    const typed = run('/new_event', 'Hack Day', '/skip', 'party');
    expect(typed.reply).toContain('Choose one of');
    expect(typed.session?.step).toBe(2);
    const required = run('/new_event', '/skip');
    expect(required.reply).toContain('This one is needed.');
    expect(required.session?.step).toBe(0);
  });

  it('skips the end time when no start time is given', () => {
    const outcome = run('/new_event', 'Hack Day', '/skip', 'hackathon', 'hosted', '2026-10-01', '/skip');
    expect(outcome.reply).toBe('Venue?');
    expect(
      eventValues({ ...outcome.session!.data, registration_url: 'https://x.dev' }, ctx.today),
    ).toMatchObject({
      starts_at: '',
      ends_at: '',
      registration_status: 'closed',
      lifecycle: 'completed',
    });
  });

  it('builds a blog card with defaults', () => {
    const outcome = run(
      '/new_article',
      'https://medium.com/@krowdkraft/why-we-build-in-public-123',
      'Why we build in public',
      '/skip',
      'Notes from a year of running build nights in Bengaluru.',
      'Community',
      '/skip',
      '/skip',
      'no',
      'yes',
    );
    expect(outcome.commit?.flow).toBe('new_article');
    const values = articleValues(outcome.commit!.data);
    expect(values).toMatchObject({ slug: 'why-we-build-in-public', author: 'KrowdKraft', date: ctx.today });
    expect(articleSchema.safeParse(values).success).toBe(true);
  });

  it('records leaderboard points from the track-specific activity list', () => {
    const asked = run('/add_points', 'Asha Rao', 'Developers');
    expect(asked.choices).toContain('Hackathon winner bonus (+40)');
    expect(asked.choices).not.toContain('Article or blog published (+10)');
    const outcome = run(
      '/add_points',
      'Asha Rao',
      'Developers',
      'Attended a KrowdKraft event (+20)',
      '/skip',
      '/skip',
      'yes',
    );
    expect(pointValues(outcome.commit!.data)).toEqual({
      member: 'Asha Rao',
      track: 'developers',
      kind: 'event-attended',
      date: ctx.today,
      evidence: '',
    });
  });

  it('handles commands outside a form', () => {
    expect(run('/cancel').reply).toBe('Nothing to cancel.');
    expect(run('/new_event', 'Hack Day', '/cancel').session).toBeNull();
    expect(run('/recent').command).toEqual({ name: 'recent' });
    expect(run('/publish_event build-night').command).toEqual({ name: 'publish_event', slug: 'build-night' });
    expect(run('/hide_event').command).toBeUndefined();
    expect(run('hello').reply).toContain('/new_event');
    expect(run('/new_event@KrowdKraftBot').session?.flow).toBe('new_event');
  });

  it('uses the India calendar date and quarter boundaries', () => {
    expect(istToday(new Date('2026-12-31T19:00:00Z'))).toBe('2027-01-01');
    expect(quarterRange('2026-Q4')).toEqual(['2026-10-01', '2027-01-01']);
    expect(quarterRange('2027-Q1')).toEqual(['2027-01-01', '2027-04-01']);
  });
});
