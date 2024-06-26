import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { getCookie } from "hono/cookie";
import { verifyRequestOrigin } from "lucia";

import { authApp } from "./routes/auth";
import { lucia } from "@/services/auth";
import db from "@/services/db";
import { ContextVariables } from "@/services/types";

const app = new OpenAPIHono<{ Variables: ContextVariables }>({}).basePath(
  "/api",
);

app.use(logger());

app.use("*", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }

  const originHeader = c.req.header("Origin");

  const hostHeader = c.req.header("Host");

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return c.body(null, 403);
  }

  return next();
});

app.use("*", async (c, next) => {
  c.set("db", db);

  const sessionId = getCookie(c, lucia.sessionCookieName);

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});

const routes = app.route("/auth", authApp);

export type AppType = typeof routes;

export default app;
