import NextAuth, { Account, Profile, Session } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { JWT } from "next-auth/jwt";

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID
                ? process.env.DISCORD_CLIENT_ID
                : "",
            clientSecret: process.env.DISCORD_CLIENT_SECRET
                ? process.env.DISCORD_CLIENT_SECRET
                : "",
        }),
    ],
    secret: process.env.SECRET || "",
    callbacks: {
        async jwt({
            token,
            account,
            profile,
        }: {
            token: JWT;
            account: Account | null;
            profile?: Profile | undefined | null;
        }) {
            if (account && profile) {
                token.id = profile.id;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id as string;

            return session;
        },
    },
};
export default NextAuth(authOptions);
