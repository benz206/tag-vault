import type { NextApiRequest, NextApiResponse } from "next";
import type { Error, SearchQuery, TagSummary } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getDb } from "@/utils/mongodb/mongo";

function toIso(value: any): string {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return String(value);
}

function toSummary(doc: any): TagSummary {
    return {
        id: Number(doc.id),
        created_at: toIso(doc.created_at),
        tag_name: String(doc.tag_name ?? ""),
        nsfw: Boolean(doc.nsfw),
        owner_id: String(doc.owner_id ?? ""),
        uses: Number(doc.uses ?? 0),
        description: doc.description ?? null,
        restricted: Boolean(doc.restricted),
        shared: Boolean(doc.shared),
        deleted: Boolean(doc.deleted),
        safe: String(doc.safe ?? ""),
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SearchQuery | Error>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { search } = req.query;

    if (!search || Array.isArray(search)) {
        return res.status(400).json({ error: "Invalid Search Query" });
    }

    if (search.length > 30) {
        return res.status(400).json({ error: "Search query too long for now" });
    }

    const db = await getDb();
    const collection = db.collection("Tags");

    const queries = await collection
        .aggregate([
            {
                $search: {
                    index: "default",
                    text: {
                        query: search,
                        path: {
                            wildcard: "*",
                        },
                    },
                },
            },
            {
                $match: {
                    $and: [
                        // { shared: true },
                        { deleted: false },
                        { nsfw: false },
                        { safe: { $in: ["safe", "unrated"] } },
                    ],
                },
            },
            {
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
            },
        ])
        .toArray();

    const tagData = queries.map(toSummary);

    res.status(200).json({ search: tagData });
}
