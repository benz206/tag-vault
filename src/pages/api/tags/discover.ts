import type { NextApiRequest, NextApiResponse } from "next";
import type { DiscoverQuery, Error as ErrorType } from "@/types";
import {
    PUBLIC_TAG_FILTER,
    TAG_SUMMARY_PROJECTION,
    toTagSummary,
} from "@/lib/tags";
import { getDb } from "@/utils/mongodb/mongo";

const LIMIT = 12;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DiscoverQuery | ErrorType>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const db = await getDb();
        const collection = db.collection("Tags");
        const find = (sort: Record<string, 1 | -1>) =>
            collection
                .find(PUBLIC_TAG_FILTER, { projection: TAG_SUMMARY_PROJECTION })
                .sort(sort)
                .limit(LIMIT)
                .toArray();

        const [popular, newest] = await Promise.all([
            find({ uses: -1 }),
            find({ created_at: -1 }),
        ]);

        res.setHeader(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=3600"
        );
        return res.status(200).json({
            popular: popular.map(toTagSummary),
            newest: newest.map(toTagSummary),
        });
    } catch (error) {
        console.error("discover error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
