import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useSession, signIn } from "next-auth/react";
import type { Statistics } from "@/types";
import Taglist from "@/components/Taglist";
import StatStrip from "@/components/StatStrip";
import TagScriptCode from "@/components/TagScriptCode";
import { buttonClass } from "@/components/buttons";
import { getTagColor, getTimeSince } from "@/utils";

const featuredTagIds = [1157946, 1111722, 1217391, 825576, 962280, 865606];

const heroTag = {
    id: 1157946,
    name: "buildembed",
    color: getTagColor(1157946, Number("149926720114262016")),
    snippet: `{=(COMMENT):User Settings}
{=(prefix):!}
{=(tagName):buildembed|be}
{=(defaultColor):2f3136}
{=(example):{prefix}{tagName} title:My title|desc:My description}`,
};

export default function Home() {
    const { data: session } = useSession();
    const { data: stats } = useSWR<Statistics>("/api/statistics");

    return (
        <>
            <Head>
                <title>TagVault — find TagScript tags</title>
            </Head>
            <div className="max-w-6xl px-4 mx-auto sm:px-6">
                <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24 motion-safe:animate-rise">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tighter text-balance sm:text-6xl">
                            TagScript tags, ready to copy.
                        </h1>
                        <p className="max-w-md mt-5 text-lg text-neutral-400 text-pretty">
                            Browse thousands of Carl-bot tags shared across
                            Discord servers. Open one, copy its content, and use
                            it in your own server.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-8">
                            <Link href="/search" className={buttonClass("primary")}>
                                Search tags
                            </Link>
                            {session ? (
                                <Link href="/dashboard" className={buttonClass()}>
                                    View your tags
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        signIn("discord", {
                                            callbackUrl: "/dashboard",
                                        })
                                    }
                                    className={buttonClass()}
                                >
                                    Sign in with Discord
                                </button>
                            )}
                        </div>
                    </div>
                    <Link
                        href={`/tags/${heroTag.id}`}
                        className="block min-w-0 overflow-hidden transition-colors border rounded-lg border-neutral-800 bg-neutral-950 hover:border-neutral-600"
                    >
                        <div className="flex items-center gap-2.5 px-4 border-b h-11 border-neutral-800">
                            <span
                                className={`size-2 rounded-full bg-${heroTag.color}`}
                                aria-hidden="true"
                            />
                            <span className="font-mono text-sm">
                                {heroTag.name}
                            </span>
                            <span className="ml-auto text-xs text-neutral-500">
                                Open tag
                            </span>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-[13px] leading-6 text-neutral-200">
                            <TagScriptCode source={heroTag.snippet} />
                        </pre>
                    </Link>
                </section>
                <StatStrip
                    stats={[
                        {
                            label: "Tags archived",
                            value: stats?.all_tag_count.toLocaleString(),
                        },
                        {
                            label: "Shared publicly",
                            value: stats?.public_tag_count.toLocaleString(),
                        },
                        {
                            label: "Last updated",
                            value: stats?.latest_last_fetched
                                ? `${getTimeSince(new Date(stats.latest_last_fetched))} ago`
                                : undefined,
                        },
                    ]}
                />
                <section className="py-16">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight">
                        Featured tags
                    </h2>
                    <Taglist ids={featuredTagIds} />
                </section>
            </div>
        </>
    );
}
