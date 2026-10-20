import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import type { DiscordUser, TagSummary } from "@/types";
import { getTagColor, formatDate } from "@/utils";
import Pill from "@/components/Pill";

export type TagColumn = "description" | "owner" | "uses" | "created";

const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

function useOwner(ownerId: string) {
    const { data } = useSWR<DiscordUser>(`/api/discord/users/${ownerId}`);
    return {
        name: data?.global_name || data?.username || "Unknown",
        avatarUrl: data?.avatar
            ? `https://cdn.discordapp.com/avatars/${ownerId}/${data.avatar}.webp?size=32`
            : DEFAULT_AVATAR,
    };
}

export function rowTemplate(columns: TagColumn[]): string {
    const show = (column: TagColumn) => columns.includes(column);
    return [
        show("description") ? "minmax(0,13rem)" : "minmax(0,1fr)",
        show("description") && "minmax(0,1fr)",
        show("owner") && "minmax(0,9rem)",
        show("uses") && "4.5rem",
        show("created") && "6.5rem",
    ]
        .filter(Boolean)
        .join(" ");
}

function Owner({ ownerId }: { ownerId: string }) {
    const owner = useOwner(ownerId);
    return (
        <span className="flex items-center min-w-0 gap-1.5">
            <Image
                className="rounded-full shrink-0"
                src={owner.avatarUrl}
                alt=""
                width={16}
                height={16}
                unoptimized
            />
            <span className="truncate">{owner.name}</span>
        </span>
    );
}

function TagName({ tag }: { tag: TagSummary }) {
    return (
        <div className="flex items-center min-w-0 gap-2">
            <span className="font-mono text-sm truncate text-ink">
                {tag.tag_name}
            </span>
            {!tag.shared && <Pill>Private</Pill>}
            {tag.nsfw && <Pill>NSFW</Pill>}
        </div>
    );
}

export function TagRow({
    tag,
    columns,
}: {
    tag: TagSummary;
    columns: TagColumn[];
}) {
    const show = (column: TagColumn) => columns.includes(column);
    return (
        <Link
            href={`/tags/${tag.id}`}
            style={{ gridTemplateColumns: rowTemplate(columns) }}
            className="relative grid items-center py-4 pl-6 pr-5 text-sm transition-colors gap-x-6 hover:bg-subtle focus-visible:-outline-offset-2 max-sm:flex max-sm:flex-wrap max-sm:gap-y-1.5"
        >
            <span
                className={`absolute left-0 w-[3px] rounded-r inset-y-3 bg-${getTagColor(tag.id, Number(tag.owner_id))}`}
                aria-hidden="true"
            />
            <div className="max-sm:w-full">
                <TagName tag={tag} />
            </div>
            {show("description") && (
                <p className="line-clamp-2 sm:line-clamp-1 text-ink-3 max-sm:w-full">
                    {tag.description || "No description"}
                </p>
            )}
            {show("owner") && (
                <div className="text-xs text-muted">
                    <Owner ownerId={tag.owner_id} />
                </div>
            )}
            {show("uses") && (
                <span className="text-xs sm:text-right text-muted tabular-nums">
                    {tag.uses.toLocaleString()}
                    <span className="sm:hidden"> uses</span>
                </span>
            )}
            {show("created") && (
                <span className="text-xs sm:text-right text-muted tabular-nums">
                    {formatDate(new Date(tag.created_at))}
                </span>
            )}
        </Link>
    );
}

export function TagCard({
    tag,
    columns,
}: {
    tag: TagSummary;
    columns: TagColumn[];
}) {
    const show = (column: TagColumn) => columns.includes(column);
    return (
        <Link
            href={`/tags/${tag.id}`}
            className="relative flex flex-col h-full p-5 overflow-hidden transition border rounded-xl bg-surface border-line hover:border-line-strong hover:shadow-sm"
        >
            <span
                className={`absolute inset-x-0 top-0 h-[3px] bg-${getTagColor(tag.id, Number(tag.owner_id))}`}
                aria-hidden="true"
            />
            <TagName tag={tag} />
            {show("description") && (
                <p className="mt-2 text-sm line-clamp-3 text-ink-3">
                    {tag.description || "No description"}
                </p>
            )}
            {(show("owner") || show("uses") || show("created")) && (
                <div className="flex flex-wrap items-center pt-4 mt-auto text-xs gap-x-4 gap-y-1 text-muted tabular-nums">
                    {show("owner") && <Owner ownerId={tag.owner_id} />}
                    {show("uses") && (
                        <span>{tag.uses.toLocaleString()} uses</span>
                    )}
                    {show("created") && (
                        <span>{formatDate(new Date(tag.created_at))}</span>
                    )}
                </div>
            )}
        </Link>
    );
}

export function TagRowSkeleton() {
    return (
        <div className="flex items-center gap-6 py-4 pl-6 pr-5" aria-hidden="true">
            <div className="w-32 h-4 rounded animate-pulse bg-line" />
            <div className="flex-1 h-4 rounded animate-pulse bg-chip" />
        </div>
    );
}

export function TagCardSkeleton() {
    return (
        <div
            className="p-5 border h-36 rounded-xl bg-surface border-line"
            aria-hidden="true"
        >
            <div className="w-32 h-4 rounded animate-pulse bg-line" />
            <div className="w-full h-3 mt-4 rounded animate-pulse bg-chip" />
            <div className="w-2/3 h-3 mt-2 rounded animate-pulse bg-chip" />
        </div>
    );
}
