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
  hidden: boolean;
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
  hidden: boolean;
};

export type Statistics = {
  all_tag_count: number;
  public_tag_count: number;
  latest_last_fetched: string | null;
};

export type Owner = {
  id: string;
  name: string;
  avatarUrl: string;
  fallbackAvatarUrl: string;
};

export type TagListItem = TagSummary & { owner: Owner };

export type Error = {
  error: string;
};

export type SearchQuery = {
  search: TagSummary[];
};

export type OwnerTagsQuery = {
  tags: TagSummary[];
};

export type OwnerStats = {
  tags: {
    public: number;
    private: number;
    nsfw: number;
    total: number;
  };
  uses: number;
};

export type TagBatchQuery = {
  tags: TagSummary[];
};

export type DiscoverQuery = {
  popular: TagSummary[];
  newest: TagSummary[];
};
