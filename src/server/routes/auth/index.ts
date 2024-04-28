import { OpenAPIHono } from "@hono/zod-openapi";

import registerRoute from "./register";
import loginRoute from "./login";
import verifyRoute from "./verify";

import { ContextVariables } from "@/services/types";

const authApp = new OpenAPIHono<{ Variables: ContextVariables }>();

authApp.route("/register", registerRoute);
authApp.route("/login", loginRoute);
authApp.route("/verify", verifyRoute);

export default authApp;
