type OwnerTagsResult = {
    tags: number[];
};

export async function getOwnerTagData(
    owner_id: string
): Promise<OwnerTagsResult> {
    const res = await fetch("/api/tags/owner/" + owner_id);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
