import type { NextApiRequest, NextApiResponse } from 'next';
import type { Error as ErrorType } from '@/types';
import { PUBLIC_TAG_FILTER } from '@/lib/tags';
import { getDb } from '@/utils/mongodb/mongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: number } | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await getDb();
    const [tag] = await db
      .collection('Tags')
      .aggregate([
        { $match: PUBLIC_TAG_FILTER },
        { $sample: { size: 1 } },
        { $project: { _id: 0, id: 1 } }
      ])
      .toArray();

    if (!tag) return res.status(404).json({ error: 'No tags found' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ id: Number(tag.id) });
  } catch (error) {
    console.error('random tag error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
