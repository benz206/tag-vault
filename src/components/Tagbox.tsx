import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DiscordUser, TagData } from "@/types";
import { getTagData, getTagColor, formatDate, getDiscordUser } from "@/utils";

export default function Tagbox({ id }: { id: number }) {
    const router = useRouter();
    const [tagData, setTagData] = useState<TagData | null>(null);
    const [userData, setUserData] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getTagData(Number(id))
            .then((result) => {
                setTagData(result);
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
        <div
            className={`rounded-xl p-8 bg-slate-700 w-80 lg:w-128 h-52 lg:h-72 border-t-8 border-${color} shadow-${color} shadow-xl hover:scale-110 hover:cursor-pointer transform transition-transform duration-440 mb-12 lg:m-0`}
            onClick={() => router.push("/tags/" + id)}
        >
            {loading ? (
                <>
                    <div className="flex flex-row mb-2 -top-4">
                        <div className="animate-pulse h-12 w-3/4 rounded-xl bg-slate-500 mb-6" />
                        <div className="animate-pulse h-12 w-12 rounded-full ml-auto bg-slate-500" />
                    </div>
                    <div className="animate-pulse h-4 w-full rounded-xl bg-slate-400 mb-4" />
                    <div className="animate-pulse h-4 w-full rounded-xl bg-slate-400 mb-4" />
                    <div className="animate-pulse h-4 w-full rounded-xl bg-slate-400 mb-4" />
                    <div className="absolute bottom-4 left-6 flex w-10/12 lg:w-11/12 flex-row space-x-4 bottom-2">
                        <div className="animate-pulse h-4 w-4/12 lg:w-5/12 rounded-xl bg-slate-500 mb-2" />
                        <div className="animate-pulse h-4 w-3/12 rounded-xl bg-slate-500 mb-2" />
                        <div className="animate-pulse h-4 w-3/12 rounded-xl bg-slate-500 mb-2 justify-self-end" />
                    </div>
                </>
            ) : tagData ? (
                <>
                    <div className="flex flex-row mb-2 -top-2 relative">
                        <h2 className="truncate text-2xl lg:text-4xl">
                            {tagData.tag_name}
                        </h2>
                        <img
                            className="h-8 w-8 lg:h-12 lg:w-12 rounded-full ml-auto"
                            src={`https://cdn.discordapp.com/avatars/${tagData.owner_id}/${userData?.avatar}`}
                        />
                    </div>
                    <p className="line-clamp-3 lg:line-clamp-5 text-base lg:text-lg">
                        {tagData.description}
                    </p>
                    <div className="absolute bottom-4 left-6 flex w-10/12 lg:w-11/12">
                        <div className="flex-2">
                            <p className="text-sm text-slate-400 text-left">
                                {userData?.global_name}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 text-center lg:text-right">
                                {formatDate(new Date(tagData.created_at))}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 ml-4 text-right">
                                ID: {tagData.id}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="truncate text-2xl lg:text-5xl mb-4">
                        Well well well...
                    </h2>
                    <p className="text-base lg:text-lg">
                        Sorry! Seem's like this tag failed to load...
                    </p>
                </>
            )}
        </div>
    );
}
