import type { NextApiRequest, NextApiResponse } from "next";
import { requireSession } from "@/lib/auth";
import { getDb } from "@/utils/mongodb/mongo";
import { Error as ErrorType, SearchQuery, TagData } from "@/types";

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
                {
                    $match: {
                        deleted: false,
                        nsfw: false,
                        safe: { $in: ["safe", "unrated"] },
                    },
                },
                { $limit: 50 },
            ])
            .toArray();

        const tagData: TagData[] = queries.map((q) => ({
            id: q.id,
            created_at: q.created_at,
            guild_id: q.guild_id,
            tag_name: q.tag_name,
            nsfw: q.nsfw,
            owner_id: q.owner_id,
            sharer: q.sharer,
            uses: q.uses,
            content: q.content,
            embed: q.embed,
            last_fetched: q.last_fetched,
            deleted: q.deleted,
            description: q.description,
            restricted: q.restricted,
            shared: q.shared,
            safe: q.safe,
        }));

        return res.status(200).json({ search: tagData });
    } catch (error) {
        console.error("search error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
