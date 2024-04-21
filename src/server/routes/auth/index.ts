import { OpenAPIHono } from "@hono/zod-openapi";

import registerRoute from "./register";
import { ContextVariables } from "@/services/types";

const authApp = new OpenAPIHono<{ Variables: ContextVariables }>();

authApp.route("/register", registerRoute);

export default authApp;
