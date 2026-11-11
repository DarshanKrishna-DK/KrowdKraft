export const membershipPaths = ['general', 'amigos', 'core'] as const;
export type MembershipPath = (typeof membershipPaths)[number];

export const occupations = [
  'Student',
  'Working professional',
  'Looking for opportunities',
  'Freelancer',
  'Solo entrepreneur',
] as const;

export type MembershipValues = {
  fullName: string;
  email: string;
  occupation: string;
  organization: string;
  linkedin: string;
  github: string;
  video: string;
  activeConversation: boolean;
  ownGoal: boolean;
  coreContribution: boolean;
};

export const emptyMembership: MembershipValues = {
  fullName: '',
  email: '',
  occupation: '',
  organization: '',
  linkedin: '',
  github: '',
  video: '',
  activeConversation: false,
  ownGoal: false,
  coreContribution: false,
};

const pathLabel: Record<MembershipPath, string> = {
  general: 'General member',
  amigos: 'Amigos',
  core: 'Core team',
};

function httpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function membershipError(path: MembershipPath, values: MembershipValues) {
  if (values.fullName.trim().length < 2) return 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return 'Enter a valid email address.';
  if (!occupations.includes(values.occupation as (typeof occupations)[number]))
    return 'Choose an occupation.';
  if (values.organization.trim().length < 2) return 'Enter your university or company.';
  if (path === 'general') return null;
  if (!httpUrl(values.linkedin.trim())) return 'Enter a public LinkedIn link.';
  if (!httpUrl(values.github.trim())) return 'Enter a public GitHub link.';
  if (!httpUrl(values.video.trim())) return 'Enter a public link to your 2–3 minute video.';
  if (path === 'amigos') {
    if (!values.activeConversation) return 'Agree to stay active in the group conversation.';
    if (!values.ownGoal) return 'Agree to stay active in pursuing your own goal.';
    return null;
  }
  if (path === 'core') {
    if (!values.coreContribution) return 'Agree to stay active in community contributions and activations.';
    return null;
  }
  const unreachable: never = path;
  return unreachable;
}

export function membershipRow(path: MembershipPath, values: MembershipValues) {
  return {
    path: pathLabel[path],
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    occupation: values.occupation,
    organization: values.organization.trim(),
    linkedin: path === 'general' ? '' : values.linkedin.trim(),
    github: path === 'general' ? '' : values.github.trim(),
    video: path === 'general' ? '' : values.video.trim(),
    activeConversation: path === 'amigos' && values.activeConversation ? 'Yes' : '',
    ownGoal: path === 'amigos' && values.ownGoal ? 'Yes' : '',
    coreContribution: path === 'core' && values.coreContribution ? 'Yes' : '',
  };
}

export async function submitMembership(path: MembershipPath, values: MembershipValues) {
  const problem = membershipError(path, values);
  if (problem) throw new Error(problem);
  const response = await fetch('/api/membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, ...values }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || 'We couldn’t save this. Try again.');
  }
}
