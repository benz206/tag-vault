import { useState, useEffect } from "react";
import { TagData } from "@/types";
import { getTagData, getTagColor, formatDate } from "@/utils";

export default function Tagbox({ id }: { id: number }) {
    const [data, setData] = useState<TagData | null>(null);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getTagData(Number(id))
            .then((result) => {
                setData(result);
                setColor(
                    getTagColor(Number(result.id), Number(result.owner_id))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div
            className={`rounded-xl p-8 bg-slate-700 w-80 lg:w-128 h-64 lg:h-96 border-t-8 border-${color} shadow-${color} shadow-xl hover:scale-110 transform transition-transform duration-440 mb-12 lg:m-0`}
        >
            {loading ? (
                <>
                    <div className="animate-pulse h-16 w-3/4 rounded-xl bg-slate-500 mb-4" />
                    <div className="animate-pulse h-6 w-full rounded-xl bg-slate-400 mb-4" />
                    <div className="animate-pulse h-6 w-full rounded-xl bg-slate-400 mb-4" />
                    <div className="animate-pulse h-6 w-full rounded-xl bg-slate-400 mb-4" />
                </>
            ) : data ? (
                <>
                    <h2 className="truncate text-2xl lg:text-5xl mb-4">
                        {data.tag_name}
                    </h2>
                    <p className="line-clamp-3 text-base lg:text-lg">
                        {data.description}
                    </p>
                    <div className="absolute bottom-4 left-6 flex w-10/12 lg:w-11/12">
                        <div className="flex-2">
                            <p className="text-sm text-slate-400 text-left">
                                Owner: {data.owner_id}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 text-center lg:text-right">
                                {formatDate(new Date(data.created_at))}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 ml-4 text-right">
                                Tag ID: {data.id}
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="truncate text-2xl lg:text-5xl mb-4">
                        Well well well...
                    </h2>
                    <p className="text-base lg:text-lg">
                        Sorry! Seem's like this tag failed to load...
                    </p>
                </>
            )}
        </div>
    );
}
