import { Hono } from "hono";

import routes from "./routes";

const app = new Hono().basePath("/api");

app.route("/", routes);

export type AppType = typeof app;

export default app;
