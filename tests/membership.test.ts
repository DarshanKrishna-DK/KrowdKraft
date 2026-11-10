import { describe, expect, it } from 'vitest';
import { membershipError, type MembershipValues } from '../src/lib/membership';

const complete: MembershipValues = {
  fullName: 'Asha Rao',
  email: 'asha@example.com',
  occupation: 'Student',
  organization: 'RV University',
  linkedin: 'https://www.linkedin.com/in/asha',
  github: 'https://github.com/asha',
  video: 'https://youtu.be/example',
  activeConversation: true,
  ownGoal: true,
  coreContribution: true,
};

describe('membership applications', () => {
  it('accepts a general member without socials or a video', () => {
    expect(membershipError('general', { ...complete, linkedin: '', github: '', video: '' })).toBeNull();
  });

  it('asks Amigos and core applicants for public links and their own agreement', () => {
    expect(membershipError('amigos', { ...complete, video: 'drive.google.com/file' })).toMatch(/video/i);
    expect(membershipError('amigos', { ...complete, activeConversation: false })).toMatch(/conversation/i);
    expect(membershipError('core', { ...complete, github: '' })).toMatch(/GitHub/);
    expect(membershipError('core', { ...complete, coreContribution: false })).toMatch(/activations/);
    expect(membershipError('amigos', complete)).toBeNull();
    expect(membershipError('core', complete)).toBeNull();
  });
});
