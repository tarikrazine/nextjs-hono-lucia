import { Hono } from "hono";

import { Bindings } from "../index";
import { serverEnvs } from "@/env/server";

const helloRoute = new Hono<{ Bindings: Bindings }>();

helloRoute.get(
  "/",
  (c) => {
    console.log("🟢 database from env: ", serverEnvs.DATABASE_URL);

    return c.json<{ var: string }>({ var: serverEnvs.DATABASE_URL });
  },
);

export default helloRoute;
