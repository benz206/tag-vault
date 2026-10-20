import type { Document, Filter } from 'mongodb';
import type { TagSummary } from './types';

export const PLACEHOLDER_CONTENT =
  "Sorry! It doesn't seem like your tag was found...";

export type ExcludedTagIds = { removed: number[]; hidden: number[] };

type VisibilityFields = Pick<
  TagSummary,
  'owner_id' | 'deleted' | 'nsfw' | 'hidden' | 'safe'
>;

export function canView(tag: VisibilityFields, viewerId?: string): boolean {
  if (tag.safe === 'not_safe') return false;
  if (viewerId && tag.owner_id === viewerId) return true;
  return !tag.deleted && !tag.nsfw && !tag.hidden;
}

export function visibleTagFilter(
  { removed, hidden }: ExcludedTagIds,
  viewerId?: string
): Filter<Document> {
  const base = {
    safe: { $ne: 'not_safe' },
    content: { $ne: PLACEHOLDER_CONTENT }
  };
  const publicOnly = { deleted: { $ne: true }, nsfw: { $ne: true } };
  if (!viewerId) {
    return { ...base, ...publicOnly, id: { $nin: [...removed, ...hidden] } };
  }
  return {
    ...base,
    id: { $nin: removed },
    $or: [{ owner_id: viewerId }, { ...publicOnly, id: { $nin: hidden } }]
  };
}
