import { avatarUrl, defaultAvatarUrl } from './avatars';
import { getDb } from './client';
import type { Owner, TagSummary } from './types';

const FRESH_MS = 3 * 24 * 60 * 60 * 1000;
const INLINE_BUDGET_MS = 800;
const CONCURRENCY = 4;

type CachedUser = {
  id: string;
  username?: string;
  global_name?: string | null;
  avatar?: string | null;
  missing?: boolean;
  lastFetched?: Date;
};

const inflight = new Map<string, Promise<void>>();
let rateLimitedUntil = 0;

function toOwner(id: string, user: CachedUser | undefined): Owner {
  const avatar = user?.avatar;
  const fallbackAvatarUrl = defaultAvatarUrl(id);
  return {
    id,
    name: user?.global_name || user?.username || 'Unknown user',
    avatarUrl: avatar ? avatarUrl(id, avatar, 64) : fallbackAvatarUrl,
    fallbackAvatarUrl
  };
}

async function users() {
  return (await getDb()).collection<CachedUser>('Users');
}

async function fetchAndCache(id: string): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || Date.now() < rateLimitedUntil) return;

  const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
    headers: { Authorization: `Bot ${token}` },
    signal: AbortSignal.timeout(5000)
  });

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after')) || 5;
    rateLimitedUntil = Date.now() + retryAfter * 1000;
    return;
  }

  const collection = await users();
  if (response.status === 404) {
    await collection.updateOne(
      { id },
      { $set: { id, missing: true, lastFetched: new Date() } },
      { upsert: true }
    );
    return;
  }
  if (!response.ok) return;

  const user = (await response.json()) as CachedUser;
  await collection.updateOne(
    { id },
    {
      $set: {
        id,
        username: user.username,
        global_name: user.global_name ?? null,
        avatar: user.avatar ?? null,
        missing: false,
        lastFetched: new Date()
      }
    },
    { upsert: true }
  );
}

function refreshOne(id: string): Promise<void> {
  let pending = inflight.get(id);
  if (!pending) {
    pending = fetchAndCache(id)
      .catch((error) => console.error(`owner refresh ${id} failed:`, error))
      .finally(() => inflight.delete(id));
    inflight.set(id, pending);
  }
  return pending;
}

export async function refreshOwners(ids: string[]): Promise<void> {
  const queue = [...ids];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0 && Date.now() >= rateLimitedUntil) {
      await refreshOne(queue.shift()!);
    }
  });
  await Promise.all(workers);
}

async function readOwners(ids: string[]) {
  const docs = await (
    await users()
  )
    .find(
      { id: { $in: ids } },
      {
        projection: {
          _id: 0,
          id: 1,
          username: 1,
          global_name: 1,
          avatar: 1,
          missing: 1,
          lastFetched: 1
        }
      }
    )
    .toArray();
  return new Map(docs.map((doc) => [doc.id, doc]));
}

export async function getOwners(ids: string[]): Promise<{
  owners: Map<string, Owner>;
  stale: string[];
}> {
  const unique = [...new Set(ids)];
  let cached = await readOwners(unique);

  const missing = unique.filter((id) => !cached.has(id) && /^\d+$/.test(id));
  if (missing.length > 0) {
    await Promise.race([
      refreshOwners(missing),
      new Promise((resolve) => setTimeout(resolve, INLINE_BUDGET_MS))
    ]);
    cached = await readOwners(unique);
  }

  const now = Date.now();
  const stale = unique.filter((id) => {
    if (!/^\d+$/.test(id)) return false;
    const lastFetched = cached.get(id)?.lastFetched;
    return !lastFetched || now - new Date(lastFetched).getTime() > FRESH_MS;
  });

  return {
    owners: new Map(unique.map((id) => [id, toOwner(id, cached.get(id))])),
    stale
  };
}

export function attachOwners<T extends TagSummary>(
  tags: T[],
  owners: Map<string, Owner>
): (T & { owner: Owner })[] {
  return tags.map((tag) => ({ ...tag, owner: owners.get(tag.owner_id)! }));
}
