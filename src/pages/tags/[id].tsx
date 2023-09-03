import { useRouter } from "next/router";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { TagData } from "@/types";

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

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setLoading(false);
            return;
        }

        getData(Number(id))
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
        <div>
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
