import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { TagData } from "@/types";
import { getTagColor } from "@/utils";

async function getData(id: number) {
    const res = await fetch("/api/tags/" + id);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default function Page() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<TagData | null>(null);
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState<string | null>(null);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getData(Number(id))
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
        <>
            <div
                className={`flex justify-center h-36 lg:h-80 w-full bg-${color} content-center flex-wrap`}
            >
                <h1 className="top-2 lg:-top-4 relative text-3xl lg:text-9xl">
                    {data?.tag_name}
                </h1>
            </div>
            <div className="flex justify-center">
                <div
                    className={`rounded-xl p-8 bg-slate-700 w-11/12 border-t-8 border-${color} shadow-${color} shadow-xl transform transition-transform duration-440 mt-4 lg:mt-12`}
                >
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
            </div>
        </>
    );
}
