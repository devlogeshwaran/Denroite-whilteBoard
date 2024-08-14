import { type Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config;

const DATABASE_URL = process.env.DB_URL;

if (!DATABASE_URL) {
    console.log("🔴 Cannot find database url");
}

export default {
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL! || "",
    },
} satisfies Config;
