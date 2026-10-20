import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth';
import { toTagData } from '@/lib/tags';
import { getDb } from '@/utils/mongodb/mongo';
import { TagData } from '@/types';

type ErrorRes = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagData | ErrorRes>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id) || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid Tag ID' });
  }

  try {
    const session = await getSession(req, res);
    const db = await getDb();
    const collection = db.collection('Tags');

    const raw = await collection.findOne({ id: Number(id) });
    if (!raw) return res.status(404).json({ error: 'Tag ID Non Existent' });

    const isOwner = session?.user?.id === raw.owner_id;
    if (!isOwner) {
      if (raw.deleted) {
        return res.status(404).json({ error: 'Tag has been deleted' });
      }
      if (raw.nsfw) {
        return res.status(404).json({ error: 'Tag is NSFW' });
      }
    }
    if (raw.safe === 'not_safe') {
      return res
        .status(404)
        .json({ error: 'This tag is currently under review' });
    }

    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json(toTagData(raw));
  } catch (error) {
    console.error('tag fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
