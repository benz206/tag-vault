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

        for (let i = 0; i < newLength; i++) {
            let tag = tags[i];
            setTimeout(() => {
                boxes.push(<Tagbox key={`tag-${tag.id}`} id={tag.id} />);
            }, 100);
        }

        setBoxesView(boxes);
    }, [tags, newLength]);

    return <div className="grid w-auto grid-cols-1 gap-2 mx-auto md:grid-cols-2 lg:grid-cols-3">{boxesView}</div>;
}
