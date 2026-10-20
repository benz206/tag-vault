import type { NextApiRequest, NextApiResponse } from 'next';
import { DiscordUser } from '@/types';
import { getDb } from '@/utils/mongodb/mongo';

type ErrorRes = { error: string };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DISCORD_FETCH_TIMEOUT_MS = 5000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiscordUser | ErrorRes>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { discord_id } = req.query;
  if (
    !discord_id ||
    Array.isArray(discord_id) ||
    !/^\d{15,20}$/.test(discord_id)
  ) {
    return res.status(400).json({ error: 'Invalid discord_id' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('Users');
    const cached = await collection.findOne({ id: discord_id });

    if (
      cached &&
      Date.now() - new Date(cached.lastFetched).getTime() < ONE_DAY_MS
    ) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).json(toDiscordUser(cached));
    }

    try {
      const userData = await fetchUserData(discord_id);
      await collection.updateOne(
        { id: discord_id },
        { $set: { ...userData, lastFetched: new Date() } },
        { upsert: true }
      );
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).json(userData);
    } catch (error) {
      if (!cached) throw error;
      // Fall back to stale cached data on Discord fetch failure
      return res.status(200).json(toDiscordUser(cached));
    }
  } catch (error) {
    console.error('discord user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function toDiscordUser(cached: Record<string, unknown>): DiscordUser {
  return {
    id: cached.id as string,
    username: cached.username as string,
    avatar: cached.avatar as string,
    discriminator: cached.discriminator as string,
    public_flags: cached.public_flags as number,
    flags: cached.flags as number,
    banner: cached.banner as string | null,
    accent_color: cached.accent_color as number,
    global_name: cached.global_name as string,
    avatar_decoration_data: cached.avatar_decoration_data as null,
    banner_color: cached.banner_color as string
  };
}

async function fetchUserData(discordId: string): Promise<DiscordUser> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN is not set');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DISCORD_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/${discordId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      }
    );
    if (!response.ok) {
      throw new Error(
        `Discord API ${response.status} (reset-after: ${response.headers.get(
          'X-RateLimit-Reset-After'
        )})`
      );
    }
    return (await response.json()) as DiscordUser;
  } finally {
    clearTimeout(timer);
  }
}
