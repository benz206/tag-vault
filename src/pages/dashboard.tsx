import Taglist from "@/components/Taglist";
import DashStatsList from "@/components/DashStatsList";
import { motion } from "framer-motion";
import { ShortTagData } from "@/types";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { getOwnerTagData } from "@/utils";

export default function Home() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("discord", { callbackUrl: "/dashboard" });
        },
    });
    const [ownerTags, setOwnerTags] = useState<ShortTagData[]>([]);

    useEffect(() => {
        console.log(session?.user);
        if (session?.user.id) {
            getOwnerTagData(session.user.id).then((result) => {
                console.log(result);
                if (result) {
                    const converted: ShortTagData[] = [];
                    result.tags.forEach((tag) => {
                        converted.push({
                            id: tag,
                        });
                    });
                    setOwnerTags(converted);
                }
            });
        }
    }, [session]);

    return (
        <div className="flex flex-col items-center w-full h-full min-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-center w-full h-72 lg:h-[400px] bg-gradient-to-r from-cyan-500 to-blue-500">
                <h1 className="relative text-6xl text-center -top-8 lg:text-9xl">
                    Dashboard
                </h1>
            </div>
            <DashStatsList />
            <motion.div
                className="relative flex content-center justify-center w-full p-2 pt-20"
                key="0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
            >
                <h1 className="text-5xl text-center lg:text-7xl">Tags</h1>
            </motion.div>
            <div className="relative h-auto w-max">
                <Taglist tags={ownerTags} animDelay={5} />
            </div>
        </div>
    );
}
