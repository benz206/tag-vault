import type { SearchQuery } from "@/types";

export async function searchTags(query: string): Promise<SearchQuery> {
    if (query.length < 1) {
        return { search: [] } as SearchQuery;
    }

    const { apiFetch } = await import("@/utils/api");
    return apiFetch<SearchQuery>("/api/tags/search/" + encodeURIComponent(query));
}
