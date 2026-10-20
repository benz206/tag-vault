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

type HiddenTag = {
  id: number;
  owner_id: string;
  hidden_at: Date;
};

async function hiddenTags() {
  return (await getDb()).collection<HiddenTag>('HiddenTags');
}

export async function isTagHidden(id: number): Promise<boolean> {
  return (await (await hiddenTags()).countDocuments({ id }, { limit: 1 })) > 0;
}

export async function getHiddenTagIds(ownerId?: string): Promise<number[]> {
  return (await hiddenTags()).distinct(
    'id',
    ownerId ? { owner_id: ownerId } : {}
  );
}

export async function setTagHidden(
  id: number,
  ownerId: string,
  hidden: boolean
): Promise<void> {
  const collection = await hiddenTags();
  if (hidden) {
    await collection.updateOne(
      { id },
      { $set: { id, owner_id: ownerId, hidden_at: new Date() } },
      { upsert: true }
    );
  } else {
    await collection.deleteOne({ id });
  }
}

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
  await Promise.all([
    db.collection('Tags').deleteOne({ id }),
    (await hiddenTags()).deleteOne({ id })
  ]);
}
