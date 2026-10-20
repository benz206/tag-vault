import type { AuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord';
import { avatarUrl, defaultAvatarUrl } from '@tag-vault/db';

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
          image: profile.avatar
            ? avatarUrl(profile.id, profile.avatar, 128)
            : defaultAvatarUrl(profile.id, profile.discriminator)
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

export function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
