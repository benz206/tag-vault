import Head from "next/head";
import useSWR from "swr";
import Taglist from "@/components/Taglist";
import StatStrip from "@/components/StatStrip";
import { DashStats, OwnerTagsQuery } from "@/types";
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
    const { data: stats } = useSWR<DashStats>(
        session ? "/api/dashstatistics" : null
    );

    return (
        <>
            <Head>
                <title>Dashboard | TagVault</title>
            </Head>
            <div className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:py-16">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Dashboard
                </h1>
                <p className="mt-2 text-neutral-400">
                    Tags you own, including private and NSFW ones.
                </p>
                <div className="mt-8">
                    <StatStrip
                        stats={[
                            {
                                label: "Tags",
                                value: stats?.tags.total.toLocaleString(),
                            },
                            {
                                label: "Shared",
                                value: stats?.tags.public.toLocaleString(),
                            },
                            {
                                label: "Private",
                                value: stats?.tags.private.toLocaleString(),
                            },
                            {
                                label: "NSFW",
                                value: stats?.tags.nsfw.toLocaleString(),
                            },
                            {
                                label: "Total uses",
                                value: stats?.uses.toLocaleString(),
                            },
                        ]}
                    />
                </div>
                <section className="mt-12">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight">
                        Your tags
                    </h2>
                    {ownerTagsData?.tags.length === 0 ? (
                        <div className="px-4 py-12 text-sm text-center border border-dashed rounded-lg border-neutral-800 text-neutral-400">
                            You don&apos;t own any tags yet. Tags you create
                            with Carl-bot will show up here.
                        </div>
                    ) : (
                        <Taglist ids={ownerTagsData?.tags ?? []} />
                    )}
                </section>
            </div>
        </>
    );
}
