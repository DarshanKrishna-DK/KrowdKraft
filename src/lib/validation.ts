import { z } from 'zod';
export const httpsUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    try {
      const u = new URL(value);
      return u.protocol === 'https:' && !u.username && !u.password;
    } catch {
      return false;
    }
  }, 'Enter a valid HTTPS URL.');
const optionalUrl = z.union([httpsUrl, z.literal('')]).transform((v) => v || null);
export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(400),
  website: optionalUrl,
});
export const projectSchema = z.object({
  id: z.union([z.uuid(), z.literal('')]).optional(),
  title: z.string().trim().min(3).max(100),
  summary: z.string().trim().min(20).max(240),
  description: z.string().trim().min(40).max(6000),
  repository_url: httpsUrl
    .refine(
      (v) => /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(v),
      'Use a public GitHub repository URL.',
    )
    .transform((v) => v.replace(/\/$/, '')),
  demo_url: optionalUrl,
  tags: z
    .string()
    .max(160)
    .transform((v) => [
      ...new Set(
        v
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    ])
    .refine((v) => v.length <= 6 && v.every((t) => t.length <= 24), 'Use up to six short tags.'),
});
export const proposalSchema = z.object({
  subject: z.string().trim().min(5).max(160),
  message: z.string().trim().min(30).max(5000),
});
export const slugSchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const day = z.iso.date();
const dateTime = z.union([z.iso.datetime({ offset: true }), z.literal('')]).transform((v) => v || null);
export const eventSchema = z
  .object({
    slug: slugSchema,
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().min(10).max(6000),
    date: day,
    starts_at: dateTime,
    ends_at: dateTime,
    venue: z.string().trim().min(2).max(160),
    city: z.string().trim().min(2).max(100),
    type: z.enum(['hackathon', 'workshop', 'meetup', 'technical-session']),
    relationship: z.string().trim().min(2).max(100),
    image: z
      .string()
      .trim()
      .max(300)
      .refine(
        (v) =>
          !v ||
          /^\/events\/[a-z0-9-]+\.webp$/.test(v) ||
          /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(v),
        'Choose an event poster or upload an image.',
      )
      .transform((v) => v || null),
    source_url: httpsUrl,
    registration_url: optionalUrl,
    participant_url: optionalUrl,
    registration_deadline: z.union([day, z.literal('')]).transform((v) => v || null),
    registration_status: z.enum(['open', 'closed', 'waitlist', 'unknown', 'not-applicable']),
    lifecycle: z.enum(['scheduled', 'cancelled', 'completed']),
    partners: z
      .string()
      .max(500)
      .transform((v) =>
        v
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      )
      .refine((v) => v.length <= 12 && v.every((t) => t.length <= 80), 'Use up to 12 partner names.'),
    published: z.boolean(),
    featured: z.boolean(),
  })
  .refine((v) => !v.starts_at || !v.ends_at || Date.parse(v.ends_at) > Date.parse(v.starts_at), {
    message: 'End time must be after start time.',
    path: ['ends_at'],
  })
  .refine((v) => !v.ends_at || !!v.starts_at, {
    message: 'Set a start time before an end time.',
    path: ['starts_at'],
  })
  .refine((v) => !['open', 'waitlist'].includes(v.registration_status) || !!v.registration_url, {
    message: 'Add the official registration URL when registration is open.',
    path: ['registration_url'],
  })
  .refine(
    (v) =>
      !v.starts_at ||
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(v.starts_at)) === v.date,
    { message: 'The start time must fall on the event date in India.', path: ['starts_at'] },
  );
export const articleSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(3).max(160),
  subtitle: z.string().trim().max(200),
  description: z.string().trim().min(10).max(1000),
  date: day,
  topic: z.string().trim().min(2).max(80),
  author: z.string().trim().min(2).max(100),
  href: httpsUrl,
  published: z.boolean(),
});
export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(500),
  city: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  links: z.object({
    github: httpsUrl,
    luma: httpsUrl,
    linkedin: httpsUrl,
    instagram: httpsUrl,
    x: httpsUrl,
    medium: httpsUrl,
    whatsapp: httpsUrl,
  }),
  organizers: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(80),
        initial: z.string().trim().min(1).max(4),
        role: z.string().trim().min(2).max(100),
        linkedin: httpsUrl.optional(),
        x: httpsUrl.optional(),
      }),
    )
    .min(1)
    .max(12),
});
export function safeNext(value: string | null | undefined) {
  if (!value || value.length > 1000 || !value.startsWith('/') || /[\\\s\u0000-\u001f]/.test(value))
    return '/connect';
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith('//') || /[\\\u0000-\u001f]/.test(decoded)) return '/connect';
    const url = new URL(value, 'https://krowdkraft.invalid');
    if (url.origin !== 'https://krowdkraft.invalid' || /^\/auth(?:\/|$)/.test(url.pathname))
      return '/connect';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/connect';
  }
}
