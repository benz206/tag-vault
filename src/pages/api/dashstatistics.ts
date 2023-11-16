import client from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import type { DashStats } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DashStats>
) {
    const db = client.db("TagDB");
    const collection = db.collection("Tags");
    const session = await getServerSession(req, res, authOptions);

    const publicTags = await collection.countDocuments({
        owner_id: session?.user.id,
        shared: true,
    });
    const nsfwTags = await collection.countDocuments({
        owner_id: session?.user.id,
        nsfw: true,
    });
    const totalTags = await collection.countDocuments({
        owner_id: session?.user.id,
    });

    const totalUses = await collection
        .aggregate([
            { $match: { owner_id: session?.user.id } },
            { $group: { _id: null, total: { $sum: "$uses" } } },
        ])
        .toArray();

    res.status(200).json({
        tags: {
            public: publicTags,
            private: totalTags - publicTags,
            nsfw: nsfwTags,
            total: totalTags,
        },
        uses: totalUses[0].total ? totalUses[0].total : 0,
        favorites: 0, // TODO: Implement favorites
    });
}
