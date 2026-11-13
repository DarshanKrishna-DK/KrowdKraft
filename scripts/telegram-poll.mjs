// Local development: pulls Telegram updates and forwards them to the running dev server's webhook route.
// Usage: npm run dev, then npm run telegram:poll
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const target = process.env.TELEGRAM_LOCAL_URL || 'http://127.0.0.1:3000/api/telegram';
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

const webhook = await call('getWebhookInfo');
if (webhook.url) {
  console.error(
    `A webhook is set (${webhook.url}), so Telegram will not hand updates to this script.\n` +
      'Production is already receiving messages. Remove the webhook only if you mean to test locally.',
  );
  process.exit(1);
}

console.log(`Forwarding Telegram updates to ${target}. Press Ctrl+C to stop.`);
let offset = 0;
for (;;) {
  try {
    const updates = await call('getUpdates', { offset, timeout: 30, allowed_updates: ['message'] });
    for (const update of updates) {
      offset = update.update_id + 1;
      const response = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Telegram-Bot-Api-Secret-Token': secret },
        body: JSON.stringify(update),
      });
      console.log(`update ${update.update_id} → ${response.status}`);
    }
  } catch (error) {
    console.error(error.message);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
