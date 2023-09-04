export async function getDiscordUser(discord_id: number) {
    const res = await fetch("/api/discord/users/" + discord_id);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
