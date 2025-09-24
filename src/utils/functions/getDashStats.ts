import { apiFetch } from "@/utils/api";

export async function getDashStats() {
    return apiFetch("/api/dashstatistics/");
}
