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

const client = new MongoClient(MONGO_DB_URL);

let connectPromise: Promise<MongoClient> | null = null;

export async function connectToMongo(): Promise<MongoClient> {
    if (!connectPromise) {
        connectPromise = client.connect().catch((error) => {
            connectPromise = null;
            console.error("Error connecting to MongoDB: ", error);
            throw error;
        });
    }
    return connectPromise;
}

export async function getDb(): Promise<Db> {
    await connectToMongo();
    return client.db(DEFAULT_DB_NAME);
}

export default client;
