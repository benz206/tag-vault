import client from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import { TagData, Error, OwnerTagsQuery } from "@/types";

const db = client.db("TagDB");
const collection = db.collection("Tags");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<OwnerTagsQuery | Error>
) {
    const { owner_id } = req.query;

    if (!owner_id) {
        return res.status(400).json({ error: "Invalid Owner ID" });
    }

    if (!owner_id || isNaN(Number(owner_id))) {
        return res.status(400).json({ error: "Invalid Owner ID" });
    }

    const queries = await collection
        .find({ owner_id: String(owner_id) })
        .toArray();

    // const tagData: TagData[] = queries.map((query) => ({
    //     id: query.id,
    //     created_at: query.created_at,
    //     guild_id: query.guild_id,
    //     tag_name: query.tag_name,
    //     nsfw: query.nsfw,
    //     owner_id: query.owner_id,
    //     sharer: query.sharer,
    //     uses: query.uses,
    //     content: query.content,
    //     embed: query.embed,
    //     last_fetched: query.last_fetched,
    //     deleted: query.deleted,
    //     description: query.description,
    //     restricted: query.restricted,
    //     shared: query.shared,
    //     safe: query.safe,
    // }));

    const tagIDs: number[] = queries.map((query) => query.id);

    res.status(200).json({ tags: tagIDs });
}
