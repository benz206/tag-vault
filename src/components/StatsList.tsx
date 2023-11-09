import { useState, useEffect } from "react";
import { getStats } from "@/utils";
import { Statistics } from "@/types";

function getTimeSince(startDate: Date): number {
    const currentDate = new Date();
    return Math.round(
        Math.abs(currentDate.getTime() - startDate.getTime()) / 1000
    );
}

export default function () {
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
        <div className="relative flex flex-row flex-wrap content-center justify-center w-full -mt-20 lg:space-x-18 lg:h-64">
            <div className="group flex flex-col p-6 mb-10 transition-transform duration-500 border-t-8 shadow-xl ease-in-out transform rounded-xl lg:m-0 bg-slate-600 shadow-cyan-400 border-cyan-400 w-80 lg:w-[430px] hover:scale-110">
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
                            <>{statsData.public_tag_count.toLocaleString()}</>
                        ) : (
                            "loading..."
                        )}
                    </span>{" "}
                    tags.
                </p>
            </div>
            <div className="group flex flex-col justify-center p-6 mb-10 transition-transform duration-500 border-t-8 border-green-500 shadow-xl ease-in-out transform rounded-xl lg:m-0 bg-slate-600 shadow-green-500 w-80 lg:w-[430px] hover:scale-110">
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
            </div>
            <div className="group flex flex-col justify-center p-6 transition-transform duration-500 border-t-8 shadow-xl ease-in-out transform rounded-xl lg:m-0 bg-slate-600 shadow-rose-400 border-rose-400 w-80 lg:w-[430px] hover:scale-110">
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
            </div>
        </div>
    );
}
