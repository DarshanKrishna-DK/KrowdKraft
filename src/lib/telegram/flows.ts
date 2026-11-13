import { activities, activitiesFor, tracks, type ActivityKind, type Track } from '../scoring';
import { httpsUrl, slugSchema } from '../validation';

export type FlowId = 'new_event' | 'new_article' | 'add_points';
export type Session = { flow: FlowId; step: number; data: Record<string, string> };
export type Input = { text?: string; photo?: string };
export type Context = { today: string };
export type Command = { name: 'recent' } | { name: 'publish_event' | 'hide_event'; slug: string };
export type Outcome = {
  session: Session | null;
  reply: string;
  choices?: string[];
  commit?: { flow: FlowId; data: Record<string, string> };
  command?: Command;
};

type Parsed = string | { error: string };
type Step = {
  key: string;
  label: string;
  ask: (data: Record<string, string>, ctx: Context) => string;
  parse: (text: string, data: Record<string, string>) => Parsed;
  choices?: (data: Record<string, string>) => string[];
  skip?: (data: Record<string, string>, ctx: Context) => string;
  photo?: boolean;
  when?: (data: Record<string, string>) => boolean;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

const text =
  (min: number, max: number, name: string) =>
  (value: string): Parsed =>
    value.length < min || value.length > max
      ? { error: `${name} must be ${min} to ${max} characters.` }
      : value;

const url = (value: string): Parsed =>
  httpsUrl.safeParse(value).success ? value : { error: 'Send a full https:// link.' };

const day = (value: string): Parsed => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match && new Date(`${value}T00:00:00Z`);
  return date && date.toISOString().slice(0, 10) === value
    ? value
    : { error: 'Send the date as YYYY-MM-DD.' };
};

const time = (value: string): Parsed => {
  const match = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/.exec(value);
  return match
    ? `${match[1].padStart(2, '0')}:${match[2]}`
    : { error: 'Send the time in 24-hour format, like 18:30.' };
};

const oneOf =
  (options: string[]) =>
  (value: string): Parsed =>
    options.find((option) => option.toLowerCase() === value.toLowerCase().replace(/\s+/g, ' ')) ?? {
      error: `Choose one of: ${options.join(', ')}.`,
    };

const yesNo = oneOf(['yes', 'no']);
const eventTypes = ['hackathon', 'workshop', 'meetup', 'technical-session'];

const trackName = (track: string) => tracks.find((t) => t.id === track)?.name ?? track;
const activityLabel = (kind: string) => activities[kind as ActivityKind]?.label ?? kind;
const activityChoices = (track: string) =>
  activitiesFor(track as Track).map(([, activity]) => `${activity.label} (+${activity.points})`);

