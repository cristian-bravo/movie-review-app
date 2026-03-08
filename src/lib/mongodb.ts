import { MongoClient } from "mongodb";

declare global {
  var __movieReviewMongoClientPromise: Promise<MongoClient> | undefined;
}

export class MissingMongoConfigError extends Error {
  constructor() {
    super(
      "Missing MongoDB connection string. Define MONGODB_URI, DATABASE_URL, MONGO_URI, or MONGODB_URL.",
    );
    this.name = "MissingMongoConfigError";
  }
}

let mongoClientPromise: Promise<MongoClient> | null = null;

function getMongoUri() {
  return (
    process.env.MONGODB_URI ??
    process.env.DATABASE_URL ??
    process.env.MONGO_URI ??
    process.env.MONGODB_URL
  );
}

function getMongoDatabaseName() {
  return process.env.MONGODB_DB ?? process.env.MONGO_DB_NAME;
}

function createMongoClientPromise() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new MissingMongoConfigError();
  }

  return new MongoClient(mongoUri).connect();
}

export async function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    if (!globalThis.__movieReviewMongoClientPromise) {
      globalThis.__movieReviewMongoClientPromise = createMongoClientPromise();
    }

    return globalThis.__movieReviewMongoClientPromise;
  }

  if (!mongoClientPromise) {
    mongoClientPromise = createMongoClientPromise();
  }

  return mongoClientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  const databaseName = getMongoDatabaseName();

  return databaseName ? client.db(databaseName) : client.db();
}
