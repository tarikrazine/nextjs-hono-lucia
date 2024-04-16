import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  driver: "turso",
  schema: "./src/lib/db/schema/*",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
