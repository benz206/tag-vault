import type { NextApiRequest, NextApiResponse } from "next";
import type { TagBatchQuery, TagSummary, Error } from "@/types";
import { getDb } from "@/utils/mongodb/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function parseIds(value: string | string[] | undefined): number[] | null {
    if (!value) return null;
    const raw = Array.isArray(value) ? value.join(",") : value;
    const ids = raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((n) => Number.isFinite(n) && Number.isInteger(n));

    if (ids.length === 0) return null;
    const unique = Array.from(new Set(ids));
    return unique;
}

function toIso(value: any): string {
    if (!value) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return String(value);
}

function toSummary(doc: any): TagSummary {
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TagBatchQuery | Error>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const ids = parseIds(req.query.ids);
    if (!ids) {
        return res.status(400).json({ error: "Invalid ids" });
    }
    if (ids.length > 50) {
        return res.status(400).json({ error: "Too many ids" });
    }

    const session = await getServerSession(req, res, authOptions);
    const viewerId = session?.user?.id ? String(session.user.id) : null;

    const db = await getDb();
    const collection = db.collection("Tags");

    const docs = await collection
        .find(
            {
                id: { $in: ids },
                ...(viewerId
                    ? {
                          $or: [
                              { owner_id: viewerId },
                              {
                                  deleted: false,
                                  nsfw: false,
                                  safe: { $ne: "not_safe" },
                              },
                          ],
                      }
                    : {
                          deleted: false,
                          nsfw: false,
                          safe: { $ne: "not_safe" },
                      }),
            },
            {
                projection: {
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
                },
            }
        )
        .toArray();

    const byId = new Map<number, TagSummary>();
    for (const doc of docs) byId.set(Number(doc.id), toSummary(doc));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean) as TagSummary[];

    return res.status(200).json({ tags: ordered });
}


