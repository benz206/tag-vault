import type { BrowseQuery } from "@/types";

type BrowseParams = {
    q?: string;
    page?: number;
    pageSize?: number;
    shared?: boolean;
    nsfw?: boolean;
    safe?: "safe" | "unrated" | "not_safe";
    owner_id?: string;
};

export async function browseTags(params: BrowseParams = {}): Promise<BrowseQuery> {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.shared !== undefined) query.set("shared", String(params.shared));
    if (params.nsfw !== undefined) query.set("nsfw", String(params.nsfw));
    if (params.safe !== undefined) query.set("safe", params.safe);
    if (params.owner_id) query.set("owner_id", params.owner_id);

    const { apiFetch } = await import("@/utils/api");
    return apiFetch<BrowseQuery>("/api/tags/browse" + (query.toString() ? `?${query.toString()}` : ""));
}


