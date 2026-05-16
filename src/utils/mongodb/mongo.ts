import { MongoClient, Db, ServerApiVersion } from "mongodb";

const MONGO_DB_URL = process.env.MONGO_DB_URL;
if (!MONGO_DB_URL) {
    throw new Error("MONGO_DB_URL is not set");
}

const DEFAULT_DB_NAME = (() => {
    try {
        const url = new URL(MONGO_DB_URL);
        const name = url.pathname.replace(/^\//, "");
        return name || "TagDB";
    } catch {
        return "TagDB";
    }
})();

declare global {
    var _mongoClient: MongoClient | undefined;
    var _mongoConnectPromise: Promise<MongoClient> | undefined;
}

const client =
    global._mongoClient ??
    new MongoClient(MONGO_DB_URL, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true,
        },
        maxPoolSize: 10,
    });

if (process.env.NODE_ENV !== "production") {
    global._mongoClient = client;
}

export async function connectToMongo(): Promise<MongoClient> {
    if (!global._mongoConnectPromise) {
        global._mongoConnectPromise = client.connect().catch((error) => {
            global._mongoConnectPromise = undefined;
            console.error("Error connecting to MongoDB: ", error);
            throw error;
        });
    }
    return global._mongoConnectPromise;
}

export async function getDb(): Promise<Db> {
    await connectToMongo();
    return client.db(DEFAULT_DB_NAME);
}

export default client;
