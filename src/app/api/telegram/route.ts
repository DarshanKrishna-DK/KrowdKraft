import { timingSafeEqual } from 'node:crypto';
import { serviceClient } from '@/lib/supabase';
import { sendMessage } from '@/lib/telegram/api';
import { commit, runCommand } from '@/lib/telegram/commit';
import { handle, istToday, type Session } from '@/lib/telegram/flows';

export const dynamic = 'force-dynamic';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

type Message = {
  chat: { id: number };
  text?: string;
  photo?: { file_id: string }[];
  document?: { file_id: string; mime_type?: string };
};

function sameSecret(received: string | null, expected: string) {
  const a = Buffer.from(received ?? '');
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const allowedChats = () =>
  (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

function posterOf(message: Message) {
  if (message.photo?.length) return message.photo[message.photo.length - 1].file_id;
  if (message.document?.mime_type?.startsWith('image/')) return message.document.file_id;
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || !process.env.TELEGRAM_BOT_TOKEN)
    return Response.json({ error: 'The bot is not configured.' }, { status: 503 });
  if (!sameSecret(request.headers.get('x-telegram-bot-api-secret-token'), secret))
    return Response.json({ error: 'Forbidden' }, { status: 401 });

  const update = (await request.json().catch(() => null)) as { update_id?: number; message?: Message } | null;
  const message = update?.message;
  if (!update?.update_id || !message?.chat?.id) return Response.json({ ok: true });
  const chatId = message.chat.id;

  if (!allowedChats().includes(String(chatId))) {
    await sendMessage(
      chatId,
      `This bot only takes orders from KrowdKraft organizers. Your chat ID is ${chatId}.`,
    );
    return Response.json({ ok: true });
  }

  const db = serviceClient();
  const { error: seenError } = await db.from('workshop_bot_updates').insert({ update_id: update.update_id });
  if (seenError?.code === '23505') return Response.json({ ok: true });

  try {
    if (seenError) throw seenError;
    const { data: stored, error } = await db
      .from('workshop_bot_sessions')
      .select('flow,step,data,updated_at')
      .eq('chat_id', chatId)
      .maybeSingle();
    if (error) throw error;
    const session: Session | null =
      stored && Date.now() - Date.parse(stored.updated_at) < SESSION_TTL_MS
        ? { flow: stored.flow, step: stored.step, data: stored.data }
        : null;

    const today = istToday();
    const outcome = handle(session, { text: message.text, photo: posterOf(message) }, { today });

    const saved = outcome.session
      ? await db.from('workshop_bot_sessions').upsert({
          chat_id: chatId,
          ...outcome.session,
          updated_at: new Date().toISOString(),
        })
      : await db.from('workshop_bot_sessions').delete().eq('chat_id', chatId);
    if (saved.error) throw saved.error;

    if (outcome.reply) await sendMessage(chatId, outcome.reply, outcome.choices);
    if (outcome.commit)
      await sendMessage(chatId, await commit(outcome.commit.flow, outcome.commit.data, today));
    if (outcome.command) await sendMessage(chatId, await runCommand(outcome.command));
  } catch (error) {
    console.error('telegram', error);
    const reason = error instanceof Error ? error.message : 'Unknown error';
    await sendMessage(chatId, `Something went wrong: ${reason}`).catch(() => {});
  }
  return Response.json({ ok: true });
}
