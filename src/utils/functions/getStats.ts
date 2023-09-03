export async function getStats() {
    const res = await fetch("/api/statistics/");

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
