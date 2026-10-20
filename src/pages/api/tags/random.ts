import type { NextApiRequest, NextApiResponse } from 'next';
import { findRandomTagId, type Error as ErrorType } from '@tag-vault/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: number } | ErrorType>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const id = await findRandomTagId();
    if (id === null) return res.status(404).json({ error: 'No tags found' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ id });
  } catch (error) {
    console.error('random tag error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
