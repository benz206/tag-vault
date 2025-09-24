import { apiFetch } from "@/utils/api";
import type { Statistics } from "@/types";

export async function getStats(): Promise<Statistics> {
    return apiFetch<Statistics>("/api/statistics/");
}
