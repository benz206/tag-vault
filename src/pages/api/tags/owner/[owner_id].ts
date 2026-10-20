import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSession } from '@/lib/auth';
import { TAG_SUMMARY_PROJECTION, toTagSummary } from '@/lib/tags';
import { getDb } from '@/utils/mongodb/mongo';
import { Error as ErrorType, OwnerTagsQuery } from '@/types';

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
    const db = await getDb();
    const collection = db.collection('Tags');
    const docs = await collection
      .find(
        { owner_id: String(owner_id), safe: { $ne: 'not_safe' } },
        { projection: TAG_SUMMARY_PROJECTION }
      )
      .sort({ created_at: -1 })
      .toArray();

    return res.status(200).json({ tags: docs.map(toTagSummary) });
  } catch (error) {
    console.error('owner tags error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
