import useSWR from "swr";
import { Statistics } from "@/types";
import StatCard from "@/components/StatCard";

function getTimeSince(startDate: Date): string {
    const seconds = Math.round(
        Math.abs(Date.now() - startDate.getTime()) / 1000
    );
    if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? "" : "s"}`;
}

export default function StatsList() {
    const { data: statsData } = useSWR<Statistics>("/api/statistics");

    return (
        <div className="relative flex flex-col items-center justify-center w-full gap-10 px-4 -mt-20 md:flex-row md:items-stretch md:gap-4 lg:gap-18">
            <StatCard
                title="Explore TagScript"
                accentClassName="shadow-cyan-400 border-cyan-400"
                titleHoverClassName="group-hover:text-cyan-300"
                delayMs={0}
            >
                Explore a{" "}
                <span className="font-bold text-cyan-300 animate-pulse">
                    dynamic
                </span>{" "}
                database with{" "}
                <span className="font-bold text-cyan-300 animate-pulse">
                    {statsData?.all_tag_count
                        ? statsData.all_tag_count.toLocaleString()
                        : "loading..."}
                </span>{" "}
                tags.
            </StatCard>
            <StatCard
                title="Find PreBuilt Tags"
                accentClassName="border-green-500 shadow-green-500"
                titleHoverClassName="group-hover:text-green-400"
                delayMs={200}
            >
                From{" "}
                <span className="font-thin text-green-300 animate-pulse">
                    simple
                </span>{" "}
                tags to{" "}
                <span className="font-bold text-green-600 animate-pulse">
                    complex
                </span>{" "}
                commands, find what you need with ease.
            </StatCard>
            <StatCard
                title="Help Us Grow"
                accentClassName="shadow-rose-400 border-rose-400"
                titleHoverClassName="group-hover:text-rose-400"
                delayMs={400}
            >
                Every tag in the vault is ready to use. The last update was
                only{" "}
                <span className="font-bold text-rose-400 animate-pulse">
                    {statsData?.latest_last_fetched
                        ? getTimeSince(new Date(statsData.latest_last_fetched))
                        : "loading..."}
                </span>{" "}
                ago.
            </StatCard>
        </div>
    );
}
