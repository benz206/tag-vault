import Taglist from "@/components/Taglist";
import StatsList from "@/components/StatsList";
import { motion } from "framer-motion";
import { ShortTagData, StaticFeaturedTag } from "@/types";
import { getTagData, getDiscordUser } from "@/utils";

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
    return (
        <div className="flex flex-col items-center w-full h-full min-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-center w-full h-72 lg:h-[400px] bg-gradient-to-r from-pink-500 to-rose-500">
                <h1 className="relative text-6xl text-center -top-8 lg:text-9xl">
                    Tag Vault
                </h1>
            </div>
            <StatsList />
            <motion.div
                className="relative flex content-center justify-center w-full p-2 pt-20"
                key="0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
            >
                <h1 className="text-5xl text-center lg:text-7xl">
                    Featured Tags
                </h1>
            </motion.div>
            <div className="relative h-auto w-max">
                <Taglist tags={featuredTags} animDelay={2} />
            </div>
        </div>
    );
}
