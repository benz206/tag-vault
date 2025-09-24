export async function searchTags(query: string) {
    if (query.length < 1) {
        return [];
    }

    const { apiFetch } = await import("@/utils/api");
    return apiFetch("/api/tags/search/" + encodeURIComponent(query));
}
