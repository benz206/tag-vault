import client from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Statistics } from "@/types";
import { Collection } from "mongodb";

async function getLatestLastFetched(collection: Collection) {
    try {
        const result = await collection
            .aggregate([
                { $sort: { last_fetched: -1 } },
                { $limit: 1 },
                { $project: { _id: 0, last_fetched: 1 } },
            ])
            .toArray();

        return result[0].last_fetched;
    } catch (error) {
        console.error("Error finding latest last_fetched: ", error);
    }
    return null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Statistics>
) {
    const db = client.db("TagDB");
    const collection = db.collection("NewTags");

    const tagCount = await collection.countDocuments();
    const lastFetched = await getLatestLastFetched(collection);

    res.status(200).json({
        tag_count: tagCount,
        latest_last_fetched: lastFetched,
    });
}
