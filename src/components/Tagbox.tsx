import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import type { DiscordUser, TagSummary } from "@/types";
import { getTagColor, formatDate } from "@/utils";

const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";
const CARD_CLASSES =
    "flex flex-col rounded-xl p-6 lg:p-8 bg-slate-700 w-80 lg:w-[430px] h-52 lg:h-72 border-t-8 shadow-xl";

export default function Tagbox({ tag }: { tag: TagSummary }) {
    const { data: userData } = useSWR<DiscordUser>(
        `/api/discord/users/${tag.owner_id}`
    );

    const color = getTagColor(tag.id, Number(tag.owner_id));
    const avatarUrl = userData?.avatar
        ? `https://cdn.discordapp.com/avatars/${tag.owner_id}/${userData.avatar}.webp?size=64`
        : DEFAULT_AVATAR;

    return (
        <Link
            href={`/tags/${tag.id}`}
            className={`${CARD_CLASSES} border-${color} shadow-${color} transition-transform duration-300 ease-spring hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
        >
            <div className="flex items-center gap-2">
                <h2 className="text-2xl truncate lg:text-4xl">
                    {tag.tag_name}
                </h2>
                <div className="flex items-center gap-2 ml-auto shrink-0">
                    <span className="px-2 py-0.5 text-xs rounded-md bg-slate-600">
                        {tag.uses} uses
                    </span>
                    {!tag.shared && (
                        <span className="px-2 py-0.5 text-xs rounded-md bg-amber-700">
                            Private
                        </span>
                    )}
                    {tag.nsfw && (
                        <span className="px-2 py-0.5 text-xs rounded-md bg-rose-700">
                            NSFW
                        </span>
                    )}
                    <Image
                        className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
                        src={avatarUrl}
                        alt={
                            userData?.global_name ||
                            userData?.username ||
                            "Tag owner"
                        }
                        width={48}
                        height={48}
                        unoptimized
                    />
                </div>
            </div>
            <div className="w-full h-0.5 my-2 bg-slate-600 rounded-2xl" />
            <p className="text-base break-words line-clamp-2 lg:line-clamp-4 lg:text-lg">
                {tag.description}
            </p>
            <div className="pt-1.5 mt-auto border-t-2 border-slate-600">
                <div className="flex gap-4 place-content-between">
                    <p className="text-sm truncate text-slate-400">
                        {userData?.global_name || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-400">
                        {formatDate(new Date(tag.created_at))}
                    </p>
                    <p className="text-sm text-slate-400 shrink-0">
                        ID: {tag.id}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export function TagboxSkeleton() {
    return (
        <div className={`${CARD_CLASSES} border-slate-500`}>
            <div className="flex items-center">
                <div className="w-3/4 h-6 lg:h-10 animate-pulse rounded-xl bg-slate-500" />
                <div className="w-8 h-8 ml-auto rounded-full lg:w-12 lg:h-12 animate-pulse bg-slate-500" />
            </div>
            <div className="w-full h-0.5 my-2 bg-slate-600 rounded-2xl" />
            <div className="w-full h-4 mb-2 lg:h-5 animate-pulse rounded-xl bg-slate-400" />
            <div className="w-2/3 h-4 lg:h-5 animate-pulse rounded-xl bg-slate-400" />
            <div className="flex pt-2 mt-auto space-x-4 border-t-2 border-slate-600">
                <div className="w-4/12 h-4 animate-pulse rounded-xl bg-slate-500" />
                <div className="w-3/12 h-4 animate-pulse rounded-xl bg-slate-500" />
                <div className="w-3/12 h-4 ml-auto animate-pulse rounded-xl bg-slate-500" />
            </div>
        </div>
    );
}
