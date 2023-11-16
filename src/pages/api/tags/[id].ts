import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/utils/mongodb/mongo";
import { TagData } from "@/types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

type Error = {
    error: string;
};

const db = client.db("TagDB");
const collection = db.collection("Tags");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TagData | Error>
) {
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid Tag ID" });
    }

    const rawTagData = await collection.findOne({
        id: Number(id),
    });

    if (!rawTagData) {
        return res.status(404).json({ error: "Tag ID Non Existent" });
    }

    if (session?.user.id != rawTagData.owner_id) {
        if (rawTagData.deleted || !rawTagData.shared) {
            return res.status(404).json({ error: "Tag is Private" });
        }

        if (rawTagData.nsfw) {
            return res.status(404).json({ error: "Tag is NSFW" });
        }
    }

    if (rawTagData.safe === "not_safe") {
        return res
            .status(404)
            .json({ error: "This tag is currently under review" });
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
        shared: rawTagData.shared,
        safe: rawTagData.safe,
    };

    res.status(200).json(convertedTagData);
}
