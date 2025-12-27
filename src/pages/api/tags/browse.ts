import type { NextApiRequest, NextApiResponse } from "next";
import type { BrowseQuery, TagSummary } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getDb } from "@/utils/mongodb/mongo";

function toIso(value: any): string {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return String(value);
}

function toSummary(query: any): TagSummary {
    return {
        id: Number(query.id),
        created_at: toIso(query.created_at),
        tag_name: String(query.tag_name ?? ""),
        nsfw: Boolean(query.nsfw),
        owner_id: String(query.owner_id ?? ""),
        uses: Number(query.uses ?? 0),
        description: query.description ?? null,
        restricted: Boolean(query.restricted),
        shared: Boolean(query.shared),
        deleted: Boolean(query.deleted),
        safe: String(query.safe ?? ""),
    };
}

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

    const db = await getDb();
    const collection = db.collection("Tags");

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
    pipeline.push({
        $project: {
            _id: 0,
            id: 1,
            created_at: 1,
            tag_name: 1,
            nsfw: 1,
            owner_id: 1,
            uses: 1,
            description: 1,
            restricted: 1,
            shared: 1,
            deleted: 1,
            safe: 1,
        },
    });

    const [items, totalAgg] = await Promise.all([
        collection.aggregate(pipeline).toArray(),
        collection.aggregate(countPipeline).toArray(),
    ]);

    const tagData = items.map(toSummary);

    const total = totalAgg[0]?.total ? Number(totalAgg[0].total) : 0;

    return res.status(200).json({
        results: tagData,
        total,
        page: p,
        pageSize: ps,
    });
}


