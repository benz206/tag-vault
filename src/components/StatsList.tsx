import { useState, useEffect } from "react";
import { getStats } from "@/utils";
import { Statistics } from "@/types";
import { motion } from "framer-motion";

function getTimeSince(startDate: Date): string {
    const currentDate = new Date();
    const seconds = Math.round(
        Math.abs(currentDate.getTime() - startDate.getTime()) / 1000
    );
    if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? "" : "s"}`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"}`;
    }
    const weeks = Math.floor(days / 7);
    if (weeks < 5) {
        return `${weeks} week${weeks === 1 ? "" : "s"}`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months} month${months === 1 ? "" : "s"}`;
    }
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? "" : "s"}`;
}

export default function StatsList() {
    const [statsData, setStatsData] = useState<Statistics | null>(null);

    useEffect(() => {
        getStats()
            .then((result) => {
                setStatsData(result);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="flex relative flex-col flex-wrap justify-center content-center -mt-20 w-full md:flex-row lg:space-x-18 lg:h-64">
            <motion.div
                key="1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0 }}
            >
                <motion.div
                    className="group flex flex-col p-6 mb-10 border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-cyan-400 border-cyan-400 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white transition-colors duration-500 ease-in-out lg:text-5xl group-hover:text-cyan-300">
                        Explore TagScript
                    </h2>
                    <p>
                        Explore a{" "}
                        <span className="font-bold text-cyan-300 animate-pulse">
                            dynamic
                        </span>{" "}
                        database with{" "}
                        <span className="font-bold text-cyan-300 animate-pulse">
                            {statsData?.all_tag_count ? (
                                <>
                                    {statsData.all_tag_count.toLocaleString()}
                                </>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        tags.
                    </p>
                </motion.div>
            </motion.div>
            <motion.div
                key="2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                <motion.div
                    className="group flex flex-col justify-center p-6 mb-10 border-t-8 border-green-500 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-green-500 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white duration-500 ease-in-out group-hover:text-green-400 lg:text-5xl">
                        Find PreBuilt Tags
                    </h2>
                    <p>
                        From{" "}
                        <span className="font-thin text-green-300 animate-pulse">
                            simple
                        </span>{" "}
                        tags to{" "}
                        <span className="font-bold text-green-600 animate-pulse">
                            complex
                        </span>{" "}
                        commands, find what you need with ease.
                    </p>
                </motion.div>
            </motion.div>
            <motion.div
                key="3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <motion.div
                    className="group flex flex-col justify-center p-6 border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-rose-400 border-rose-400 w-80 md:m-2 md:w-[200px] lg:w-[270px] 2xl:w-[430px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <h2 className="mb-4 text-2xl text-center text-white duration-500 ease-in-out group-hover:text-rose-400 lg:text-5xl">
                        Help Us Grow
                    </h2>
                    <p>
                        Every tag in the vault is ready to use. The last update was only{" "}
                        <span className="font-bold text-rose-400 animate-pulse">
                            {statsData?.latest_last_fetched ? (
                                <>
                                    {getTimeSince(
                                        new Date(statsData.latest_last_fetched)
                                    )}
                                </>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        ago.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
