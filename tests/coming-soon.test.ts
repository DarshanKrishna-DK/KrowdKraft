import { describe, expect, it } from 'vitest';
import { comingSoonTarget } from '../src/lib/coming-soon';

const origin = 'http://localhost:3000';

function target(current: string, href: string) {
  return comingSoonTarget(current, new URL(href, origin + current), origin);
}

describe('coming soon gate', () => {
  it('holds project and leaderboard links opened from the rest of the site', () => {
    expect(target('/', '/builds')).toBe(true);
    expect(target('/', '/builds/11111111-1111-4111-8111-111111111111')).toBe(true);
    expect(target('/', '/share')).toBe(true);
    expect(target('/', '/share?page=2')).toBe(true);
    expect(target('/', '/leaderboard')).toBe(true);
    expect(target('/connect', '/leaderboard')).toBe(true);
    expect(target('/builds', '/share')).toBe(true);
    expect(target('/leaderboard', '/builds')).toBe(true);
  });

  it('leaves section jumps, outside links, and the pages themselves alone', () => {
    expect(target('/', '/#builds')).toBe(false);
    expect(target('/', '/#leaderboard')).toBe(false);
    expect(target('/', '/events')).toBe(false);
    expect(target('/', 'https://whatsapp.com/channel/example')).toBe(false);
    expect(target('/builds', '/builds?page=2')).toBe(false);
    expect(target('/builds/abc', '/builds')).toBe(false);
    expect(target('/leaderboard', '/leaderboard?month=2026-10')).toBe(false);
    expect(target('/share', '/share?page=2&edit=1')).toBe(false);
  });
});
