import { MongoClient, Db } from "mongodb";

const MONGODB_URI =
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.Mongo_User}:${process.env.Mongo_Pass}@carltagscluster.nyxt2.mongodb.net/TagDB?retryWrites=true&w=majority`;
const MONGODB_DB = process.env.MONGODB_DB || "TagDB";

const client = new MongoClient(MONGODB_URI);

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
    return client.db(MONGODB_DB);
}

export default client;
