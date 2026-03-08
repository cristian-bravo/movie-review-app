import { randomBytes, scryptSync } from "node:crypto";

import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URI ??
  process.env.DATABASE_URL ??
  process.env.MONGO_URI ??
  process.env.MONGODB_URL;
const mongoDbName = process.env.MONGODB_DB ?? process.env.MONGO_DB_NAME;

if (!mongoUri) {
  throw new Error(
    "Missing MongoDB connection string. Define MONGODB_URI, DATABASE_URL, MONGO_URI, or MONGODB_URL in .env.local before running db:migrate.",
  );
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

const client = new MongoClient(mongoUri);

try {
  await client.connect();

  const database = mongoDbName ? client.db(mongoDbName) : client.db();
  const users = database.collection("users");
  const sessions = database.collection("auth_sessions");

  await Promise.all([
    users.createIndex(
      { emailNormalized: 1 },
      { unique: true, name: "users_email_normalized_unique" },
    ),
    sessions.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "auth_sessions_expires_ttl" },
    ),
    sessions.createIndex({ userId: 1 }, { name: "auth_sessions_user_id" }),
  ]);

  console.log(`Auth indexes ensured in database "${database.databaseName}".`);

  if (process.env.AUTH_SEED_DEMO === "true") {
    const email = "elena@example.com";
    const emailNormalized = normalizeEmail(email);
    const existingUser = await users.findOne({ emailNormalized });

    if (!existingUser) {
      const now = new Date();

      await users.insertOne({
        name: "Elena Rivera",
        email: emailNormalized,
        emailNormalized,
        passwordHash: hashPassword("demo1234"),
        avatar: "/avatars/default-avatar.svg",
        bio: "Seeded demo profile for local development.",
        favoriteGenres: ["Drama", "Sci-Fi"],
        createdAt: now,
        updatedAt: now,
      });

      console.log("Demo user created: elena@example.com / demo1234");
    } else {
      console.log("Demo user already exists. Seed skipped.");
    }
  }
} finally {
  await client.close();
}
