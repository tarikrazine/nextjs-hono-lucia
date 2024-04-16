import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { serverEnvs } from "@/env/server";

export interface Env {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN?: string;
}

const client = createClient({
  url: serverEnvs.DATABASE_URL,
  authToken: serverEnvs.DATABASE_AUTH_TOKEN
    ? serverEnvs.DATABASE_AUTH_TOKEN
    : undefined,
});

const db = drizzle(client);

export default db;
