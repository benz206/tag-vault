export type TagData = {
    id: number;
    created_at: string;
    guild_id: string;
    tag_name: string;
    nsfw: boolean;
    owner_id: string;
    sharer: string;
    uses: number;
    content: string;
    embed: string;
    last_fetched: string;
    deleted: boolean;
    description: string | null;
    restricted: boolean;
    shared: boolean;
    safe: string;
};

export type TagSummary = {
    id: number;
    created_at: string;
    tag_name: string;
    nsfw: boolean;
    owner_id: string;
    uses: number;
    description: string | null;
    restricted: boolean;
    shared: boolean;
    deleted: boolean;
    safe: string;
};

export type Statistics = {
    all_tag_count: number;
    public_tag_count: number;
    latest_last_fetched: string | null;
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
    search: TagSummary[];
};

export type ShortTagData = {
    id: number;
};

export type ShortDiscordUser = {
    id: number;
    username: string;
    image: string;
};

export type StaticFeaturedTag = {
    discord: DiscordUser;
    tag: TagData;
};

export type OwnerTagsQuery = {
    tags: number[];
};

export type DashStats = {
    tags: {
        public: number;
        private: number;
        nsfw: number;
        total: number;
    };
    uses: number;
    favorites: number;
};

export type BrowseQuery = {
    results: TagSummary[];
    total: number;
    page: number;
    pageSize: number;
};

export type TagBatchQuery = {
    tags: TagSummary[];
};
