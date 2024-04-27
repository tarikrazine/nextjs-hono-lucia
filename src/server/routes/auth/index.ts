import { OpenAPIHono } from "@hono/zod-openapi";

import registerRoute from "./register";
import loginRoute from "./login";
import { ContextVariables } from "@/services/types";

const authApp = new OpenAPIHono<{ Variables: ContextVariables }>();

authApp.route("/register", registerRoute);
authApp.route("/login", loginRoute);

export default authApp;
