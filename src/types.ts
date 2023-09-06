export type TagData = {
    id: number;
    created_at: Date;
    guild_id: string;
    tag_name: string;
    nsfw: boolean;
    owner_id: string;
    sharer: string;
    uses: number;
    content: string;
    embed: string;
    last_fetched: Date;
    deleted: boolean;
    description: string | null;
    restricted: boolean;
    shared: boolean;
    safe: string;
};

export type Statistics = {
    all_tag_count: number;
    public_tag_count: number;
    latest_last_fetched: Date;
};

export type DiscordUser = {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: number;
    global_name: string;
    avatar_decoration_data: null;
    banner_color: string;
};

export type Error = {
    error: string;
};

export type SearchQuery = {
    search: TagData[];
}

export type ShortTagData = {
    id: number;
}