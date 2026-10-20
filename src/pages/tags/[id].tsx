import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import { TagData, DiscordUser } from "@/types";
import { getTagColor, formatDate } from "@/utils";
import CopyButton from "@/components/CopyButton";

const CODE_BOX_CLASSES =
    "w-full p-3 my-2 font-mono text-sm resize-y text-slate-100 bg-slate-900 rounded-xl";

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

    const resolvedColor = data
        ? getTagColor(Number(data.id), Number(data.owner_id))
        : "slate-500";

    const loading = isLoading || (!data && !error);
    const hasEmbed = !!data?.embed && data.embed !== "{}";
    const ownerName = userData?.global_name || userData?.username;

    const avatarSrc = userData?.avatar
        ? `https://cdn.discordapp.com/avatars/${data?.owner_id}/${userData.avatar}.webp?size=128`
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
            <div
                className={`flex justify-center h-36 lg:h-80 w-full bg-${resolvedColor} items-center`}
            >
                <h1 className="relative max-w-full px-4 text-4xl truncate top-4 lg:-top-4 lg:text-9xl">
                    {data?.tag_name ?? (error ? "Not found" : "")}
                </h1>
            </div>
            <div className="flex justify-center motion-safe:animate-rise">
                <div
                    className={`rounded-xl p-6 lg:p-8 bg-slate-700 w-11/12 border-t-8 border-${resolvedColor} shadow-${resolvedColor} shadow-xl mt-6 lg:my-12`}
                >
                    {loading ? (
                        <>
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full animate-pulse bg-slate-500" />
                                <div className="w-1/3 h-6 ml-3 animate-pulse rounded-xl bg-slate-500" />
                            </div>
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                        </>
                    ) : data ? (
                        <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-3">
                                <Image
                                    className="rounded-full"
                                    src={avatarSrc}
                                    alt=""
                                    width={48}
                                    height={48}
                                    unoptimized
                                />
                                <div className="min-w-0 mr-auto">
                                    <p className="text-xs text-slate-300">
                                        Owner
                                    </p>
                                    <p className="truncate">
                                        {ownerName || data.owner_id}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-slate-600">
                                        {data.uses} uses
                                    </Badge>
                                    <Badge
                                        className={
                                            data.shared
                                                ? "bg-emerald-700"
                                                : "bg-amber-700"
                                        }
                                    >
                                        {data.shared ? "Shared" : "Private"}
                                    </Badge>
                                    {data.nsfw && (
                                        <Badge className="bg-rose-700">
                                            NSFW
                                        </Badge>
                                    )}
                                    {data.restricted && (
                                        <Badge className="bg-yellow-700">
                                            Restricted
                                        </Badge>
                                    )}
                                    {data.deleted && (
                                        <Badge className="bg-slate-800">
                                            Deleted
                                        </Badge>
                                    )}
                                    {data.safe && (
                                        <Badge className="bg-sky-700">
                                            {data.safe}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {data.description && (
                                <>
                                    <SectionHeading>Description</SectionHeading>
                                    <p className="text-base break-words whitespace-pre-line lg:text-lg">
                                        {data.description}
                                    </p>
                                </>
                            )}
                            <SectionHeading>Tag Content</SectionHeading>
                            <div className="flex flex-wrap items-center gap-2">
                                <CopyButton
                                    text={data.content}
                                    label="Copy content"
                                />
                                <CopyButton
                                    text={String(data.id)}
                                    label="Copy ID"
                                />
                                <CopyButton
                                    text={data.tag_name}
                                    label="Copy name"
                                />
                                <CopyButton
                                    text={data.owner_id}
                                    label="Copy owner"
                                />
                                {data.guild_id && (
                                    <CopyButton
                                        text={data.guild_id}
                                        label="Copy guild"
                                    />
                                )}
                            </div>
                            <textarea
                                readOnly
                                aria-label="Tag content"
                                value={data.content}
                                className={`${CODE_BOX_CLASSES} h-80`}
                            />
                            {hasEmbed && (
                                <>
                                    <SectionHeading>Embed</SectionHeading>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CopyButton
                                            text={data.embed}
                                            label="Copy embed"
                                        />
                                    </div>
                                    <textarea
                                        readOnly
                                        aria-label="Tag embed"
                                        value={data.embed}
                                        className={`${CODE_BOX_CLASSES} h-60`}
                                    />
                                </>
                            )}
                            <SectionHeading>Meta</SectionHeading>
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                <MetaCell label="ID" value={String(data.id)} />
                                <MetaCell
                                    label="Guild"
                                    value={data.guild_id || "N/A"}
                                />
                                <MetaCell
                                    label="Sharer"
                                    value={data.sharer || "N/A"}
                                />
                                <MetaCell
                                    label="Created"
                                    value={formatDate(
                                        new Date(data.created_at)
                                    )}
                                />
                                <MetaCell
                                    label="Last Fetched"
                                    value={formatDate(
                                        new Date(data.last_fetched)
                                    )}
                                />
                            </div>
                            <details className="mt-6">
                                <summary className="cursor-pointer select-none text-slate-300">
                                    Raw data
                                </summary>
                                <pre className="p-3 mt-3 overflow-x-auto font-mono text-sm whitespace-pre-wrap rounded-xl bg-slate-900">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </details>
                        </div>
                    ) : (
                        <>
                            <h2 className="mb-4 text-2xl truncate lg:text-5xl">
                                Well well well...
                            </h2>
                            <p className="text-base lg:text-lg">
                                Sorry! Looks like this tag failed to load.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function SectionHeading({ children }: { children: string }) {
    return (
        <h2 className="pt-4 pb-2 mt-4 text-xl border-t-2 lg:text-2xl border-slate-600">
            {children}
        </h2>
    );
}

function Badge({
    className,
    children,
}: {
    className: string;
    children: ReactNode;
}) {
    return (
        <span className={`px-2 py-0.5 text-xs rounded-md ${className}`}>
            {children}
        </span>
    );
}

function MetaCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 rounded-lg bg-slate-600">
            <p className="text-xs text-slate-300">{label}</p>
            <p className="text-sm break-all">{value}</p>
        </div>
    );
}
