import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findTagSummaries,
  type Error as ErrorType,
  type TagBatchQuery
} from '@tag-vault/db';
import { getSession } from '@/lib/auth';

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
    const tags = await findTagSummaries(ids, session?.user?.id);
    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json({ tags });
  } catch (error) {
    console.error('batch tags error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
