import { TagData, ShortTagData } from "@/types";
import Tagbox from "@/components/Tagbox";
import { useState, useEffect } from "react";

export default function Taglist({
    tags,
}: { tags: TagData[] } | { tags: ShortTagData[] }) {
    const [boxesView, setBoxesView] = useState<JSX.Element[] | null>(null);

    const newLength = Math.min(12, tags.length);

    useEffect(() => {
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        const addTagsWithDelay = async () => {
            let boxes: JSX.Element[] = [];

            for (let i = 0; i < newLength; i++) {
                await delay(300 * i);
                boxes.push(<Tagbox key={`tag-${tags[i].id}`} id={tags[i].id} />);
                setBoxesView(boxes);
            }
        };

        addTagsWithDelay();

        // Clear the boxes after the component is unmounted
        return () => {
            setBoxesView(null);
        };
    }, [tags, newLength]);

    return (
        <div className="grid w-auto h-auto grid-cols-1 gap-2 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {boxesView}
        </div>
    );
}
