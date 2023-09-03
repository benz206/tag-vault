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
    res.status(200).json({ alive: true });
}
