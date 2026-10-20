import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set');
}

const DEFAULT_DB_NAME = (() => {
  try {
    const url = new URL(MONGODB_URI);
    const name = url.pathname.replace(/^\//, '');
    return name || 'TagDB';
  } catch {
    return 'TagDB';
  }
})();

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoConnectPromise: Promise<MongoClient> | undefined;
}

const client =
  global._mongoClient ??
  new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true
    },
    maxPoolSize: 10
  });

if (process.env.NODE_ENV !== 'production') {
  global._mongoClient = client;
}

export async function connectToMongo(): Promise<MongoClient> {
  if (!global._mongoConnectPromise) {
    global._mongoConnectPromise = client.connect().catch((error) => {
      global._mongoConnectPromise = undefined;
      console.error('Error connecting to MongoDB: ', error);
      throw error;
    });
  }
  return global._mongoConnectPromise;
}

export async function getDb(): Promise<Db> {
  await connectToMongo();
  return client.db(DEFAULT_DB_NAME);
}
