import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
  try {
    const client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    const db = drizzle(client);

    console.log("🟠 Running migrations");

    await migrate(db, { migrationsFolder: "./src/services/db/migrations" });

    console.log("🟢 Migrated successfully");

    process.exit(0);
  } catch (error) {
    console.error("🔴 Migration failed");
    console.error(error);
    process.exit(1);
  }
}

main();
