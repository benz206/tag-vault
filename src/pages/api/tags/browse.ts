import type { NextApiRequest, NextApiResponse } from "next";
import type { Document, Filter } from "mongodb";
import { requireSession } from "@/lib/auth";
import { getDb } from "@/utils/mongodb/mongo";
import type { BrowseQuery, TagData } from "@/types";

function parseBool(value: string | string[] | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    const v = Array.isArray(value) ? value[0] : value;
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined;
}

function singleStr(value: string | string[] | undefined): string | undefined {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value[0] : value;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BrowseQuery | { error: string }>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await requireSession(req, res);
    if (!session) return;

    const {
        q,
        owner_id,
        page = "0",
        pageSize = "21",
        shared,
        nsfw,
        safe,
    } = req.query;

    const p = Math.max(0, Number(singleStr(page)) || 0);
    const ps = Math.min(100, Math.max(1, Number(singleStr(pageSize)) || 21));

    const filters: Filter<Document> = { deleted: false };

    const sharedBool = parseBool(shared);
    if (sharedBool !== undefined) filters.shared = sharedBool;
    const nsfwBool = parseBool(nsfw);
    if (nsfwBool !== undefined) filters.nsfw = nsfwBool;

    const safeStr = singleStr(safe);
    if (safeStr === "safe") filters.safe = { $in: ["safe", "unrated"] };
    else if (safeStr === "unrated") filters.safe = "unrated";
    else if (safeStr === "not_safe") filters.safe = "not_safe";

    const ownerStr = singleStr(owner_id);
    if (ownerStr) filters.owner_id = ownerStr;

    const searchText = (singleStr(q) ?? "").trim().slice(0, 100);

    try {
        const db = await getDb();
        const collection = db.collection("Tags");

        const pipeline: Document[] = [];
        if (searchText) {
            pipeline.push({
                $search: {
                    index: "default",
                    text: { query: searchText, path: { wildcard: "*" } },
                },
            });
        }
        pipeline.push({ $match: filters });
        const countPipeline = [...pipeline, { $count: "total" }];
        pipeline.push({ $sort: { last_fetched: -1 } });
        pipeline.push({ $skip: p * ps });
        pipeline.push({ $limit: ps });

        const [items, totalAgg] = await Promise.all([
            collection.aggregate(pipeline).toArray(),
            collection.aggregate(countPipeline).toArray(),
        ]);

        const tagData: TagData[] = items.map((item) => ({
            id: item.id,
            created_at: item.created_at,
            guild_id: item.guild_id,
            tag_name: item.tag_name,
            nsfw: item.nsfw,
            owner_id: item.owner_id,
            sharer: item.sharer,
            uses: item.uses,
            content: item.content,
            embed: item.embed,
            last_fetched: item.last_fetched,
            deleted: item.deleted,
            description: item.description,
            restricted: item.restricted,
            shared: item.shared,
            safe: item.safe,
        }));

        const total = totalAgg[0]?.total ? Number(totalAgg[0].total) : 0;
        return res
            .status(200)
            .json({ results: tagData, total, page: p, pageSize: ps });
    } catch (error) {
        console.error("browse error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
