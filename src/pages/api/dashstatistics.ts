import type { NextApiRequest, NextApiResponse } from 'next';
import { getOwnerStats, type OwnerStats } from '@tag-vault/db';
import { requireSession } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OwnerStats | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await requireSession(req, res);
  if (!session) return;

  try {
    return res.status(200).json(await getOwnerStats(session.user.id));
  } catch (error) {
    console.error('dashstatistics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
