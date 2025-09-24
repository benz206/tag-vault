import { apiFetch } from "@/utils/api";
import type { TagData } from "@/types";

export async function getTagData(id: number): Promise<TagData> {
    return apiFetch<TagData>("/api/tags/" + id);
}
