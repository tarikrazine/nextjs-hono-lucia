import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { serverEnvs } from "@/env/server";

import * as users from "./schema/users";
import * as sessions from "./schema/sessions";

const client = createClient({
  url: serverEnvs.DATABASE_URL,
  authToken: serverEnvs.DATABASE_AUTH_TOKEN
    ? serverEnvs.DATABASE_AUTH_TOKEN
    : undefined,
});

const db = drizzle(client, { schema: { ...users, ...sessions } });

export default db;
