import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findOwnerTags,
  type Error as ErrorType,
  type OwnerTagsQuery
} from '@tag-vault/db';
import { requireSession } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OwnerTagsQuery | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { owner_id } = req.query;
  if (!owner_id || Array.isArray(owner_id) || !/^\d+$/.test(owner_id)) {
    return res.status(400).json({ error: 'Invalid Owner ID' });
  }

  const session = await requireSession(req, res);
  if (!session) return;
  if (session.user.id !== owner_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    return res.status(200).json({ tags: await findOwnerTags(owner_id) });
  } catch (error) {
    console.error('owner tags error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
