export async function searchTags(query: string) {
    if (query.length < 1) {
        return [];
    }

    const res = await fetch("/api/tags/search/" + query);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
