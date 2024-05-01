import { OpenAPIHono } from "@hono/zod-openapi";

import { registerRoute } from "./register";
import { loginRoute } from "./login";
import { verifyRoute } from "./verify";

import { ContextVariables } from "@/services/types";

export const authApp = new OpenAPIHono<{ Variables: ContextVariables }>({})
  .route("/register", registerRoute)
  .route("/login", loginRoute)
  .route("/verify", verifyRoute);
