export async function getTagData(id: number) {
    const res = await fetch("/api/tags/" + id);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}
