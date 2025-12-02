// Server-only MongoDB connection - DO NOT IMPORT IN CLIENT COMPONENTS
import { MongoClient, Db } from "mongodb";

// Re-export types for server-side use
export type { NodeData } from "./types";
export { getWaterLevelStatus, getNodeStatus } from "./types";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongoClientCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

// Cache the MongoDB client to avoid multiple connections
declare global {
  // eslint-disable-next-line no-var
  var mongoClientCache: MongoClientCache | undefined;
}

const cached: MongoClientCache = global.mongoClientCache ?? {
  client: null,
  db: null,
  promise: null,
};

if (!global.mongoClientCache) {
  global.mongoClientCache = cached;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined. Please create a .env.local file with your MongoDB credentials.");
  }

  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      const db = client.db(process.env.MONGODB_DB || "IoT_WaterMonitoring");
      return { client, db };
    });
  }

  try {
    const { client, db } = await cached.promise;
    cached.client = client;
    cached.db = db;
    return { client, db };
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
