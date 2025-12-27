import * as React from "react";
import { motion } from "framer-motion";
import type { ShortTagData, TagBatchQuery, TagSummary } from "@/types";
import Tagbox from "@/components/Tagbox";
import useSWR from "swr";
import { apiFetch } from "@/utils/api";

type TagItem = TagSummary | ShortTagData;

function isSummary(tag: TagItem): tag is TagSummary {
    return (tag as TagSummary).tag_name !== undefined;
}

export default function Taglist({
    tags,
    animDelay,
    page = 0,
}: {
    tags: TagItem[];
    animDelay: number;
    page?: number;
}) {
    const pageSize = 21;
    const slice = tags.slice(page * pageSize, page * pageSize + pageSize);
    const ids = slice.filter((t) => !isSummary(t)).map((t) => t.id);
    const shouldBatch = ids.length > 0;

    const { data: batchData } = useSWR<TagBatchQuery>(
        shouldBatch ? `/api/tags/batch?ids=${ids.join(",")}` : null,
        apiFetch
    );

    const byId = React.useMemo(() => {
        const map = new Map<number, TagSummary>();
        for (const t of batchData?.tags || []) map.set(t.id, t);
        return map;
    }, [batchData]);

    return (
        <div className="grid w-auto h-auto grid-cols-1 gap-2 py-5 mx-auto md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
            {slice.map((tag, i) => {
                const staticData = isSummary(tag) ? tag : byId.get(tag.id);
                const showSkeleton =
                    shouldBatch && !isSummary(tag) && !staticData;

                return (
                    <motion.div
                        key={`tag-${tag.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            delay: (i + animDelay) * 0.2,
                        }}
                    >
                        {showSkeleton ? (
                            <div className="rounded-xl p-8 bg-slate-700 w-80 lg:w-[430px] h-52 lg:h-72 border-t-8 border-slate-500 shadow-slate-500 shadow-xl" />
                        ) : (
                            <Tagbox id={tag.id} staticData={staticData} />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
