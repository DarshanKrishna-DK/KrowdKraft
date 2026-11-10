import {
  membershipError,
  membershipPaths,
  membershipRow,
  type MembershipPath,
  type MembershipValues,
} from '@/lib/membership';

export const dynamic = 'force-dynamic';

function isPath(value: unknown): value is MembershipPath {
  return typeof value === 'string' && (membershipPaths as readonly string[]).includes(value);
}

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  let record: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') throw new Error('invalid');
    record = body as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Send the application as JSON.' }, { status: 400 });
  }
  if (!isPath(record.path)) return Response.json({ error: 'Choose a way to join.' }, { status: 400 });
  const values: MembershipValues = {
    fullName: text(record.fullName),
    email: text(record.email),
    occupation: text(record.occupation),
    organization: text(record.organization),
    linkedin: text(record.linkedin),
    github: text(record.github),
    video: text(record.video),
    activeConversation: record.activeConversation === true,
    ownGoal: record.ownGoal === true,
    coreContribution: record.coreContribution === true,
  };
  const problem = membershipError(record.path, values);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  const url = process.env.MEMBERSHIP_SHEET_URL;
  if (!url) {
    return Response.json({ error: 'The membership sheet is not connected yet.' }, { status: 503 });
  }
  const saved = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(membershipRow(record.path, values)),
    redirect: 'follow',
  });
  if (!saved.ok) return Response.json({ error: 'We couldn’t save this. Try again.' }, { status: 502 });
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
