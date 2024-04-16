import { Hono } from "hono";

import routes from "./routes";

export type Bindings = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN?: string;
};

const api = new Hono<{ Bindings: Bindings }>().basePath("/api");

api.route("/", routes);

export default api;
