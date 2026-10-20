import { useMemo } from "react";
import { motion } from "motion/react";
import { TagData, ShortTagData } from "@/types";
import Tagbox from "@/components/Tagbox";

type TaglistProps = {
    tags: TagData[] | ShortTagData[];
    animDelay: number;
    staticDataList?: TagData[] | null;
    page?: number;
};

const PAGE_SIZE = 21;

export default function Taglist({
    tags,
    animDelay,
    staticDataList,
    page = 0,
}: TaglistProps) {
    const boxes = useMemo(() => {
        const source = staticDataList ?? tags;
        const start = staticDataList ? 0 : PAGE_SIZE * page;
        const end = Math.min(start + PAGE_SIZE, source.length);
        const items = [];
        for (let i = start; i < end; i++) {
            const tag = tags[i];
            if (!tag) continue;
            items.push(
                <motion.div
                    key={`tag-${tag.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1,
                        delay: (i + animDelay) * 0.2,
                    }}
                >
                    <Tagbox id={tag.id} staticData={staticDataList?.[i]} />
                </motion.div>
            );
        }
        return items;
    }, [tags, staticDataList, animDelay, page]);

    return (
        <div className="grid w-auto h-auto grid-cols-1 gap-2 py-5 mx-auto md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {boxes}
        </div>
    );
}
