import { MongoClient, Db } from "mongodb";

const MONGO_DB_URL = process.env.MONGO_DB_URL;
if (!MONGO_DB_URL) {
    throw new Error("MONGO_DB_URL is not set");
}

const DEFAULT_DB_NAME = (() => {
    try {
        const url = new URL(MONGO_DB_URL);
        const name = url.pathname.replace(/^\//, "");
        return name || undefined;
    } catch {
        return undefined;
    }
})();

const DB_NAME = process.env.MONGO_DB_NAME || DEFAULT_DB_NAME || "TagDB";

declare global {
    // eslint-disable-next-line no-var
    var __tagVaultMongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(MONGO_DB_URL);

const mongoClientPromise =
    global.__tagVaultMongoClientPromise ||
    client.connect().catch((error) => {
        global.__tagVaultMongoClientPromise = undefined;
        throw error;
    });

if (process.env.NODE_ENV !== "production") {
    global.__tagVaultMongoClientPromise = mongoClientPromise;
}

export async function connectToMongo(): Promise<MongoClient> {
    return mongoClientPromise;
}

export async function getDb(): Promise<Db> {
    const connected = await mongoClientPromise;
    return connected.db(DB_NAME);
}

export default client;
