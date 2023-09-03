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
};
