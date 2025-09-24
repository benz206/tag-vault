type OwnerTagsResult = {
    tags: number[];
};

export async function getOwnerTagData(
    owner_id: string
): Promise<OwnerTagsResult> {
    const { apiFetch } = await import("@/utils/api");
    return apiFetch("/api/tags/owner/" + owner_id);
}
