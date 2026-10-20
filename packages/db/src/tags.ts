import type { Document, Filter } from 'mongodb';
import { getDb } from './client';
import {
  getHiddenTagIds,
  getRemovedTagIds,
  isTagHidden,
  isTagRemoved,
  removeTag
} from './moderation';
import type { OwnerStats, Statistics, TagData, TagSummary } from './types';
import {
  PLACEHOLDER_CONTENT,
  visibleTagFilter,
  type ExcludedTagIds
} from './visibility';

export const TAG_SUMMARY_PROJECTION = {
  _id: 0,
  id: 1,
  created_at: 1,
  tag_name: 1,
  nsfw: 1,
  owner_id: 1,
  uses: 1,
  description: 1,
  restricted: 1,
  shared: 1,
  deleted: 1,
  safe: 1
} as const;

async function excludedTagIds(): Promise<ExcludedTagIds> {
  const [removed, hidden] = await Promise.all([
    getRemovedTagIds(),
    getHiddenTagIds()
  ]);
  return { removed, hidden };
}

async function publicFilter(): Promise<Filter<Document>> {
  return visibleTagFilter(await excludedTagIds());
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return value ? String(value) : '';
}

export function toTagSummary(doc: Document): TagSummary {
  return {
    id: Number(doc.id),
    created_at: toIso(doc.created_at),
    tag_name: String(doc.tag_name ?? ''),
    nsfw: Boolean(doc.nsfw),
    owner_id: String(doc.owner_id ?? ''),
    uses: Number(doc.uses ?? 0),
    description: doc.description ?? null,
    restricted: Boolean(doc.restricted),
    shared: Boolean(doc.shared),
    deleted: Boolean(doc.deleted),
    safe: String(doc.safe ?? ''),
    hidden: false
  };
}

export function toTagData(doc: Document): TagData {
  return {
    ...toTagSummary(doc),
    guild_id: String(doc.guild_id ?? ''),
    sharer: String(doc.sharer ?? ''),
    content: String(doc.content ?? ''),
    embed: String(doc.embed ?? ''),
    last_fetched: toIso(doc.last_fetched)
  };
}

async function tags() {
  return (await getDb()).collection('Tags');
}

export async function findTag(id: number): Promise<TagData | 'removed' | null> {
  const collection = await tags();
  const [removed, doc, hidden] = await Promise.all([
    isTagRemoved(id),
    collection.findOne({ id }),
    isTagHidden(id)
  ]);
  if (removed) return 'removed';
  if (!doc) return null;
  if (doc.content === PLACEHOLDER_CONTENT) {
    await removeTag(id, String(doc.owner_id ?? ''), 'not_found');
    return 'removed';
  }
  return { ...toTagData(doc), hidden };
}

export async function findTagSummaries(
  ids: number[],
  viewerId?: string
): Promise<TagSummary[]> {
  const docs = await (
    await tags()
  )
    .find(
      {
        $and: [
          { id: { $in: ids } },
          visibleTagFilter(await excludedTagIds(), viewerId)
        ]
      },
      { projection: TAG_SUMMARY_PROJECTION }
    )
    .toArray();
  const byId = new Map(docs.map((doc) => [Number(doc.id), toTagSummary(doc)]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

export async function searchTags(query: string): Promise<TagSummary[]> {
  const docs = await (
    await tags()
  )
    .aggregate([
      {
        $search: {
          index: 'default',
          text: { query, path: { wildcard: '*' } }
        }
      },
      { $match: await publicFilter() },
      { $limit: 50 },
      { $project: TAG_SUMMARY_PROJECTION }
    ])
    .toArray();
  return docs.map(toTagSummary);
}

export async function findDiscoverTags(limit = 12) {
  const [collection, filter] = await Promise.all([tags(), publicFilter()]);
  const find = (sort: Record<string, 1 | -1>) =>
    collection
      .find(filter, { projection: TAG_SUMMARY_PROJECTION })
      .sort(sort)
      .limit(limit)
      .toArray();
  const [popular, newest] = await Promise.all([
    find({ uses: -1 }),
    find({ created_at: -1 })
  ]);
  return {
    popular: popular.map(toTagSummary),
    newest: newest.map(toTagSummary)
  };
}

export async function findPublicTagIds(): Promise<
  { id: number; last_fetched: string }[]
> {
  const docs = await (
    await tags()
  )
    .find(await publicFilter(), {
      projection: { _id: 0, id: 1, last_fetched: 1 }
    })
    .toArray();
  return docs.map((doc) => ({
    id: Number(doc.id),
    last_fetched: toIso(doc.last_fetched)
  }));
}

export async function findRandomTagId(): Promise<number | null> {
  const [tag] = await (await tags())
    .aggregate([
      { $match: await publicFilter() },
      { $sample: { size: 1 } },
      { $project: { _id: 0, id: 1 } }
    ])
    .toArray();
  return tag ? Number(tag.id) : null;
}

export async function findOwnerTags(ownerId: string): Promise<TagSummary[]> {
  const hidden = new Set(await getHiddenTagIds(ownerId));
  const docs = await (
    await tags()
  )
    .find(
      {
        owner_id: ownerId,
        ...visibleTagFilter(
          { removed: await getRemovedTagIds(), hidden: [] },
          ownerId
        )
      },
      { projection: TAG_SUMMARY_PROJECTION }
    )
    .sort({ created_at: -1 })
    .toArray();
  return docs.map((doc) => ({
    ...toTagSummary(doc),
    hidden: hidden.has(Number(doc.id))
  }));
}

export async function getStatistics(): Promise<Statistics> {
  const collection = await tags();
  const [allTagCount, publicTagCount, latest] = await Promise.all([
    collection.estimatedDocumentCount(),
    collection.countDocuments({ shared: true }),
    collection.findOne(
      {},
      { sort: { last_fetched: -1 }, projection: { _id: 0, last_fetched: 1 } }
    )
  ]);
  const lastFetched = latest?.last_fetched as Date | undefined;
  return {
    all_tag_count: allTagCount,
    public_tag_count: publicTagCount,
    latest_last_fetched: lastFetched?.toISOString() ?? null
  };
}

export async function getOwnerStats(ownerId: string): Promise<OwnerStats> {
  const collection = await tags();
  const byOwner: Filter<Document> = { owner_id: ownerId };
  const [total, shared, nsfw, usesAgg] = await Promise.all([
    collection.countDocuments(byOwner),
    collection.countDocuments({ ...byOwner, shared: true }),
    collection.countDocuments({ ...byOwner, nsfw: true }),
    collection
      .aggregate([
        { $match: byOwner },
        { $group: { _id: null, total: { $sum: '$uses' } } }
      ])
      .toArray()
  ]);
  return {
    tags: { public: shared, private: total - shared, nsfw, total },
    uses: usesAgg[0]?.total ?? 0
  };
}
