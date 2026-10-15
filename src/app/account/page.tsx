import { redirect } from 'next/navigation';
export default async function FormerAccount({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  if (params.tab === 'projects') redirect('/share');
  if (params.tab === 'collaborate') redirect('/collaborate');
  redirect('/connect' + (params.next ? '?next=' + encodeURIComponent(params.next) : ''));
}
