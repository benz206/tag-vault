import { useState, useEffect } from "react";
import { TagData } from "@/types";
import { getTagData } from "@/utils";
import { getTagColor } from "@/utils";

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
            className={`rounded-xl p-8 bg-slate-700 w-128 h-128 border-t-8 border-${color} shadow-${color} shadow-xl hover:scale-110 transform transition-transform duration-440`}
        >
            {loading ? (
                <p>Loading data...</p>
            ) : data ? (
                <>
                    <h2>{data.tag_name}</h2>
                    <p>{data.description}</p>
                </>
            ) : (
                <p>Sorry, but there was an error loading data.</p>
            )}
        </div>
    );
}
