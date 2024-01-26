import { useState, useEffect } from "react";
import { getStats } from "@/utils";
import { Statistics } from "@/types";
import { motion } from "framer-motion";

function getTimeSince(startDate: Date): number {
    const currentDate = new Date();
    return Math.round(
        Math.abs(currentDate.getTime() - startDate.getTime()) / 1000
    );
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
        <div className="relative flex flex-col flex-wrap content-center justify-center w-full -mt-20 md:flex-row lg:space-x-18 lg:h-64">
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
                            {statsData?.public_tag_count ? (
                                <>
                                    {statsData.public_tag_count.toLocaleString()}
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
                        There are still{" "}
                        <span className="font-bold text-rose-400 animate-pulse">
                            {statsData?.all_tag_count &&
                            statsData?.public_tag_count ? (
                                <>
                                    {(
                                        statsData.all_tag_count -
                                        statsData.public_tag_count
                                    ).toLocaleString()}
                                </>
                            ) : (
                                "loading..."
                            )}
                        </span>{" "}
                        tags to be shared. The last update was only{" "}
                        <span className="font-bold text-rose-400 animate-pulse">
                            {statsData?.latest_last_fetched ? (
                                <>
                                    {getTimeSince(
                                        new Date(statsData.latest_last_fetched)
                                    )}{" "}
                                    seconds
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
