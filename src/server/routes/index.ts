import { Hono } from "hono";

import authRoutes from "./auth/register";

const routes = new Hono();

routes.route("/auth", authRoutes);

export default routes;
