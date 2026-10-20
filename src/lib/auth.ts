import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord';

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  NEXTAUTH_URL,
  NODE_ENV
} = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
  throw new Error(
    'DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET must be set in env'
  );
}

if (!NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set in env');
}

if (NODE_ENV === 'production' && !NEXTAUTH_URL) {
  console.warn(
    '[auth] NEXTAUTH_URL is not set; sign-in redirects may break behind proxies'
  );
}

function discordAvatarUrl(profile: DiscordProfile): string {
  if (!profile.avatar) {
    const fallback =
      (Number(profile.discriminator) || Number(BigInt(profile.id) >> 22n)) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${fallback}.png`;
  }
  const animated = profile.avatar.startsWith('a_');
  const ext = animated ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${ext}?size=128`;
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      issuer: 'https://discord.com',
      authorization: {
        params: { scope: 'identify email', prompt: 'none' }
      },
      profile(profile: DiscordProfile) {
        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: discordAvatarUrl(profile)
        };
      }
    })
  ],
  secret: NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  debug: NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`[auth:error] ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[auth:warn] ${code}`);
    },
    debug() {}
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && (profile?.id || user?.id)) {
        token.id = (profile?.id ?? user?.id) as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const id = token.id ?? token.sub;
        if (id) session.user.id = id;
      }
      return session;
    }
  }
};

export function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, authOptions);
}

export async function requireSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  const session = await getSession(req, res);
  if (!session?.user?.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}
