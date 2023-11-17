import { NextApiRequest, NextApiResponse } from "next";
import { DiscordUser } from "@/types";
import client from "@/utils/mongodb/mongo";

type Error = {
    error: string;
};

const db = client.db("TagDB");
const collection = db.collection("Users");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DiscordUser | Error>
) {
    const { discord_id } = req.query;

    if (!discord_id || isNaN(Number(discord_id)) || Array.isArray(discord_id)) {
        return res.status(400).json({ error: "Invalid discord_id" });
    }

    try {
        const cachedData = await collection.findOne({ id: String(discord_id) });

        if (cachedData) {
            // Check if the data was fetched more than a day ago
            console.log("Cacheing new data.");
            const now = new Date();
            const lastFetched = new Date(cachedData.lastFetched);
            const diffInMs = now.getTime() - lastFetched.getTime();
            const oneDayInMs = 24 * 60 * 60 * 1000;

            const discordUserData: DiscordUser = {
                id: cachedData.id,
                username: cachedData.username,
                avatar: cachedData.avatar,
                discriminator: cachedData.discriminator,
                public_flags: cachedData.public_flags,
                flags: cachedData.flags,
                banner: cachedData.banner,
                accent_color: cachedData.accent_color,
                global_name: cachedData.global_name,
                avatar_decoration_data: cachedData.avatar_decoration_data,
                banner_color: cachedData.banner_color,
            };

            if (diffInMs > oneDayInMs) {
                console.log("Refreshing old data.");
                // Data is older than a day, refetch
                const userData = await fetchUserData(discord_id);
                await collection.updateOne(
                    { discord_id: String(discord_id) },
                    { $set: { ...userData, lastFetched: now } }
                );
                return res.status(200).json(userData);
            }

            return res.status(200).json(discordUserData);
        } else {
            // Data not found in cache, fetch from API
            console.log("New Fetch of Data.");
            const userData = await fetchUserData(discord_id);
            await collection.insertOne({
                ...userData,
                lastFetched: new Date(),
            });
            return res.status(200).json(userData);
        }
    } catch (error) {
        console.error("Error accessing database:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function fetchUserData(discord_id: string) {
    const apiUrl = `https://discord.com/api/v10/users/${discord_id}`;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bot ${process.env.Bot_Token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${
                    response.status
                } Rate limit header reset: ${response.headers.get(
                    "X-RateLimit-Reset-After"
                )}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user information:", error);
        throw new Error("Error fetching user information");
    }
}
