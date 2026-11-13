import { ogCard, ogSize } from '@/lib/og-card';
export const alt = 'KrowdKraft. Where what is becomes look what I made.';
export const size = ogSize;
export const contentType = 'image/png';
export default function Image() {
  return ogCard({
    eyebrow: 'Builder community · Bengaluru',
    title: 'Where what is becomes look what I made.',
    footer: 'Workshops. Hack days. Shared projects.',
  });
}
