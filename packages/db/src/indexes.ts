import type { IndexDescription } from 'mongodb';
import { getDb } from './client';

const INDEXES: Record<string, IndexDescription[]> = {
  Tags: [
    { key: { id: 1 } },
    { key: { owner_id: 1, created_at: -1 } },
    { key: { uses: -1 } },
    { key: { created_at: -1 } },
    { key: { last_fetched: -1 } }
  ],
  Users: [{ key: { id: 1 }, unique: true }],
  RemovedTags: [{ key: { id: 1 }, unique: true }],
  HiddenTags: [{ key: { id: 1 }, unique: true }, { key: { owner_id: 1 } }],
  Favorites: [
    { key: { user_id: 1, tag_id: 1 }, unique: true },
    { key: { user_id: 1, created_at: -1 } },
    { key: { tag_id: 1 } }
  ],
  RateLimits: [{ key: { expires_at: 1 }, expireAfterSeconds: 0 }]
};

export async function ensureIndexes(): Promise<Record<string, string[]>> {
  const db = await getDb();
  const created: Record<string, string[]> = {};
  for (const [collection, indexes] of Object.entries(INDEXES)) {
    created[collection] = await db
      .collection(collection)
      .createIndexes(indexes);
  }
  return created;
}
