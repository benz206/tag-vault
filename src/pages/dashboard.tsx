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

    const { data: ownerTagsData, error: ownerTagsError } =
        useSWR<OwnerTagsQuery>(
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
            <div className="max-w-6xl px-4 pt-16 pb-20 mx-auto sm:px-6 lg:pt-20">
                <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
                    Dashboard
                </h1>
                <p className="mt-3 text-xl text-muted">
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
                    <h2 className="mb-6 text-[28px] leading-8 tracking-tight">
                        Your tags.{" "}
                        {ownerTagsData && (
                            <span className="text-faint">
                                {ownerTagsData.tags.length.toLocaleString()} in
                                total.
                            </span>
                        )}
                    </h2>
                    {ownerTagsData?.tags.length === 0 ? (
                        <div className="px-4 py-12 text-sm text-center bg-surface border border-dashed rounded-xl border-line-strong text-muted">
                            You don&apos;t own any tags yet. Tags you create
                            with Carl-bot will show up here.
                        </div>
                    ) : (
                        <Taglist
                            tags={ownerTagsData?.tags}
                            error={ownerTagsError}
                            defaultSortLabel="Newest"
                        />
                    )}
                </section>
            </div>
        </>
    );
}
