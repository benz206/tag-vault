import { apiFetch } from "@/utils/api";
import { DiscordUser } from "@/types";

export async function getDiscordUser(discord_id: string) {
    if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem("d-" + discord_id);
        if (cached) {
            try {
                return JSON.parse(cached) as DiscordUser;
            } catch {}
        }
    }

    const user = await apiFetch<DiscordUser>("/api/discord/users/" + discord_id);

    if (typeof window !== "undefined") {
        try {
            sessionStorage.setItem("d-" + discord_id, JSON.stringify(user));
        } catch {}
    }

    return user;
}
