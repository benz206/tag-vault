import type { NextApiRequest, NextApiResponse } from "next";
import type { DashStats } from "@/types";
import { requireSession } from "@/lib/auth";
import { getDb } from "@/utils/mongodb/mongo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DashStats | { error: string }>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await requireSession(req, res);
    if (!session) return;

    try {
        const db = await getDb();
        const collection = db.collection("Tags");
        const ownerId = session.user.id;

        const [totalTags, sharedTags, nsfwTags, usesAgg] = await Promise.all([
            collection.countDocuments({ owner_id: ownerId }),
            collection.countDocuments({ owner_id: ownerId, shared: true }),
            collection.countDocuments({ owner_id: ownerId, nsfw: true }),
            collection
                .aggregate([
                    { $match: { owner_id: ownerId } },
                    { $group: { _id: null, total: { $sum: "$uses" } } },
                ])
                .toArray(),
        ]);

        return res.status(200).json({
            tags: {
                public: sharedTags,
                private: totalTags - sharedTags,
                nsfw: nsfwTags,
                total: totalTags,
            },
            uses: usesAgg[0]?.total ?? 0,
            favorites: 0,
        });
    } catch (error) {
        console.error("dashstatistics error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
