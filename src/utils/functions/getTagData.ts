import { apiFetch } from "@/utils/api";

export async function getTagData(id: number) {
    return apiFetch("/api/tags/" + id);
}
