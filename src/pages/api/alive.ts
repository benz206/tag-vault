import { connectToMongo } from "@/utils/mongodb/mongo";
import type { NextApiRequest, NextApiResponse } from "next";

type Alive = {
    alive: boolean;
};

connectToMongo();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Alive>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ alive: false });
    }
    res.status(200).json({ alive: true });
}
