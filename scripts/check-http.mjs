import assert from 'node:assert/strict';

// Read-only HTTP checks. Run against a locally started production build.
const base = new URL(process.env.CHECK_URL || 'http://localhost:3000');
assert.ok(['localhost', '127.0.0.1'].includes(base.hostname), 'Use a local application URL.');
const get = (path, options = {}) =>
  fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(25000), ...options });
const pages = [
  '/',
  '/events',
  '/journal',
  '/builds',
  '/join',
  '/privacy',
  '/connect',
  '/leaderboard',
  '/share',
  '/collaborate',
];
for (const path of pages) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy') || '', /nonce-/);
  const html = await response.text();
  assert.match(html, /<h1[ >]/, `${path} has a page heading`);
  assert.doesNotMatch(html, /Something went wrong|NEXT_HTTP_ERROR_FALLBACK;500/);
  console.log(`PASS ${path}`);
}
const eventRedirect = await get('/events/x402-global-challenge-prehack');
const eventTarget = 'https://hackculture.io/hackathons/x402-global-challenge-prehack';
if ([307, 308].includes(eventRedirect.status)) {
  assert.equal(eventRedirect.headers.get('location'), eventTarget);
} else {
  assert.equal(eventRedirect.status, 200);
  assert.ok((await eventRedirect.text()).includes('url=' + eventTarget));
}
for (const path of ['/admin', '/admin/events/new', '/admin/articles/new', '/admin/settings']) {
  const admin = await get(path);
  const shell = await admin.text();
  if ([307, 308].includes(admin.status)) {
    assert.match(admin.headers.get('location') || '', /\/connect/);
  } else {
    // Next.js streams a meta redirect when access resolves after the shell.
    assert.equal(admin.status, 200, path);
    assert.match(shell, /http-equiv="refresh" content="1;url=\/connect\?next=%2Fadmin"/);
  }
  assert.doesNotMatch(shell, /Good gatherings take a little care|class="admin-tabs"|class="admin-row"/);
  assert.doesNotMatch(shell, /NEXT_HTTP_ERROR_FALLBACK;500|Something went wrong|Sign in to continue/);
}
const signout = await get('/auth/signout', {
  method: 'POST',
  headers: { origin: 'https://untrusted.invalid' },
});
assert.equal(signout.status, 403);
const health = await get('/api/health');
assert.equal(health.status, 200);
assert.equal((await health.json()).database, 'connected');
const calendar = await get('/events/hacktoberfest-hack-day-2026/calendar');
assert.equal(calendar.status, 200);
assert.match(calendar.headers.get('content-type'), /text\/calendar/);
assert.match(await calendar.text(), /BEGIN:VCALENDAR[\s\S]+DTSTART:20261018T030000Z/);
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.doesNotMatch(await sitemap.text(), /<loc>[^<]*\/(admin|account|auth|connect|share|collaborate)/);
const og = await get('/opengraph-image');
assert.equal(og.status, 200);
assert.match(og.headers.get('content-type'), /image\/png/);
assert.equal(
  Buffer.from(await og.arrayBuffer())
    .subarray(1, 4)
    .toString(),
  'PNG',
);
const missing = await get('/builds/not-a-project');
assert.ok([200, 404].includes(missing.status));
const missingHtml = await missing.text();
// A missing record discovered after streaming starts carries Next's 404 boundary
// and noindex directive in the response; the already-sent HTTP status stays 200.
assert.match(missingHtml, /NEXT_HTTP_ERROR_FALLBACK;404/);
assert.match(missingHtml, /<meta name="robots" content="noindex"/);
assert.doesNotMatch(missingHtml, /class="project-detail"/);
console.log(
  'PASS organizer redirect, sign-out origin, database health, calendar, sitemap, sharing image, and missing record.',
);
