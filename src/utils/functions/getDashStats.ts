export async function getDashStats() {
    const res = await fetch("/api/dashstatistics/");

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
