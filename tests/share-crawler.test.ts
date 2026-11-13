import { describe, expect, it } from 'vitest';
import { isShareCrawlerUa } from '../src/lib/share-crawler';

describe('share crawler detection', () => {
  it('recognises the apps that unfurl links', () => {
    expect(isShareCrawlerUa('WhatsApp/2.23.20.0')).toBe(true);
    expect(isShareCrawlerUa('LinkedInBot/1.0 (compatible; Mozilla/5.0)')).toBe(true);
    expect(isShareCrawlerUa('facebookexternalhit/1.1')).toBe(true);
    expect(isShareCrawlerUa('Twitterbot/1.0')).toBe(true);
  });

  it('sends ordinary browsers on to the original page', () => {
    expect(
      isShareCrawlerUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0'),
    ).toBe(false);
  });
});
