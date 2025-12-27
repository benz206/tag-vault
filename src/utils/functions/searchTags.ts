import type { SearchQuery } from "@/types";
import { apiFetch } from "@/utils/api";

export async function searchTags(query: string): Promise<SearchQuery> {
    if (query.length < 1) {
        return { search: [] } as SearchQuery;
    }

    return apiFetch<SearchQuery>("/api/tags/search/" + encodeURIComponent(query));
}
