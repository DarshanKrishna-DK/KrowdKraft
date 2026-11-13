import 'server-only';
import { MAX_IMAGE_BYTES } from '@/lib/uploads';

function token() {
  const value = process.env.TELEGRAM_BOT_TOKEN;
  if (!value) throw new Error('TELEGRAM_BOT_TOKEN is not configured.');
  return value;
}

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${token()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  const result = (await response.json()) as { ok: boolean; result: T; description?: string };
  if (!result.ok) throw new Error(`Telegram ${method} failed: ${result.description ?? response.status}`);
  return result.result;
}

export function sendMessage(chatId: number, text: string, choices?: string[]) {
  const keyboard = choices?.length
    ? {
        keyboard: choices.map((choice) => [{ text: choice }]),
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    : { remove_keyboard: true };
  return call('sendMessage', {
    chat_id: chatId,
    text: text.length > 4000 ? `${text.slice(0, 3997)}…` : text,
    reply_markup: keyboard,
    link_preview_options: { is_disabled: true },
  });
}

export async function downloadFile(fileId: string): Promise<Uint8Array> {
  const file = await call<{ file_path?: string; file_size?: number }>('getFile', { file_id: fileId });
  if (!file.file_path || (file.file_size ?? 0) > MAX_IMAGE_BYTES)
    throw new Error('The poster must be smaller than 2 MB.');
  const response = await fetch(`https://api.telegram.org/file/bot${token()}/${file.file_path}`, {
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('The poster could not be downloaded from Telegram.');
  return new Uint8Array(await response.arrayBuffer());
}
