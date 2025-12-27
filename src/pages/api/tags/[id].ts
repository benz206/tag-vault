import type { NextApiRequest, NextApiResponse } from "next";
import { TagData } from "@/types";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { getDb } from "@/utils/mongodb/mongo";

type Error = {
    error: string;
};

function toIso(value: any): string {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return String(value);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TagData | Error>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);

    if (!id || Array.isArray(id) || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid Tag ID" });
    }

    const db = await getDb();
    const collection = db.collection("Tags");

    const rawTagData = await collection.findOne(
        { id: Number(id) },
        { projection: { _id: 0 } }
    );

    if (!rawTagData) {
        return res.status(404).json({ error: "Tag ID Non Existent" });
    }

    if (session?.user.id != rawTagData.owner_id) {
        if (rawTagData.deleted) {
            return res.status(404).json({ error: "Tag has been deleted" });
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
        id: Number(rawTagData.id),
        created_at: toIso(rawTagData.created_at),
        guild_id: String(rawTagData.guild_id ?? ""),
        tag_name: String(rawTagData.tag_name ?? ""),
        nsfw: Boolean(rawTagData.nsfw),
        owner_id: String(rawTagData.owner_id ?? ""),
        sharer: String(rawTagData.sharer ?? ""),
        uses: Number(rawTagData.uses ?? 0),
        content: String(rawTagData.content ?? ""),
        embed: String(rawTagData.embed ?? ""),
        last_fetched: toIso(rawTagData.last_fetched),
        deleted: Boolean(rawTagData.deleted),
        description: rawTagData.description ?? null,
        restricted: Boolean(rawTagData.restricted),
        shared: Boolean(rawTagData.shared),
        safe: String(rawTagData.safe ?? ""),
    };

    res.status(200).json(convertedTagData);
}
