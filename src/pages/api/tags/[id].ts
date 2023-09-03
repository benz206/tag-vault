// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { TagData } from "@/types";

type Error = {
    error: string;
};

const client = new MongoClient(
    `mongodb+srv://${process.env.Mongo_User}:${process.env.Mongo_Pass}@carltagscluster.nyxt2.mongodb.net/TagDB?retryWrites=true&w=majority`
);
const db = client.db("TagDB");
const collection = db.collection("NewTags");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TagData | Error>
) {
    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid Tag ID" });
    }

    const rawTagData = await collection.findOne({
        id: Number(id),
    });

    if (!rawTagData) {
        return res.status(404).json({ error: "Tag ID Non Existent" });
    }

    if (rawTagData.deleted) {
        return res.status(404).json({ error: "Tag is Private" });
    }

    if (rawTagData.nsfw) {
        return res.status(404).json({ error: "Tag is NSFW" });
    }

    const convertedTagData: TagData = {
        id: rawTagData.id,
        created_at: new Date(rawTagData.created_at),
        guild_id: rawTagData.guild_id,
        tag_name: rawTagData.tag_name,
        nsfw: rawTagData.nsfw,
        owner_id: rawTagData.owner_id,
        sharer: rawTagData.sharer,
        uses: rawTagData.uses,
        content: rawTagData.content,
        embed: rawTagData.embed,
        last_fetched: new Date(rawTagData.last_fetched),
        deleted: rawTagData.deleted,
        description: rawTagData.description,
        restricted: rawTagData.restricted,
    };

    res.status(200).json(convertedTagData);
}
