import { MongoClient } from "mongodb";

const client = new MongoClient(
    `mongodb+srv://${process.env.Mongo_User}:${process.env.Mongo_Pass}@carltagscluster.nyxt2.mongodb.net/TagDB?retryWrites=true&w=majority`
);

export async function connectToMongo() {
    try {
        await client.connect();
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
}

export default client;
