import type { NextApiRequest, NextApiResponse } from 'next';
import type { Error as ErrorType, TagBatchQuery, TagSummary } from '@/types';
import { getSession } from '@/lib/auth';
import { TAG_SUMMARY_PROJECTION, toTagSummary } from '@/lib/tags';
import { getDb } from '@/utils/mongodb/mongo';

const MAX_IDS = 50;

function parseIds(value: string | string[] | undefined): number[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : value;
  const ids = raw
    .split(',')
    .filter((v) => /^\d+$/.test(v.trim()))
    .map(Number);
  return Array.from(new Set(ids));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagBatchQuery | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ids = parseIds(req.query.ids);
  if (ids.length === 0) {
    return res.status(400).json({ error: 'Invalid ids' });
  }
  if (ids.length > MAX_IDS) {
    return res.status(400).json({ error: 'Too many ids' });
  }

  try {
    const session = await getSession(req, res);
    const viewerId = session?.user?.id;
    const publicOnly = { deleted: { $ne: true }, nsfw: false };

    const db = await getDb();
    const docs = await db
      .collection('Tags')
      .find(
        {
          id: { $in: ids },
          safe: { $ne: 'not_safe' },
          ...(viewerId
            ? { $or: [{ owner_id: viewerId }, publicOnly] }
            : publicOnly)
        },
        { projection: TAG_SUMMARY_PROJECTION }
      )
      .toArray();

    const byId = new Map<number, TagSummary>();
    for (const doc of docs) byId.set(Number(doc.id), toTagSummary(doc));
    const tags = ids.flatMap((id) => byId.get(id) ?? []);

    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json({ tags });
  } catch (error) {
    console.error('batch tags error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
