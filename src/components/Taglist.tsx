import { TagData, ShortTagData } from "@/types";
import Tagbox from "@/components/Tagbox";

export default function Taglist({ tags }: { tags: TagData[]} | { tags: ShortTagData[]}) {
    const boxes = [];

    const newLength = Math.min(12, tags.length);

    for (let i = 0; i < newLength; i += 3) {
        boxes.push(
            <div className="flex flex-row justify-center lg:h-96 w-full content-center flex-wrap relative lg:-mb-6">
                <Tagbox id={tags[i].id} />
                <Tagbox id={tags[i + 1].id} />
                <Tagbox id={tags[i + 2].id} />
            </div>
        )
    }
    return (
        <div className="h-auto">
            {boxes}
        </div>
    );
}