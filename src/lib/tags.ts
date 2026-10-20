import type { TagData } from '@tag-vault/db';

export function isPublic(tag: TagData): boolean {
  return !tag.deleted && !tag.nsfw && !tag.hidden && tag.safe !== 'not_safe';
}