const flows: Record<FlowId, { title: string; steps: Step[]; done: string }> = {
  new_event: {
    title: 'New event',
    done: 'Saving the event…',
    steps: [
      {
        key: 'title',
        label: 'Title',
        ask: () => 'What is the event called?',
        parse: text(3, 160, 'The title'),
      },
      {
        key: 'slug',
        label: 'Page address',
        ask: (d) => `Page address for /events/…? Send /skip to use "${slugify(d.title)}".`,
        skip: (d) => slugify(d.title),
        parse: (v) => {
          const slug = slugify(v);
          return slugSchema.safeParse(slug).success
            ? slug
            : { error: 'Use 3 to 100 lowercase letters, numbers and dashes.' };
        },
      },
      {
        key: 'type',
        label: 'Type',
        ask: () => 'What kind of event is it?',
        choices: () => eventTypes,
        parse: (v) => oneOf(eventTypes)(v.replace(/\s+/g, '-')),
      },
      {
        key: 'relationship',
        label: 'Hosting',
        ask: () => 'Is KrowdKraft hosting it, or joining as a community partner?',
        choices: () => ['hosted', 'co-hosted', 'community partner'],
        parse: (v) => {
          const result = text(2, 100, 'The relationship')(v);
          return typeof result === 'string' ? result.toLowerCase() : result;
        },
      },
      { key: 'date', label: 'Date', ask: () => 'Event date? Send it as YYYY-MM-DD.', parse: day },
      {
        key: 'starts',
        label: 'Starts',
        ask: () => 'Start time in IST, 24-hour, like 18:30. Send /skip if it is not fixed yet.',
        skip: () => '',
        parse: time,
      },
      {
        key: 'ends',
        label: 'Ends',
        ask: () => 'End time in IST, like 21:00. Send /skip to leave it open.',
        when: (d) => !!d.starts,
        skip: () => '',
        parse: (v, d) => {
          const result = time(v);
          return typeof result === 'string' && result <= d.starts
            ? { error: 'The end time must be after the start time.' }
            : result;
        },
      },
      { key: 'venue', label: 'Venue', ask: () => 'Venue?', parse: text(2, 160, 'The venue') },
      {
        key: 'city',
        label: 'City',
        ask: () => 'City? Send /skip for Bengaluru.',
        skip: () => 'Bengaluru',
        parse: text(2, 100, 'The city'),
      },
      {
        key: 'description',
        label: 'Description',
        ask: () => 'Describe the event in a few sentences.',
        parse: text(10, 6000, 'The description'),
      },
      {
        key: 'source_url',
        label: 'Event page',
        ask: () => 'Link to the official event page (Luma, Devfolio, Meetup…)?',
        parse: url,
      },
      {
        key: 'registration_url',
        label: 'Registration',
        ask: () => 'Registration link? Send /skip if registration is not needed.',
        skip: () => '',
        parse: url,
      },
      {
        key: 'partners',
        label: 'Partners',
        ask: () => 'Partners, separated by commas? Send /skip for none.',
        skip: () => '',
        parse: text(2, 500, 'The partner list'),
      },
      {
        key: 'poster',
        label: 'Poster',
        ask: () => 'Send the poster as a photo (under 2 MB), or /skip.',
        photo: true,
        skip: () => '',
        parse: () => ({ error: 'Send the poster as a photo, or /skip.' }),
      },
      {
        key: 'published',
        label: 'Publish now',
        ask: () => 'Publish it on the website now?',
        choices: () => ['yes', 'no'],
        parse: yesNo,
      },
    ],
  },
  new_article: {
    title: 'New blog',
    done: 'Saving the blog…',
    steps: [
      { key: 'href', label: 'Link', ask: () => 'Link to the article (Medium or elsewhere)?', parse: url },
      { key: 'title', label: 'Title', ask: () => 'Article title?', parse: text(3, 160, 'The title') },
      {
        key: 'subtitle',
        label: 'Subtitle',
        ask: () => 'Subtitle? Send /skip for none.',
        skip: () => '',
        parse: text(1, 200, 'The subtitle'),
      },
      {
        key: 'description',
        label: 'Summary',
        ask: () => 'A short summary for the card.',
        parse: text(10, 1000, 'The summary'),
      },
      {
        key: 'topic',
        label: 'Topic',
        ask: () => 'Topic, like AI or Web3?',
        parse: text(2, 80, 'The topic'),
      },
      {
        key: 'author',
        label: 'Author',
        ask: () => 'Author name? Send /skip for KrowdKraft.',
        skip: () => 'KrowdKraft',
        parse: text(2, 100, 'The author'),
      },
      {
        key: 'date',
        label: 'Date',
        ask: (_, ctx) => `Publish date as YYYY-MM-DD? Send /skip for today (${ctx.today}).`,
        skip: (_, ctx) => ctx.today,
        parse: day,
      },
      {
        key: 'published',
        label: 'Publish now',
        ask: () => 'Show it on the website now?',
        choices: () => ['yes', 'no'],
        parse: yesNo,
      },
    ],
  },
  add_points: {
    title: 'Leaderboard points',
    done: 'Adding the points…',
    steps: [
      {
        key: 'member',
        label: 'Member',
        ask: () => 'Member name, as it should appear?',
        parse: text(2, 80, 'The name'),
      },
      {
        key: 'track',
        label: 'Board',
        ask: () => 'Which board?',
        choices: () => tracks.map((t) => t.name),
        parse: (v) => {
          const choice = oneOf(tracks.map((t) => t.name))(v);
          return typeof choice === 'string' ? tracks.find((t) => t.name === choice)!.id : choice;
        },
      },
      {
        key: 'kind',
        label: 'Activity',
        ask: () => 'What did they do?',
        choices: (d) => activityChoices(d.track),
        parse: (v, d) => {
          const options = activitiesFor(d.track as Track);
          const index = activityChoices(d.track).findIndex(
            (choice) => choice.toLowerCase() === v.toLowerCase(),
          );
          const match =
            options[index] ??
            options.find(([kind, a]) => kind === v || a.label.toLowerCase() === v.toLowerCase());
          return match ? match[0] : { error: 'Pick one of the activities on the keyboard.' };
        },
      },
      {
        key: 'date',
        label: 'Date',
        ask: (_, ctx) => `When did it happen (YYYY-MM-DD)? Send /skip for today (${ctx.today}).`,
        skip: (_, ctx) => ctx.today,
        parse: day,
      },
      {
        key: 'evidence',
        label: 'Proof',
        ask: () => 'Proof link or a short note? Send /skip for none.',
        skip: () => '',
        parse: text(2, 300, 'The note'),
      },
    ],
  },
};

const describe = (key: string, value: string) => {
  if (key === 'poster') return value ? 'photo attached' : 'none';
  if (key === 'track') return trackName(value);
  if (key === 'kind') return `${activityLabel(value)} (+${activities[value as ActivityKind]?.points ?? 0})`;
  return value || '—';
};

