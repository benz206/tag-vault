import { getDb } from './client';

export const PLACEHOLDER_CONTENT =
  "Sorry! It doesn't seem like your tag was found...";

export type RemovalReason = 'not_found' | 'owner_request';

type RemovedTag = {
  id: number;
  owner_id: string;
  reason: RemovalReason;
  removed_at: Date;
};

async function removedTags() {
  return (await getDb()).collection<RemovedTag>('RemovedTags');
}

export async function isTagRemoved(id: number): Promise<boolean> {
  return (await (await removedTags()).countDocuments({ id }, { limit: 1 })) > 0;
}

export async function getRemovedTagIds(): Promise<number[]> {
  return (await removedTags()).distinct('id');
}

export async function removeTag(
  id: number,
  ownerId: string,
  reason: RemovalReason
): Promise<void> {
  const db = await getDb();
  await (
    await removedTags()
  ).updateOne(
    { id },
    { $set: { id, owner_id: ownerId, reason, removed_at: new Date() } },
    { upsert: true }
  );
  await db.collection('Tags').deleteOne({ id });
}
