// Registers the bot's command menu and, when a site URL is given, points Telegram's webhook at it.
// Usage: npm run telegram:setup [-- https://krowd-kraft.vercel.app]
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!token || !secret) {
  console.error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in .env.local first.');
  process.exit(1);
}

async function call(method, body = {}) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`${method}: ${result.description}`);
  return result.result;
}

const commands = [
  ['new_event', 'Add an event to the website'],
  ['new_article', 'Add a blog to the Blogs section'],
  ['add_points', 'Give leaderboard points'],
  ['recent', 'Latest events, blogs and points'],
  ['publish_event', 'Show a draft event: /publish_event slug'],
  ['hide_event', 'Hide an event: /hide_event slug'],
  ['skip', 'Skip an optional question'],
  ['cancel', 'Stop the current form'],
  ['help', 'List the commands'],
];

const me = await call('getMe');
await call('setMyCommands', {
  commands: commands.map(([command, description]) => ({ command, description })),
});
console.log(`Commands registered for @${me.username}.`);

const site = process.argv[2];
if (site) {
  const url = new URL('/api/telegram', site);
  if (url.protocol !== 'https:') throw new Error('Telegram webhooks need an https:// URL.');
  await call('setWebhook', {
    url: url.href,
    secret_token: secret,
    allowed_updates: ['message'],
    drop_pending_updates: true,
  });
  console.log(`Webhook set to ${url.href}.`);
} else {
  const info = await call('getWebhookInfo');
  console.log(
    info.url
      ? `Webhook currently points to ${info.url}.`
      : 'No webhook set. Use npm run telegram:poll locally.',
  );
}
