import type { Config } from "drizzle-kit";

import { serverEnvs } from "@/env/server";

export default {
  driver: "turso",
  schema: "./src/services/db/schema/*",
  out: "./src/services/db/migrations",
  dbCredentials: {
    url: serverEnvs.DATABASE_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
