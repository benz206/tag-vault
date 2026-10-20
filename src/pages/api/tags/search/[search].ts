import type { NextApiRequest, NextApiResponse } from "next";
import { requireSession } from "@/lib/auth";
import {
    PUBLIC_TAG_FILTER,
    TAG_SUMMARY_PROJECTION,
    toTagSummary,
} from "@/lib/tags";
import { getDb } from "@/utils/mongodb/mongo";
import { Error as ErrorType, SearchQuery } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SearchQuery | ErrorType>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await requireSession(req, res);
    if (!session) return;

    const { search } = req.query;
    if (!search || Array.isArray(search)) {
        return res.status(400).json({ error: "Invalid Search Query" });
    }
    if (search.length > 30) {
        return res.status(400).json({ error: "Search query too long" });
    }

    try {
        const db = await getDb();
        const collection = db.collection("Tags");

        const queries = await collection
            .aggregate([
                {
                    $search: {
                        index: "default",
                        text: { query: search, path: { wildcard: "*" } },
                    },
                },
                { $match: PUBLIC_TAG_FILTER },
                { $limit: 50 },
                { $project: TAG_SUMMARY_PROJECTION },
            ])
            .toArray();

        return res.status(200).json({ search: queries.map(toTagSummary) });
    } catch (error) {
        console.error("search error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
