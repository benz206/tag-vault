import type { NextApiRequest, NextApiResponse } from 'next';
import { findTag, type TagData } from '@tag-vault/db';
import { getSession } from '@/lib/auth';

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
    const tag = await findTag(Number(id));
    if (!tag) return res.status(404).json({ error: 'Tag ID Non Existent' });

    const isOwner = session?.user?.id === tag.owner_id;
    if (!isOwner) {
      if (tag.deleted) {
        return res.status(404).json({ error: 'Tag has been deleted' });
      }
      if (tag.nsfw) {
        return res.status(404).json({ error: 'Tag is NSFW' });
      }
    }
    if (tag.safe === 'not_safe') {
      return res
        .status(404)
        .json({ error: 'This tag is currently under review' });
    }

    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json(tag);
  } catch (error) {
    console.error('tag fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
