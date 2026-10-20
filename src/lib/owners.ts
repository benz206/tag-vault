import { after } from 'next/server';
import {
  attachOwners,
  getOwners,
  refreshOwners,
  type Owner,
  type TagListItem,
  type TagSummary
} from '@tag-vault/db';

async function resolve(ownerIds: string[]) {
  const { owners, stale } = await getOwners(ownerIds);
  if (stale.length > 0) after(() => refreshOwners(stale));
  return owners;
}

export async function withOwners(tags: TagSummary[]): Promise<TagListItem[]> {
  return attachOwners(tags, await resolve(tags.map((tag) => tag.owner_id)));
}

export async function getOwner(ownerId: string): Promise<Owner> {
  return (await resolve([ownerId])).get(ownerId)!;
}
