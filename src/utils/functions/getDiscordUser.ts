export async function getDiscordUser(discord_id: number) {
    const user = sessionStorage.getItem("d-" + discord_id);

    if (user) {
        return JSON.parse(user);
    }
    console.log("user: " + user);
    const res = await fetch("/api/discord/users/" + discord_id);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const json = res.json();

    return json;
}
