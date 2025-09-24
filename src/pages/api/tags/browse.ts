import client from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import type { BrowseQuery, TagData } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const db = client.db("TagDB");
const collection = db.collection("Tags");

function parseBool(value: string | string[] | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    const v = Array.isArray(value) ? value[0] : value;
    if (v === "true") return true;
    if (v === "false") return false;
    return undefined;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BrowseQuery>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).end("Method Not Allowed");
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).end("Unauthorized");
    }

    const { q, owner_id, page = "0", pageSize = "21", shared, nsfw, safe } =
        req.query;

    const p = Math.max(0, Number(Array.isArray(page) ? page[0] : page) || 0);
    const ps = Math.min(
        100,
        Math.max(1, Number(Array.isArray(pageSize) ? pageSize[0] : pageSize) || 21)
    );

    const filters: any = {
        deleted: false,
    };

    const sharedBool = parseBool(shared);
    if (sharedBool !== undefined) filters.shared = sharedBool;
    const nsfwBool = parseBool(nsfw);
    if (nsfwBool !== undefined) filters.nsfw = nsfwBool;
    if (safe && !Array.isArray(safe)) {
        if (safe === "safe") filters.safe = { $in: ["safe", "unrated"] };
        else if (safe === "unrated") filters.safe = "unrated";
        else if (safe === "not_safe") filters.safe = "not_safe";
    }
    if (owner_id && !Array.isArray(owner_id)) filters.owner_id = owner_id;

    const searchText = q && !Array.isArray(q) ? q.trim() : "";

    const pipeline: any[] = [];
    if (searchText) {
        pipeline.push({
            $search: {
                index: "default",
                text: {
                    query: searchText,
                    path: { wildcard: "*" },
                },
            },
        });
    }
    pipeline.push({ $match: filters });
    const countPipeline = pipeline.concat([{ $count: "total" }]);
    pipeline.push({ $sort: { last_fetched: -1 } });
    pipeline.push({ $skip: p * ps });
    pipeline.push({ $limit: ps });

    const [items, totalAgg] = await Promise.all([
        collection.aggregate(pipeline).toArray(),
        collection.aggregate(countPipeline).toArray(),
    ]);

    const tagData: TagData[] = items.map((query) => ({
        id: query.id,
        created_at: query.created_at,
        guild_id: query.guild_id,
        tag_name: query.tag_name,
        nsfw: query.nsfw,
        owner_id: query.owner_id,
        sharer: query.sharer,
        uses: query.uses,
        content: query.content,
        embed: query.embed,
        last_fetched: query.last_fetched,
        deleted: query.deleted,
        description: query.description,
        restricted: query.restricted,
        shared: query.shared,
        safe: query.safe,
    }));

    const total = totalAgg[0]?.total ? Number(totalAgg[0].total) : 0;

    return res.status(200).json({
        results: tagData,
        total,
        page: p,
        pageSize: ps,
    });
}


