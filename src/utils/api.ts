export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    if (!res.ok) {
        let body = "";
        try {
            body = await res.text();
        } catch {}
        throw new Error(`Request failed ${res.status}: ${body || res.statusText}`);
    }

    return res.json() as Promise<T>;
}


