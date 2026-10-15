import { describe, it, expect } from 'vitest';
import { safeNext, profileSchema, projectSchema, eventSchema } from '../src/lib/validation';
import { imageFormat, MAX_IMAGE_BYTES } from '../src/lib/uploads';
describe('untrusted input boundaries', () => {
  it('keeps login redirects on this application', () => {
    for (const value of [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      '/%2f%2fevil.example',
      '/%5cevil.example',
      '/auth/callback',
      '/a/../auth/github',
      '/\r\nevil',
      '/%0Aevil',
      '/%',
    ])
      expect(safeNext(value)).toBe('/connect');
    expect(safeNext('/events/hack-day?from=account')).toBe('/events/hack-day?from=account');
  });
  it('rejects script and credential URLs', () => {
    for (const website of ['javascript:alert(1)', 'http://example.org', 'https://name:secret@example.org'])
      expect(profileSchema.safeParse({ name: 'A maker', bio: '', website }).success).toBe(false);
  });
  it('accepts one repository, not arbitrary GitHub paths', () => {
    const project = {
      title: 'My useful build',
      summary: 'A real project for curious people.',
      description: 'This project helps people learn through building useful things together.',
      repository_url: 'https://github.com/krafter/project',
      demo_url: '',
      tags: 'TypeScript, open source, TypeScript',
    };
    expect(projectSchema.parse(project).tags).toEqual(['TypeScript', 'open source']);
    expect(
      projectSchema.safeParse({ ...project, repository_url: 'https://github.com/krafter/project/issues' })
        .success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({ ...project, repository_url: 'https://github.com.evil.example/a/b' }).success,
    ).toBe(false);
  });
  it('handles invalid datetime input as validation, not an exception', () => {
    expect(() => eventSchema.safeParse({ starts_at: 'not a date' })).not.toThrow();
  });
  it('allows raster image signatures only', () => {
    expect(imageFormat(new TextEncoder().encode('<svg><script>alert(1)</script></svg>'))).toBeNull();
    expect(imageFormat(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]))?.type).toBe(
      'image/png',
    );
    expect(imageFormat(new Uint8Array([255, 216, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0]))?.type).toBe('image/jpeg');
    expect(MAX_IMAGE_BYTES).toBe(2097152);
  });
});