export const help = [
  'KrowdKraft website bot',
  '',
  '/new_event – add an event, step by step',
  '/new_article – add a blog to the Blogs section',
  '/add_points – give leaderboard points',
  '/recent – latest events, blogs and points',
  '/publish_event <slug> – show a draft event',
  '/hide_event <slug> – hide an event',
  '/skip – skip an optional question',
  '/cancel – stop the current form',
].join('\n');

function prompt(session: Session, ctx: Context, prefix = ''): Outcome {
  const { steps, title } = flows[session.flow];
  const step = steps[session.step];
  if (!step) {
    const summary = steps
      .filter((s) => !s.when || s.when(session.data))
      .map((s) => `${s.label}: ${describe(s.key, session.data[s.key] ?? '')}`)
      .join('\n');
    return {
      session,
      reply: `${prefix}${title}\n\n${summary}\n\nSave this? Send yes, or /cancel.`,
      choices: ['yes', '/cancel'],
    };
  }
  return { session, reply: `${prefix}${step.ask(session.data, ctx)}`, choices: step.choices?.(session.data) };
}

function advance(session: Session, key: string, value: string, ctx: Context): Outcome {
  const data = { ...session.data, [key]: value };
  const { steps } = flows[session.flow];
  let step = session.step + 1;
  while (steps[step]?.when && !steps[step].when!(data)) step++;
  return prompt({ ...session, step, data }, ctx);
}

export function handle(session: Session | null, input: Input, ctx: Context): Outcome {
  const message = input.text?.trim() ?? '';
  const [rawCommand, ...rest] = message.startsWith('/') ? message.split(/\s+/) : [''];
  const command = rawCommand.split('@')[0].toLowerCase();

  if (command === '/start' || command === '/help') return { session, reply: help };
  if (command === '/cancel')
    return { session: null, reply: session ? 'Cancelled. Nothing was saved.' : 'Nothing to cancel.' };
  if (command === '/new_event' || command === '/new_article' || command === '/add_points') {
    const flow = command.slice(1) as FlowId;
    return prompt({ flow, step: 0, data: {} }, ctx, `${flows[flow].title}. Send /cancel at any time.\n\n`);
  }
  if (command === '/recent') return { session, reply: '', command: { name: 'recent' } };
  if (command === '/publish_event' || command === '/hide_event') {
    const slug = rest[0] ?? '';
    if (!slugSchema.safeParse(slug).success) return { session, reply: `Send it as ${command} event-slug.` };
    return { session, reply: '', command: { name: command.slice(1) as 'publish_event', slug } };
  }

  if (!session) {
    return {
      session: null,
      reply: command ? `I don't know ${command}.\n\n${help}` : `Start with a command.\n\n${help}`,
    };
  }

  const { steps, done } = flows[session.flow];
  const step = steps[session.step];
  if (!step) {
    if (message.toLowerCase() === 'yes')
      return { session: null, reply: done, commit: { flow: session.flow, data: session.data } };
    return prompt(session, ctx, 'Send yes to save, or /cancel.\n\n');
  }
  if (command === '/skip') {
    if (!step.skip) return prompt(session, ctx, 'This one is needed.\n\n');
    return advance(session, step.key, step.skip(session.data, ctx), ctx);
  }
  if (command) return prompt(session, ctx, `Finish this form or send /cancel first.\n\n`);
  if (step.photo) {
    if (input.photo) return advance(session, step.key, input.photo, ctx);
    return prompt(session, ctx, 'Send a photo, or /skip.\n\n');
  }
  if (!message) return prompt(session, ctx);
  const parsed = step.parse(message, session.data);
  if (typeof parsed !== 'string') return prompt(session, ctx, `${parsed.error}\n\n`);
  return advance(session, step.key, parsed, ctx);
}

const istTime = (date: string, time: string) => (time ? `${date}T${time}:00+05:30` : '');

export function eventValues(data: Record<string, string>, today: string) {
  const past = data.date < today;
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.date,
    starts_at: istTime(data.date, data.starts),
    ends_at: istTime(data.date, data.ends),
    venue: data.venue,
    city: data.city,
    type: data.type,
    relationship: data.relationship,
    image: '',
    source_url: data.source_url,
    registration_url: data.registration_url,
    participant_url: '',
    registration_deadline: '',
    registration_status: data.registration_url ? (past ? 'closed' : 'open') : 'not-applicable',
    lifecycle: past ? 'completed' : 'scheduled',
    partners: data.partners,
    published: data.published === 'yes',
    featured: false,
  };
}

export function articleValues(data: Record<string, string>) {
  return {
    slug: slugify(data.title),
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    date: data.date,
    topic: data.topic,
    author: data.author,
    href: data.href,
    published: data.published === 'yes',
  };
}

export function pointValues(data: Record<string, string>) {
  return {
    member: data.member,
    track: data.track as Track,
    kind: data.kind as ActivityKind,
    date: data.date,
    evidence: data.evidence,
  };
}

export const istToday = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
