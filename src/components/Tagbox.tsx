import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import type { DiscordUser, TagSummary } from "@/types";
import { getTagColor, formatDate } from "@/utils";
import Pill from "@/components/Pill";

const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";
const ROW_CLASSES =
    "relative grid items-center gap-x-6 gap-y-1.5 py-4 pl-6 pr-5 sm:grid-cols-[14rem_minmax(0,1fr)_auto]";

export default function Tagbox({ tag }: { tag: TagSummary }) {
    const { data: userData } = useSWR<DiscordUser>(
        `/api/discord/users/${tag.owner_id}`
    );

    const color = getTagColor(tag.id, Number(tag.owner_id));
    const avatarUrl = userData?.avatar
        ? `https://cdn.discordapp.com/avatars/${tag.owner_id}/${userData.avatar}.webp?size=32`
        : DEFAULT_AVATAR;

    return (
        <Link
            href={`/tags/${tag.id}`}
            className={`${ROW_CLASSES} transition-colors hover:bg-subtle focus-visible:-outline-offset-2`}
        >
            <span
                className={`absolute left-0 w-[3px] rounded-r inset-y-3 bg-${color}`}
                aria-hidden="true"
            />
            <div className="flex items-center min-w-0 gap-2">
                <span className="font-mono text-sm truncate text-ink">
                    {tag.tag_name}
                </span>
                {!tag.shared && <Pill>Private</Pill>}
                {tag.nsfw && <Pill>NSFW</Pill>}
            </div>
            <p className="text-sm line-clamp-2 sm:line-clamp-1 text-ink-3">
                {tag.description || "No description"}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted tabular-nums">
                <span className="flex items-center min-w-0 gap-1.5">
                    <Image
                        className="rounded-full"
                        src={avatarUrl}
                        alt=""
                        width={16}
                        height={16}
                        unoptimized
                    />
                    <span className="truncate max-w-28">
                        {userData?.global_name ||
                            userData?.username ||
                            "Unknown"}
                    </span>
                </span>
                <span className="whitespace-nowrap">
                    {tag.uses.toLocaleString()} uses
                </span>
                <span className="whitespace-nowrap sm:hidden lg:inline">
                    {formatDate(new Date(tag.created_at))}
                </span>
            </div>
        </Link>
    );
}

export function TagboxSkeleton() {
    return (
        <div className={ROW_CLASSES} aria-hidden="true">
            <div className="w-32 h-4 rounded animate-pulse bg-line" />
            <div className="w-3/4 h-4 rounded animate-pulse bg-chip" />
            <div className="w-40 h-4 rounded animate-pulse bg-chip" />
        </div>
    );
}
