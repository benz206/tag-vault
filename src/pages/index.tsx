import Head from "next/head";
import Taglist from "@/components/Taglist";
import StatsList from "@/components/StatsList";
import { motion } from "motion/react";

const featuredTagIds = [1157946, 1111722, 1217391, 825576, 962280, 865606];

export default function Home() {
    return (
        <>
            <Head>
                <title>TagVault — find TagScript tags</title>
            </Head>
            <div className="flex flex-col items-center w-full h-full min-h-[calc(100vh-4rem)]">
                <div className="flex items-center justify-center w-full h-72 lg:h-[400px] bg-gradient-to-r from-pink-500 to-rose-500">
                    <h1 className="relative text-6xl text-center -top-8 lg:text-9xl">
                        Tag Vault
                    </h1>
                </div>
                <StatsList />
                <motion.div
                    className="relative flex content-center justify-center w-full p-2 pt-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h1 className="text-5xl text-center lg:text-7xl">
                        Featured Tags
                    </h1>
                </motion.div>
                <Taglist ids={featuredTagIds} />
            </div>
        </>
    );
}
