import { apiFetch } from "@/utils/api";
import type { DashStats } from "@/types";

export async function getDashStats(): Promise<DashStats> {
    return apiFetch<DashStats>("/api/dashstatistics/");
}
