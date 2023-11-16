import { useState, useEffect } from "react";
import { getDashStats } from "@/utils";
import { DashStats } from "@/types";
import { motion } from "framer-motion";

export default function DashStatsList() {
    const [statsData, setStatsData] = useState<DashStats | null>(null);

    useEffect(() => {
        getDashStats()
            .then((result) => {
                setStatsData(result);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="relative flex flex-col flex-wrap content-center justify-center w-full -mt-20 md:flex-row lg:space-x-18 lg:h-64">
            <motion.div
                key="1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0 }}
            >
                <motion.div
                    className="group flex flex-col p-6 mb-10 border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-fuchsia-400 border-fuchsia-400 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white transition-colors duration-500 ease-in-out lg:text-5xl group-hover:text-fuchsia-400">
                        Your Tags
                    </h2>
                    <p>
                        You currently have{" "}
                        <span className="font-bold text-fuchsia-400 animate-pulse">
                            {statsData?.tags ? (
                                <>{statsData.tags.public} public</>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        tags and{" "}
                        <span className="font-bold text-fuchsia-400 animate-pulse">
                            {statsData?.tags ? (
                                <>{statsData.tags.private} private</>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        tags. You also have{" "}
                        <span className="font-bold text-fuchsia-400 animate-pulse">
                            {statsData?.tags ? (
                                <>{statsData.tags.nsfw} nsfw</>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        that cannot be shared unless marked non nsfw.
                    </p>
                </motion.div>
            </motion.div>
            <motion.div
                key="2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <motion.div
                    className="group flex flex-col justify-center p-6 mb-10 border-t-8 border-amber-500 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-amber-500 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white duration-500 ease-in-out group-hover:text-amber-500 lg:text-5xl">
                        Total Uses
                    </h2>
                    <p>
                        Your tags have been used a combined total of{" "}
                        <span className="font-bold text-amber-500 animate-pulse">
                            {statsData ? <>{statsData.uses}</> : "loading..."}{" "}
                            times
                        </span>{" "}
                        commands, find what you need with ease.
                    </p>
                </motion.div>
            </motion.div>
            <motion.div
                key="3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
            >
                <motion.div
                    className="group flex flex-col justify-center p-6 border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-yellow-500 border-yellow-500 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white duration-500 ease-in-out group-hover:text-yellow-500 lg:text-5xl">
                        Favorites
                    </h2>
                    <p>
                        You have{" "}
                        <span className="font-bold text-yellow-500 animate-pulse">
                            {statsData ? (
                                <>{statsData.favorites} favorited</>
                            ) : (
                                "loading..."
                            )}{" "}
                        </span>
                        tags.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
