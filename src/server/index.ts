import { Hono } from "hono";

import routes from "./routes";

export type Bindings = {
  DATABASE_URL: string;
};

const api = new Hono<{ Bindings: Bindings }>().basePath("/api");

api.route("/", routes);

export default api;
