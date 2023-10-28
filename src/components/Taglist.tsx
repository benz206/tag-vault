import { TagData, ShortTagData } from "@/types";
import Tagbox from "@/components/Tagbox";
import { useState, useEffect } from "react";

export default function Taglist({
    tags,
}: { tags: TagData[] } | { tags: ShortTagData[] }) {
    const [boxesView, setBoxesView] = useState<JSX.Element[] | null>(null);

    const newLength = Math.min(12, tags.length);

    useEffect(() => {
        let boxes: JSX.Element[] = [];

        for (let i = 0; i < newLength; i += 3) {
            const row = (
                <div
                    key={`row-${i}`}
                    className="relative flex flex-row flex-wrap content-center justify-center w-full h-auto lg:h-96 lg:-mb-6"
                >
                    {tags.slice(i, i + 3).map((tag, index) => (
                        <Tagbox key={`tag-${tag.id}`} id={tag.id} />
                    ))}
                </div>
            );
            
            // boxes.push(row);
            // sleep for 100ms to allow for animation
            setTimeout(() => {
                boxes.push(row);
            }
            , 100);
        }

        setBoxesView(boxes);
    }, [tags, newLength]);

    return <div className="h-auto">{boxesView}</div>;
}
