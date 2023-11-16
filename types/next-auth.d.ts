import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            avatar: string;
            email: string;
            image: string;
        };
    }

    interface Profile {
        id: string;
        name: string;
        avatar: string;
        email: string;
        image: string;
    }
}
