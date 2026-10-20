import { headers } from 'next/headers';
import { consumeRateLimit } from '@tag-vault/db';
import { getSession } from '@/lib/auth';
import { getClientIp } from '@/utils';

const SEARCHES_PER_MINUTE = 30;

export async function allowSearch(): Promise<boolean> {
  const [session, headerList] = await Promise.all([getSession(), headers()]);
  const who = session?.user?.id
    ? `user:${session.user.id}`
    : `ip:${getClientIp(headerList)}`;
  return consumeRateLimit(`search:${who}`, SEARCHES_PER_MINUTE, 60_000);
}
