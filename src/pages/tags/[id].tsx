import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TagData, DiscordUser } from "@/types";
import { getTagColor, formatDate, getDiscordUser } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import CopyButton from "@/components/CopyButton";

async function getData(id: number): Promise<TagData> {
    const { apiFetch } = await import("@/utils/api");
    return apiFetch<TagData>("/api/tags/" + id);
}

export default function TagPage() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<TagData | null>(null);
    const [userData, setUserData] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getData(Number(id))
            .then((result) => {
                setData(result);
                setColor(
                    getTagColor(Number(result.id), Number(result.owner_id))
                );
                getDiscordUser(result.owner_id)
                    .then((discord_result) => {
                        setUserData(discord_result);
                    })
                    .catch((discord_error) => {
                        console.error("Error fetching data:", discord_error);
                    });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            <div
                className={`flex justify-center h-36 lg:h-80 w-full bg-${
                    color ? color : "slate-500"
                } items-center`}
            >
                <h1 className="relative text-3xl top-2 lg:-top-4 lg:text-9xl">
                    {data?.tag_name}
                </h1>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex justify-center"
            >
                <div
                    className={`rounded-xl p-8 bg-slate-700 w-11/12 border-t-8 border-${
                        color ? color : "slate-500"
                    } shadow-${
                        color ? color : "slate-500"
                    } shadow-xl transform transition-transform duration-440 mt-4 lg:my-12`}
                >
                    {loading ? (
                        <>
                            <div className="flex flex-row mb-2 -top-4">
                                <div className="w-3/4 h-12 mb-6 animate-pulse rounded-xl bg-slate-500" />
                                <div className="w-12 h-12 ml-auto rounded-full animate-pulse bg-slate-500" />
                            </div>
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                            <div className="w-full h-4 mb-4 animate-pulse rounded-xl bg-slate-400" />
                            <div className="absolute flex flex-col w-10/12 bottom-2 left-6 lg:w-11/12">
                                <div className="w-full h-0.5 mb-4 mt-auto bg-slate-600 rounded-2xl" />
                                <div className="flex space-x-4">
                                    <div className="w-4/12 h-4 mb-2 animate-pulse lg:w-5/12 rounded-xl bg-slate-500" />
                                    <div className="w-3/12 h-4 mb-2 animate-pulse rounded-xl bg-slate-500" />
                                    <div className="w-3/12 h-4 mb-2 animate-pulse rounded-xl bg-slate-500 justify-self-end" />
                                </div>
                            </div>
                        </>
                    ) : data ? (
                        <div className="flex flex-col h-full">
                            <div className="relative flex flex-row items-start mb-2 -top-2">
                                <h2 className="text-2xl truncate lg:text-4xl">
                                    {data.tag_name}
                                </h2>
                                <div className="flex items-center ml-auto space-x-2">
                                    {data.uses !== undefined && (
                                        <span className="px-2 py-0.5 text-xs rounded-md bg-slate-600">
                                            {data.uses} uses
                                        </span>
                                    )}
                                    {data.shared === false && (
                                        <span className="px-2 py-0.5 text-xs rounded-md bg-amber-700">
                                            Private
                                        </span>
                                    )}
                                    {data.nsfw && (
                                        <span className="px-2 py-0.5 text-xs rounded-md bg-rose-700">
                                            NSFW
                                        </span>
                                    )}
                                    {data.restricted && (
                                        <span className="px-2 py-0.5 text-xs rounded-md bg-yellow-700">
                                            Restricted
                                        </span>
                                    )}
                                    {data.safe && (
                                        <span className="px-2 py-0.5 text-xs rounded-md bg-emerald-700">
                                            {data.safe}
                                        </span>
                                    )}
                                    <img
                                        className="w-8 h-8 rounded-full lg:h-12 lg:w-12"
                                        src={`https://cdn.discordapp.com/avatars/${data.owner_id}/${userData?.avatar}`}
                                    />
                                </div>
                            </div>
                            <div className="w-full h-0.5 mb-3 bg-slate-600 rounded-2xl" />
                            <h2 className="pb-2 truncate text-1xl lg:text-2xl">
                                Description
                            </h2>
                            <p className="text-base whitespace-pre-line line-clamp-10 lg:text-lg">
                                {data.description}
                            </p>
                            <div className="w-full h-0.5 mb-4 mt-3 bg-slate-600 rounded-2xl" />
                            <h2 className="pb-2 truncate text-1xl lg:text-2xl">
                                Tag Content
                            </h2>
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
                                disabled
                                className="w-full p-2 my-2 whitespace-pre-line resize-y h-80 bg-slate-400 rounded-2xl"
                            >
                                {data.content}
                            </textarea>
                            <div className="w-full h-0.5 mb-4 mt-3 bg-slate-600 rounded-2xl" />
                            <h2 className="pb-2 truncate text-1xl lg:text-2xl">
                                Meta
                            </h2>
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">ID</p>
                                    <p className="text-sm break-all">
                                        {data.id}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Owner
                                    </p>
                                    <p className="text-sm break-all">
                                        {userData?.global_name || data.owner_id}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Guild
                                    </p>
                                    <p className="text-sm break-all">
                                        {data.guild_id || "N/A"}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Sharer
                                    </p>
                                    <p className="text-sm break-all">
                                        {data.sharer || "N/A"}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Uses
                                    </p>
                                    <p className="text-sm">{data.uses}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Created
                                    </p>
                                    <p className="text-sm">
                                        {formatDate(new Date(data.created_at))}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Last Fetched
                                    </p>
                                    <p className="text-sm">
                                        {formatDate(
                                            new Date(data.last_fetched)
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-600">
                                    <p className="text-xs text-slate-300">
                                        Flags
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-md ${
                                                data.shared
                                                    ? "bg-emerald-700"
                                                    : "bg-amber-700"
                                            }`}
                                        >
                                            {data.shared ? "Shared" : "Private"}
                                        </span>
                                        {data.nsfw && (
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-rose-700">
                                                NSFW
                                            </span>
                                        )}
                                        {data.restricted && (
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-yellow-700">
                                                Restricted
                                            </span>
                                        )}
                                        {data.deleted && (
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800">
                                                Deleted
                                            </span>
                                        )}
                                        {data.safe && (
                                            <span className="px-2 py-0.5 text-xs rounded-md bg-sky-700">
                                                {data.safe}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {data.embed && (
                                <>
                                    <div className="w-full h-0.5 mb-4 mt-3 bg-slate-600 rounded-2xl" />
                                    <h2 className="pb-2 truncate text-1xl lg:text-2xl">
                                        Embed
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CopyButton
                                            text={data.embed}
                                            label="Copy embed"
                                        />
                                    </div>
                                    <textarea
                                        disabled
                                        className="w-full p-2 my-2 whitespace-pre-line resize-y h-60 bg-slate-400 rounded-2xl"
                                    >
                                        {data.embed}
                                    </textarea>
                                </>
                            )}
                            <div className="relative flex flex-col w-full mt-auto -bottom-4">
                                <div className="w-full h-0.5 mb-1.5 bg-slate-600 rounded-2xl" />
                                <div className="flex place-content-between">
                                    <p className="text-sm text-left text-slate-400">
                                        {userData?.global_name || "Unknown"}
                                    </p>
                                    <p className="text-sm text-center text-slate-400 lg:text-right">
                                        {formatDate(new Date(data.created_at))}
                                    </p>
                                    <p className="ml-4 text-sm text-right text-slate-400">
                                        ID: {data.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="mb-4 text-2xl truncate lg:text-5xl">
                                Well well well...
                            </h2>
                            <p className="text-base lg:text-lg">
                                Sorry! Seem's like this tag failed to load...
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
            <div className="flex justify-center">
                <div
                    className={`rounded-xl p-8 bg-slate-700 w-11/12 border-t-8 border-${
                        color ? color : "slate-500"
                    } shadow-${
                        color ? color : "slate-500"
                    } shadow-xl transform transition-transform duration-440 mt-4 lg:my-12`}
                >
                    {loading ? (
                        <p>Loading data...</p>
                    ) : data ? (
                        <details>
                            <summary className="cursor-pointer select-none">
                                Raw data
                            </summary>
                            <pre className="mt-3 whitespace-pre-wrap">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </details>
                    ) : (
                        <p>Sorry, but there was an error loading data.</p>
                    )}
                </div>
            </div>
        </>
    );
}
