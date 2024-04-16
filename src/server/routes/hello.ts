import { Hono } from "hono";
import { env } from "hono/adapter";

import { Bindings } from "../index";

const helloRoute = new Hono<{ Bindings: Bindings }>();

helloRoute.get(
  "/",
  (c) => {
    const { DATABASE_URL } = env(c);

    return c.json<{ var: string }>({ var: DATABASE_URL });
  },
);

export default helloRoute;
