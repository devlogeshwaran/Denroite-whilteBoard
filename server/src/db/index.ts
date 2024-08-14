import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
  console.log("🔴 Cannot find database url");
}

const client = postgres(process.env.DB_URL as string);
const db = drizzle(client);

export default db;
