import { getDb, type DiscordUser } from '@tag-vault/db';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const DISCORD_FETCH_TIMEOUT_MS = 5000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ discord_id: string }> }
) {
  const { discord_id } = await params;
  if (!/^\d{15,20}$/.test(discord_id)) {
    return Response.json({ error: 'Invalid discord_id' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection('Users');
    const cached = await collection.findOne({ id: discord_id });
    const cacheHeaders = { 'Cache-Control': 'public, max-age=3600' };

    if (
      cached &&
      Date.now() - new Date(cached.lastFetched).getTime() < ONE_DAY_MS
    ) {
      return Response.json(toDiscordUser(cached), { headers: cacheHeaders });
    }

    try {
      const userData = await fetchUserData(discord_id);
      await collection.updateOne(
        { id: discord_id },
        { $set: { ...userData, lastFetched: new Date() } },
        { upsert: true }
      );
      return Response.json(userData, { headers: cacheHeaders });
    } catch (error) {
      if (!cached) throw error;
      // Fall back to stale cached data on Discord fetch failure
      return Response.json(toDiscordUser(cached));
    }
  } catch (error) {
    console.error('discord user error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
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
