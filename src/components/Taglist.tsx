import * as React from "react";
import { motion } from "framer-motion";
import { TagData, ShortTagData } from "@/types";
import Tagbox from "@/components/Tagbox";
import { useState, useEffect } from "react";

export default function Taglist({
    tags, animDelay
}: { tags: TagData[], animDelay: number} | { tags: ShortTagData[], animDelay: number }) {
    const [boxesView, setBoxesView] = useState<JSX.Element[] | null>(null);

    const newLength = Math.min(12, tags.length);

    useEffect(() => {
        let boxes: JSX.Element[] = [];

        for (let i = 0; i < newLength; i++) {
            boxes.push(
                <motion.div
                    key={`tag-${tags[i].id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: (i + animDelay) * 0.5 }}
                >
                    <Tagbox id={tags[i].id} />
                </motion.div>
            );
        }

        setBoxesView(boxes);
    }, [tags, newLength]);

    return (
        <div className="grid w-auto h-auto grid-cols-1 gap-2 py-5 mx-auto md:grid-cols-2 xl:grid-cols-3">
            {boxesView}
        </div>
    );
}
