import useSWR from "swr";
import { DashStats } from "@/types";
import StatCard from "@/components/StatCard";

export default function DashStatsList() {
    const { data: statsData } = useSWR<DashStats>("/api/dashstatistics");

    return (
        <div className="relative flex flex-col items-center justify-center w-full gap-10 px-4 -mt-20 md:flex-row md:items-stretch md:gap-4 lg:gap-18">
            <StatCard
                title="Your Tags"
                accentClassName="shadow-fuchsia-400 border-fuchsia-400"
                titleHoverClassName="group-hover:text-fuchsia-400"
                delayMs={0}
            >
                You currently have{" "}
                <span className="font-bold text-fuchsia-400 animate-pulse">
                    {statsData
                        ? `${statsData.tags.public} public`
                        : "loading..."}
                </span>{" "}
                tags and{" "}
                <span className="font-bold text-fuchsia-400 animate-pulse">
                    {statsData
                        ? `${statsData.tags.private} private`
                        : "loading..."}
                </span>{" "}
                tags. You also have{" "}
                <span className="font-bold text-fuchsia-400 animate-pulse">
                    {statsData ? `${statsData.tags.nsfw} nsfw` : "loading..."}
                </span>{" "}
                that cannot be shared unless marked non nsfw.
            </StatCard>
            <StatCard
                title="Total Uses"
                accentClassName="border-amber-500 shadow-amber-500"
                titleHoverClassName="group-hover:text-amber-500"
                delayMs={300}
            >
                Your tags have been used a combined total of{" "}
                <span className="font-bold text-amber-500 animate-pulse">
                    {statsData ? `${statsData.uses} times` : "loading..."}
                </span>{" "}
                commands, find what you need with ease.
            </StatCard>
            <StatCard
                title="Favorites"
                accentClassName="shadow-yellow-500 border-yellow-500"
                titleHoverClassName="group-hover:text-yellow-500"
                delayMs={600}
            >
                You have{" "}
                <span className="font-bold text-yellow-500 animate-pulse">
                    {statsData
                        ? `${statsData.favorites} favorited`
                        : "loading..."}{" "}
                </span>
                tags.
            </StatCard>
        </div>
    );
}
