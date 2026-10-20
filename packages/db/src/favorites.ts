import { getDb } from './client';
import { findTagSummaries } from './tags';
import type { TagSummary } from './types';

type Favorite = {
  user_id: string;
  tag_id: number;
  created_at: Date;
};

async function favorites() {
  return (await getDb()).collection<Favorite>('Favorites');
}

export async function isFavorite(
  userId: string,
  tagId: number
): Promise<boolean> {
  return (
    (await (
      await favorites()
    ).countDocuments({ user_id: userId, tag_id: tagId }, { limit: 1 })) > 0
  );
}

export async function setFavorite(
  userId: string,
  tagId: number,
  favorite: boolean
): Promise<void> {
  const collection = await favorites();
  if (favorite) {
    await collection.updateOne(
      { user_id: userId, tag_id: tagId },
      {
        $setOnInsert: { user_id: userId, tag_id: tagId, created_at: new Date() }
      },
      { upsert: true }
    );
  } else {
    await collection.deleteOne({ user_id: userId, tag_id: tagId });
  }
}

export async function countTagFavorites(tagId: number): Promise<number> {
  return (await favorites()).countDocuments({ tag_id: tagId });
}

export async function findFavoriteTags(userId: string): Promise<TagSummary[]> {
  const ids = await (
    await favorites()
  )
    .find({ user_id: userId }, { projection: { _id: 0, tag_id: 1 } })
    .sort({ created_at: -1 })
    .map((favorite) => favorite.tag_id)
    .toArray();
  return ids.length > 0 ? findTagSummaries(ids, userId) : [];
}
