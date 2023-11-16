import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DiscordUser, TagData } from "@/types";
import { getTagData, getTagColor, formatDate, getDiscordUser } from "@/utils";
import { motion } from "framer-motion";

export default function Tagbox({
    id,
    staticData,
}: {
    id: number;
    staticData?: TagData;
}) {
    const router = useRouter();
    const [tagData, setTagData] = useState<TagData | null>(null);
    const [userData, setUserData] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (staticData) {
            // setTagData(staticData.tag);
            // setUserData(staticData.discord);
            // setColor(
            //     getTagColor(
            //         Number(staticData.tag.id),
            //         Number(staticData.tag.owner_id)
            //     )
            // );
            // setLoading(false);
        } else {
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
                            console.error(
                                "Error fetching data:",
                                discord_error
                            );
                            // Sleep 3 seconds then retry
                            setTimeout(() => {
                                getDiscordUser(result.owner_id)
                                    .then((discord_result) => {
                                        setUserData(discord_result);
                                    })
                                    .catch((discord_error) => {
                                        console.error(
                                            "Error fetching data:",
                                            discord_error
                                        );
                                    });
                            }, 3000);
                        });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    return (
        <motion.div
            className={`group rounded-xl p-8 bg-slate-700 w-80 lg:w-[430px] h-52 lg:h-72 border-t-8 border-${color} shadow-${color} shadow-xl hover:cursor-pointer ease-in-out mb-12 lg:m-4 2xl:m-0`}
            onClick={() => router.push("/tags/" + id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
            ) : tagData ? (
                <div className="flex flex-col h-full">
                    <div className="relative flex flex-row mb-2 -top-2">
                        <h2 className="text-2xl truncate lg:text-4xl">
                            {tagData.tag_name}
                        </h2>
                        <img
                            className="w-8 h-8 ml-auto -mt-1 rounded-full lg:h-12 lg:w-12"
                            src={`https://cdn.discordapp.com/avatars/${tagData.owner_id}/${userData?.avatar}`}
                        />
                    </div>
                    <div className="w-full h-0.5 mb-1.5 -mt-2 bg-slate-600 rounded-2xl" />
                    <p className="text-base line-clamp-3 lg:line-clamp-5 lg:text-lg">
                        {tagData.description}
                    </p>
                    <div className="relative flex flex-col w-full mt-auto -bottom-4">
                        <div className="w-full h-0.5 mb-1.5 bg-slate-600 rounded-2xl" />
                        <div className="flex place-content-between">
                            <p className="text-sm text-left text-slate-400">
                                {userData?.global_name || "Unknown"}
                            </p>
                            <p className="text-sm text-center text-slate-400 lg:text-righ">
                                {formatDate(new Date(tagData.created_at))}
                            </p>
                            <p className="ml-4 text-sm text-right text-slate-400">
                                ID: {tagData.id}
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
        </motion.div>
    );
}
