import { NextApiRequest, NextApiResponse } from "next";
import { DiscordUser } from "@/types";

type Error = {
    error: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DiscordUser | Error>
) {
    const { discord_id } = req.query;

    if (!discord_id || isNaN(Number(discord_id)) || Array.isArray(discord_id)) {
        return res.status(400).json({ error: "Invalid discord_id" });
    }

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

        const userData = await response.json();
        return res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user information:", error);
        return res
            .status(400)
            .json({ error: "Error fetching user information" });
    }
}
