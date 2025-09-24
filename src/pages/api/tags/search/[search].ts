import client from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { TagData, Error, SearchQuery } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const db = client.db("TagDB");
const collection = db.collection("Tags");

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
        ])
        .toArray();

    const tagData: TagData[] = queries.map((query) => ({
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

    res.status(200).json({ search: tagData });
}
