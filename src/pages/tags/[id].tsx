import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { TagData, DiscordUser } from "@/types";
import { getTagColor, formatDate } from "@/utils";
import CopyButton from "@/components/CopyButton";
import Pill from "@/components/Pill";
import TagScriptCode from "@/components/TagScriptCode";
import { buttonClass } from "@/components/buttons";

export default function TagPage() {
    const router = useRouter();
    const { id } = router.query;
    const numericId = typeof id === "string" ? Number(id) : NaN;
    const hasValidId = !!id && !isNaN(numericId);

    const { data, error, isLoading } = useSWR<TagData>(
        hasValidId ? `/api/tags/${numericId}` : null
    );

    const { data: userData } = useSWR<DiscordUser>(
        data?.owner_id ? `/api/discord/users/${data.owner_id}` : null
    );

    const loading = isLoading || (!data && !error);
    const hasEmbed = !!data?.embed && data.embed !== "{}";

    const avatarSrc = userData?.avatar
        ? `https://cdn.discordapp.com/avatars/${data?.owner_id}/${userData.avatar}.webp?size=64`
        : "https://cdn.discordapp.com/embed/avatars/0.png";

    return (
        <>
            <Head>
                <title>
                    {data ? `${data.tag_name} | TagVault` : "Tag | TagVault"}
                </title>
                {data?.description && (
                    <meta name="description" content={data.description} />
                )}
            </Head>
            <div className="max-w-6xl px-4 pt-14 pb-20 mx-auto sm:px-6 lg:pt-20">
                {loading ? (
                    <TagPageSkeleton />
                ) : data ? (
                    <>
                        <header className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-end">
                            <div className="relative min-w-0 pl-5">
                                <span
                                    className={`absolute left-0 w-[3px] rounded-full inset-y-1 bg-${getTagColor(
                                        data.id,
                                        Number(data.owner_id)
                                    )}`}
                                    aria-hidden="true"
                                />
                                <h1 className="text-4xl tracking-[-0.03em] break-all sm:text-5xl">
                                    {data.tag_name}
                                </h1>
                                {data.description && (
                                    <p className="max-w-2xl mt-3 text-lg break-words whitespace-pre-line text-muted">
                                        {data.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                    <Pill>
                                        {data.shared ? "Shared" : "Private"}
                                    </Pill>
                                    {data.nsfw && <Pill>NSFW</Pill>}
                                    {data.restricted && <Pill>Restricted</Pill>}
                                    {data.deleted && <Pill>Deleted</Pill>}
                                    {data.safe && <Pill>{data.safe}</Pill>}
                                </div>
                            </div>
                            <CopyButton
                                text={data.content}
                                label="Copy content"
                                variant="primary"
                                className="self-start sm:self-auto sm:ml-auto shrink-0"
                            />
                        </header>
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                            <div className="min-w-0 space-y-6">
                                <CodePanel title="Content" text={data.content} />
                                {hasEmbed && (
                                    <CodePanel title="Embed" text={data.embed} />
                                )}
                                <details className="text-sm group">
                                    <summary className="cursor-pointer select-none text-muted hover:text-ink">
                                        Raw JSON
                                    </summary>
                                    <pre className="p-4 mt-3 overflow-x-auto font-mono text-xs leading-5 bg-surface border rounded-xl whitespace-pre-wrap border-line text-ink-3">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </details>
                            </div>
                            <aside>
                                <dl className="self-start text-sm bg-surface border divide-y rounded-xl border-line divide-line">
                                    <Detail label="Owner">
                                        <span className="flex items-center justify-end gap-2 min-w-0">
                                            <Image
                                                className="rounded-full"
                                                src={avatarSrc}
                                                alt=""
                                                width={20}
                                                height={20}
                                                unoptimized
                                            />
                                            <span className="truncate">
                                                {userData?.global_name ||
                                                    userData?.username ||
                                                    "Unknown"}
                                            </span>
                                        </span>
                                    </Detail>
                                    <Detail label="Uses">
                                        {data.uses.toLocaleString()}
                                    </Detail>
                                    <Detail label="Created">
                                        {formatDate(new Date(data.created_at))}
                                    </Detail>
                                    <Detail label="Last fetched">
                                        {formatDate(new Date(data.last_fetched))}
                                    </Detail>
                                    <Detail label="Tag ID" mono>
                                        {String(data.id)}
                                    </Detail>
                                    <Detail label="Owner ID" mono>
                                        {data.owner_id}
                                    </Detail>
                                    <Detail label="Guild ID" mono>
                                        {data.guild_id || "None"}
                                    </Detail>
                                    <Detail label="Sharer ID" mono>
                                        {data.sharer || "None"}
                                    </Detail>
                                </dl>
                            </aside>
                        </div>
                    </>
                ) : (
                    <div className="py-24 text-center">
                        <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
                            Tag not found
                        </h1>
                        <p className="mt-2 text-muted">
                            It may have been deleted, made private, or be under
                            review.
                        </p>
                        <Link
                            href="/search"
                            className={`${buttonClass("primary")} mt-6`}
                        >
                            Search tags
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

function CodePanel({ title, text }: { title: string; text: string }) {
    const lineCount = text.split("\n").length;
    return (
        <section className="overflow-hidden bg-surface border rounded-xl border-line">
            <div className="flex items-center gap-3 px-5 border-b h-12 border-line">
                <h2 className="text-[15px]">{title}</h2>
                <span className="text-xs text-muted tabular-nums">
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                </span>
                <CopyButton
                    text={text}
                    label="Copy"
                    size="xs"
                    className="ml-auto"
                />
            </div>
            <pre className="px-5 py-4 overflow-auto font-mono text-[13px] leading-6 break-words whitespace-pre-wrap max-h-[36rem] bg-subtle text-ink-2">
                <TagScriptCode source={text} />
            </pre>
        </section>
    );
}

function Detail({
    label,
    mono = false,
    children,
}: {
    label: string;
    mono?: boolean;
    children: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-3">
            <dt className="text-muted shrink-0">{label}</dt>
            <dd
                className={`min-w-0 text-right truncate ${
                    mono ? "font-mono text-xs select-all" : ""
                }`}
            >
                {children}
            </dd>
        </div>
    );
}

function TagPageSkeleton() {
    return (
        <div aria-hidden="true">
            <div className="pb-10">
                <div className="w-56 h-8 rounded animate-pulse bg-line" />
                <div className="h-4 mt-4 rounded w-96 max-w-full animate-pulse bg-chip" />
            </div>
            <div className="border rounded-xl h-80 animate-pulse bg-subtle border-line" />
        </div>
    );
}
