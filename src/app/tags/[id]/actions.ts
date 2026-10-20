'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  canView,
  findTag,
  removeTag,
  setFavorite,
  setTagHidden,
  type TagData
} from '@tag-vault/db';
import { getSession } from '@/lib/auth';

export type ActionResult = { error: string } | undefined;

async function requireOwnedTag(
  tagId: number
): Promise<TagData | { error: string }> {
  const session = await getSession();
  if (!session?.user?.id) return { error: 'Sign in to manage this tag.' };
  const tag = await findTag(tagId);
  if (!tag || tag === 'removed' || tag.owner_id !== session.user.id) {
    return { error: 'Only the owner can manage this tag.' };
  }
  return tag;
}

function revalidateTag(tagId: number) {
  revalidatePath(`/tags/${tagId}`);
  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function setFavoriteAction(
  tagId: number,
  favorite: boolean
): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user?.id) return { error: 'Sign in to favorite tags.' };
  const tag = await findTag(tagId);
  if (!tag || tag === 'removed' || !canView(tag, session.user.id)) {
    return { error: 'This tag is not available.' };
  }
  await setFavorite(session.user.id, tagId, favorite);
  revalidatePath(`/tags/${tagId}`);
  revalidatePath('/dashboard');
}

export async function setHiddenAction(
  tagId: number,
  hidden: boolean
): Promise<ActionResult> {
  const tag = await requireOwnedTag(tagId);
  if ('error' in tag) return tag;
  await setTagHidden(tag.id, tag.owner_id, hidden);
  revalidateTag(tag.id);
}

export async function deleteTagAction(tagId: number): Promise<ActionResult> {
  const tag = await requireOwnedTag(tagId);
  if ('error' in tag) return tag;
  await removeTag(tag.id, tag.owner_id, 'owner_request');
  revalidateTag(tag.id);
  redirect('/dashboard');
}
