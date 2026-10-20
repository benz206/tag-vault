import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useSession, signIn } from "next-auth/react";
import type { DiscoverQuery, Statistics, TagBatchQuery } from "@/types";
import DiscoverTabs from "@/components/DiscoverTabs";
import RandomTagButton from "@/components/RandomTagButton";
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
    const { data: featured, error: featuredError } = useSWR<TagBatchQuery>(
        `/api/tags/batch?ids=${featuredTagIds.join(",")}`
    );
    const { data: discover, error: discoverError } =
        useSWR<DiscoverQuery>("/api/tags/discover");

    return (
        <>
            <Head>
                <title>TagVault — find TagScript tags</title>
            </Head>
            <div className="max-w-6xl px-4 mx-auto sm:px-6">
                <section className="grid items-center gap-12 pt-16 pb-14 lg:grid-cols-[1.1fr_1fr] lg:pt-24 motion-safe:animate-rise">
                    <div>
                        <h1 className="text-5xl leading-[1.05] tracking-[-0.03em] text-balance sm:text-[64px]">
                            TagScript tags, ready to copy.
                        </h1>
                        <p className="max-w-lg mt-5 text-xl leading-snug text-muted text-pretty">
                            Browse thousands of Carl-bot tags shared across
                            Discord servers, then use them in your own.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-8">
                            <Link
                                href="/search"
                                className={buttonClass("primary")}
                            >
                                Search tags
                            </Link>
                            {session ? (
                                <Link
                                    href="/dashboard"
                                    className={buttonClass()}
                                >
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
                            <RandomTagButton />
                        </div>
                        <div className="mt-10">
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
                        </div>
                    </div>
                    <Link
                        href={`/tags/${heroTag.id}`}
                        className="relative block min-w-0 overflow-hidden transition bg-surface border shadow-sm rounded-xl border-line hover:shadow-md"
                    >
                        <span
                            className={`absolute inset-x-0 top-0 h-[3px] bg-${heroTag.color}`}
                            aria-hidden="true"
                        />
                        <div className="flex items-center px-5 border-b h-12 border-line">
                            <span className="font-mono text-sm">
                                {heroTag.name}
                            </span>
                            <span className="ml-auto text-sm text-muted">
                                Open tag
                            </span>
                        </div>
                        <pre className="px-5 py-4 font-mono text-[13px] leading-6 break-words whitespace-pre-wrap bg-subtle text-ink-2">
                            <TagScriptCode source={heroTag.snippet} />
                        </pre>
                    </Link>
                </section>
                <section className="pt-10 pb-20">
                    <h2 className="mb-6 text-[28px] leading-8 tracking-tight">
                        Discover tags.{" "}
                        <span className="text-faint">
                            Hand-picked, most used, and newest.
                        </span>
                    </h2>
                    <DiscoverTabs
                        tabs={[
                            {
                                key: "featured",
                                label: "Featured",
                                tags: featured?.tags,
                                error: featuredError,
                            },
                            {
                                key: "popular",
                                label: "Most used",
                                tags: discover?.popular,
                                error: discoverError,
                            },
                            {
                                key: "newest",
                                label: "Newest",
                                tags: discover?.newest,
                                error: discoverError,
                            },
                        ]}
                    />
                </section>
            </div>
        </>
    );
}
