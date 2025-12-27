import type { NextApiRequest, NextApiResponse } from "next";
import { Error, OwnerTagsQuery } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getDb } from "@/utils/mongodb/mongo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<OwnerTagsQuery | Error>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { owner_id } = req.query;

    if (!owner_id || Array.isArray(owner_id)) {
        return res.status(400).json({ error: "Invalid Owner ID" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id || session.user.id !== String(owner_id)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await getDb();
    const collection = db.collection("Tags");

    const queries = await collection
        .find({ owner_id: String(owner_id) })
        .project({ _id: 0, id: 1 })
        .toArray();

    const tagIDs: number[] = queries.map((query) => query.id);

    res.status(200).json({ tags: tagIDs });
}
