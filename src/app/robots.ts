import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/supabase';
export default function robots(): MetadataRoute.Robots {
  const live = siteUrl().startsWith('https:');
  return {
    rules: {
      userAgent: '*',
      allow: live ? '/' : undefined,
      disallow: live ? ['/account', '/connect', '/share', '/collaborate', '/admin', '/auth', '/api'] : ['/'],
    },
    ...(live ? { sitemap: `${siteUrl()}/sitemap.xml` } : {}),
  };
}
