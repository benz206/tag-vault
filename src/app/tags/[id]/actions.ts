'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { findTag, removeTag, setTagHidden } from '@tag-vault/db';
import { getSession } from '@/lib/auth';

async function requireOwnedTag(tagId: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error('Sign in to manage this tag.');
  const tag = await findTag(tagId);
  if (!tag || tag === 'removed' || tag.owner_id !== session.user.id) {
    throw new Error('Only the owner can manage this tag.');
  }
  return tag;
}

function revalidateTag(tagId: number) {
  revalidatePath(`/tags/${tagId}`);
  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function setHiddenAction(tagId: number, hidden: boolean) {
  const tag = await requireOwnedTag(tagId);
  await setTagHidden(tag.id, tag.owner_id, hidden);
  revalidateTag(tag.id);
}

export async function deleteTagAction(tagId: number) {
  const tag = await requireOwnedTag(tagId);
  await removeTag(tag.id, tag.owner_id, 'owner_request');
  revalidateTag(tag.id);
  redirect('/dashboard');
}
