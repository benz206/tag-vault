import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TagData } from "@/types";
import { getTagData } from "@/utils";

export default function Tagbox({ id }: { id: number }) {
    const [data, setData] = useState<TagData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getTagData(Number(id))
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="rounded-xl bg-pink-400 p-8 bg-slate-800 w-128 h-128">
            {loading ? (
                <p>Loading data...</p>
            ) : data ? (
                <>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    <p>{data.tag_name}</p>
                </>
            ) : (
                <p>Sorry, but there was an error loading data.</p>
            )}
        </div>
    );
}
