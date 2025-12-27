import { apiFetch } from "@/utils/api";

type OwnerTagsResult = {
    tags: number[];
};

export async function getOwnerTagData(
    owner_id: string
): Promise<OwnerTagsResult> {
    return apiFetch<OwnerTagsResult>("/api/tags/owner/" + owner_id);
}
