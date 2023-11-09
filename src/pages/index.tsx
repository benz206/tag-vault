import Taglist from "@/components/Taglist";
import { useState, useEffect } from "react";
import { getStats } from "@/utils";
import { ShortTagData, Statistics } from "@/types";

function getTimeSince(startDate: Date): number {
    const currentDate = new Date();
    return Math.round(
        Math.abs(currentDate.getTime() - startDate.getTime()) / 1000
    );
}

const featuredTags: ShortTagData[] = [
    {
        id: 1157946,
    },
    {
        id: 1111722,
    },
    {
        id: 1217391,
    },
    {
        id: 825576,
    },
    {
        id: 962280,
    },
    {
        id: 865606,
    },
];

export default function Home() {
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
        <>
            <div className="flex flex-col items-center w-full h-full min-h-screen">
                <div className="flex flex-wrap content-center justify-center w-full h-72 md:h-128 lg:h-128 bg-gradient-to-r from-pink-500 to-rose-500">
                    <h1 className="relative text-6xl text-center -top-8 lg:text-9xl">
                        Tag Vault
                    </h1>
                </div>
                <div className="relative flex flex-row flex-wrap content-center justify-center w-full -mt-20 lg:space-x-18 lg:h-48">
                    <div className="flex flex-col p-8 mb-10 transition-transform transform border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-cyan-400 border-cyan-400 w-80 lg:w-96 2xl:w-128 hover:scale-110 duration-440">
                        <h2 className="mb-4 text-2xl text-center text-cyan-300 lg:text-5xl">
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
                    </div>
                    <div className="flex flex-col justify-center p-8 mb-10 transition-transform transform border-t-8 border-green-500 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-green-500 w-80 lg:w-96 2xl:w-128 hover:scale-110 duration-440">
                        <h2 className="mb-4 text-2xl text-center text-green-400 lg:text-5xl">
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
                    <div className="flex flex-col justify-center p-8 transition-transform transform border-t-8 shadow-xl rounded-xl lg:m-0 bg-slate-600 shadow-rose-400 border-rose-400 w-80 lg:w-96 2xl:w-128 hover:scale-110 duration-440">
                        <h2 className="mb-4 text-2xl text-center text-rose-400 lg:text-5xl">
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
                                            new Date(
                                                statsData.latest_last_fetched
                                            )
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
                <div className="relative flex content-center justify-center w-full pt-12">
                    <h1 className="text-5xl text-center lg:text-7xl">
                        Featured Tags
                    </h1>
                </div>
                <Taglist tags={featuredTags} />
            </div>
        </>
    );
}
