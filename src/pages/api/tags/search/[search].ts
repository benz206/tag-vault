import type { NextApiRequest, NextApiResponse } from 'next';
import {
  searchTags,
  type Error as ErrorType,
  type SearchQuery
} from '@tag-vault/db';
import { requireSession } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchQuery | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await requireSession(req, res);
  if (!session) return;

  const { search } = req.query;
  if (!search || Array.isArray(search)) {
    return res.status(400).json({ error: 'Invalid Search Query' });
  }
  if (search.length > 30) {
    return res.status(400).json({ error: 'Search query too long' });
  }

  try {
    return res.status(200).json({ search: await searchTags(search) });
  } catch (error) {
    console.error('search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
