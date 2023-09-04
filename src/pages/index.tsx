import Tagbox from "@/components/Tagbox";
import { useState, useEffect } from "react";
import { getStats } from "@/utils";
import { Statistics } from "@/types";

function getTimeSince(startDate: Date): number {
    const currentDate = new Date();
    return Math.abs(currentDate.getTime() - startDate.getTime());
}

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
            <div className="flex justify-center h-full w-full flex-col">
                <div className="flex justify-center h-72 lg:h-128 w-full bg-gradient-to-r from-pink-500 to-rose-500 content-center flex-wrap">
                    <h1 className="-top-8 relative text-center text-6xl lg:text-9xl">
                        Tag Vault
                    </h1>
                </div>
                <div className="flex flex-row justify-center w-full content-center flex-wrap -top-20 lg:space-x-18 relative lg:h-48">
                    <div className="rounded-xl mb-10 lg:m-0 bg-slate-600 p-8 flex flex-col border-cyan-400 shadow-cyan-400 shadow-xl border-t-8 border-cyan-400 w-80 lg:w-128 hover:scale-110 transform transition-transform duration-440">
                        <h2 className="text-center text-cyan-300 text-2xl lg:text-5xl mb-4">
                            Explore TagScript
                        </h2>
                        <p>
                            Explore a{" "}
                            <span className="font-bold text-cyan-300 animate-pulse">
                                dynamic
                            </span>{" "}
                            database with{" "}
                            <span className="font-bold text-cyan-300 animate-pulse">
                                {statsData?.tag_count ? (
                                    <>{statsData.tag_count.toLocaleString()}</>
                                ) : (
                                    "loading..."
                                )}
                            </span>{" "}
                            tags.
                        </p>
                    </div>
                    <div className="rounded-xl mb-10 lg:m-0 bg-slate-600 p-8 flex justify-center flex-col border-cyan-400 shadow-green-500 shadow-xl border-t-8 border-green-500 w-80 lg:w-128 hover:scale-110 transform transition-transform duration-440">
                        <h2 className="text-center text-green-400 text-2xl lg:text-5xl mb-4">
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
                    <div className="rounded-xl lg:m-0 bg-slate-600 p-8 flex justify-center flex-col border-cyan-400 shadow-rose-400 shadow-xl border-t-8 border-rose-400 w-80 lg:w-128 hover:scale-110 transform transition-transform duration-440">
                        <h2 className="text-center text-rose-400 text-2xl lg:text-5xl mb-4">
                            Endless Discovery
                        </h2>
                        <p>
                            Tags are updated{" "}
                            <span className="font-bold text-rose-400 animate-pulse">
                                constantly!
                            </span>{" "}
                            The last update was only{" "}
                            <span className="font-bold text-rose-400 animate-pulse">
                                {statsData?.latest_last_fetched ? (
                                    <>
                                        {getTimeSince(
                                            new Date(
                                                statsData.latest_last_fetched
                                            )
                                        )}{" "}
                                        milliseconds
                                    </>
                                ) : (
                                    "loading..."
                                )}
                            </span>{" "}
                            ago.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center w-full content-center -top-8 lg:-top-4 relative -mb-24 lg:-mb-32">
                    <h1 className="text-center text-5xl lg:text-7xl">
                        Featured Tags
                    </h1>
                </div>
                <div className="flex flex-row justify-center lg:h-128 w-full content-center flex-wrap top-24 lg:top-0lg:space-x-28 relative">
                    <Tagbox id={1157946} />
                    <Tagbox id={1111722} />
                    <Tagbox id={1217391} />
                </div>
            </div>
        </>
    );
}
