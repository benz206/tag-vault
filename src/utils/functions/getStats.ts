import { apiFetch } from "@/utils/api";

export async function getStats() {
    return apiFetch("/api/statistics/");
}
