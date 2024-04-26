import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import { generateId, Scrypt } from "lucia";

import { RegisterSchema } from "@/schemas/registerSchema";
import { ContextVariables } from "@/services/types";
import { users } from "@/services/db/schema/users";
import { lucia } from "@/services/auth";

const app = new OpenAPIHono<{ Variables: ContextVariables }>();

const registerRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Register a new user",
  tags: ["Register"],
  body: RegisterSchema,
  request: {
    body: {
      description: "Request body",
      content: {
        "application/json": {
          schema: RegisterSchema.openapi("RegisterUser", {
            example: {
              email: "email@example.com",
              password: "password123",
              passwordConfirmation: "password123",
            },
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.string(),
          }),
        },
      },
      description: "Retrieve the user",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Returns an error",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Internal server error",
    },
  },
});

app.openapi(registerRoute, async (c) => {
  const { email, password } = c.req.valid("json");

  const db = c.get("db");

  const hashedPassword = await new Scrypt().hash(password);
  const userId = generateId(15);

  try {
    const [newUser] = await db.insert(users).values({
      email,
      hashedPassword,
      id: userId,
    }).returning({ id: users.id, email: users.email });

    const session = await lucia.createSession(newUser.id, { id: userId });

    const sessionCookie = lucia.createSessionCookie(session.id);

    setCookie(c, lucia.sessionCookieName, sessionCookie.serialize(), {
      ...sessionCookie.attributes,
      sameSite: "Strict",
    });

    return c.json({ success: "User registered successfully" }, 201);
  } catch (error: any) {
    console.log("[ERROR_REGISTER_ROUTE]: ", error);

    return c.json({ error: error?.message }, 400);
  }
});

export default app;
