import type { NextApiRequest, NextApiResponse } from 'next';
import {
  findDiscoverTags,
  type DiscoverQuery,
  type Error as ErrorType
} from '@tag-vault/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiscoverQuery | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=3600'
    );
    return res.status(200).json(await findDiscoverTags());
  } catch (error) {
    console.error('discover error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
