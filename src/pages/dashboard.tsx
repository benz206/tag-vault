import Head from "next/head";
import useSWR from "swr";
import Taglist from "@/components/Taglist";
import DashStatsList from "@/components/DashStatsList";
import { OwnerTagsQuery } from "@/types";
import { useSession, signIn } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("discord", { callbackUrl: "/dashboard" });
        },
    });

    const { data: ownerTagsData } = useSWR<OwnerTagsQuery>(
        session?.user?.id ? `/api/tags/owner/${session.user.id}` : null
    );

    return (
        <>
            <Head>
                <title>Dashboard | TagVault</title>
            </Head>
            <div className="flex flex-col items-center w-full h-full min-h-[calc(100vh-4rem)]">
                <div className="flex items-center justify-center w-full h-72 lg:h-[400px] bg-gradient-to-r from-cyan-500 to-blue-500">
                    <h1 className="relative text-6xl text-center -top-8 lg:text-9xl">
                        Dashboard
                    </h1>
                </div>
                <DashStatsList />
                <div
                    className="relative flex content-center justify-center w-full p-2 pt-20 motion-safe:animate-rise"
                    style={{ animationDelay: "900ms" }}
                >
                    <h1 className="text-5xl text-center lg:text-7xl">Tags</h1>
                </div>
                {ownerTagsData?.tags.length === 0 ? (
                    <p className="py-10 text-center">
                        You don&apos;t have any tags yet.
                    </p>
                ) : (
                    <Taglist ids={ownerTagsData?.tags ?? []} />
                )}
            </div>
        </>
    );
}
