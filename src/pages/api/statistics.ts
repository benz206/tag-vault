import type { NextApiRequest, NextApiResponse } from 'next';
import { getStatistics, type Statistics } from '@tag-vault/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Statistics | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
    return res.status(200).json(await getStatistics());
  } catch (error) {
    console.error('statistics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
