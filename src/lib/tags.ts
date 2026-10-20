import type { Document } from "mongodb";
import type { TagData, TagSummary } from "@/types";

export const TAG_SUMMARY_PROJECTION = {
    _id: 0,
    id: 1,
    created_at: 1,
    tag_name: 1,
    nsfw: 1,
    owner_id: 1,
    uses: 1,
    description: 1,
    restricted: 1,
    shared: 1,
    deleted: 1,
    safe: 1,
} as const;

function toIso(value: unknown): string {
    if (value instanceof Date) return value.toISOString();
    return value ? String(value) : "";
}

export function toTagSummary(doc: Document): TagSummary {
    return {
        id: Number(doc.id),
        created_at: toIso(doc.created_at),
        tag_name: String(doc.tag_name ?? ""),
        nsfw: Boolean(doc.nsfw),
        owner_id: String(doc.owner_id ?? ""),
        uses: Number(doc.uses ?? 0),
        description: doc.description ?? null,
        restricted: Boolean(doc.restricted),
        shared: Boolean(doc.shared),
        deleted: Boolean(doc.deleted),
        safe: String(doc.safe ?? ""),
    };
}

export function toTagData(doc: Document): TagData {
    return {
        ...toTagSummary(doc),
        guild_id: String(doc.guild_id ?? ""),
        sharer: String(doc.sharer ?? ""),
        content: String(doc.content ?? ""),
        embed: String(doc.embed ?? ""),
        last_fetched: toIso(doc.last_fetched),
    };
}
