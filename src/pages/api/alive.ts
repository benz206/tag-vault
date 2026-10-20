import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToMongo } from '@/utils/mongodb/mongo';

type Alive = { alive: boolean };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Alive>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ alive: false });
  }
  try {
    await connectToMongo();
    return res.status(200).json({ alive: true });
  } catch {
    return res.status(503).json({ alive: false });
  }
}
