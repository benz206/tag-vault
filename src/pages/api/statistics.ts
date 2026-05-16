import type { NextApiRequest, NextApiResponse } from "next";
import type { Collection } from "mongodb";
import type { Statistics } from "@/types";
import { getDb } from "@/utils/mongodb/mongo";

async function getLatestLastFetched(collection: Collection): Promise<Date | null> {
    const doc = await collection.findOne(
        {},
        { sort: { last_fetched: -1 }, projection: { _id: 0, last_fetched: 1 } }
    );
    return (doc?.last_fetched as Date | undefined) ?? null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Statistics | { error: string }>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const db = await getDb();
        const collection = db.collection("Tags");

        const [allTagCount, publicTagCount, lastFetched] = await Promise.all([
            collection.estimatedDocumentCount(),
            collection.countDocuments({ shared: true }),
            getLatestLastFetched(collection),
        ]);

        res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
        return res.status(200).json({
            all_tag_count: allTagCount,
            public_tag_count: publicTagCount,
            latest_last_fetched: lastFetched as Date,
        });
    } catch (error) {
        console.error("statistics error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
