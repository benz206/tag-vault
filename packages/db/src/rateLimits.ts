import { getDb } from './client';

type RateLimitWindow = { _id: string; count: number; expires_at: Date };

export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const window = await (await getDb())
    .collection<RateLimitWindow>('RateLimits')
    .findOneAndUpdate(
      { _id: `${key}:${windowStart}` },
      {
        $inc: { count: 1 },
        $setOnInsert: { expires_at: new Date(windowStart + windowMs) }
      },
      { upsert: true, returnDocument: 'after' }
    );
  return (window?.count ?? 0) <= limit;
}
