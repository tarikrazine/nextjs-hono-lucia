import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { generateId, Scrypt } from "lucia";

import { RegisterSchema } from "@/schemas/registerSchema";
import { ContextVariables } from "@/services/types";
import { users } from "@/services/db/schema/users";
import { lucia } from "@/services/auth";
import { generateEmailVerificationCode } from "@/lib/generateEmailVerificationCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";

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
      emailVerified: false,
    }).returning({ id: users.id, email: users.email });

    const verificationCode = await generateEmailVerificationCode(
      newUser.id,
      newUser.email,
    );

    console.log(
      "[REGISTER_ROUTE]: Sending verification code to 🚨",
      verificationCode,
    );

    await sendVerificationCode(newUser.email, verificationCode);

    const session = await lucia.createSession(newUser.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.json({ success: "User registered successfully" }, 201);
  } catch (error: any) {
    console.log("[ERROR_REGISTER_ROUTE]: ", error);

    return c.json({ error: error?.message }, 400);
  }
});

export default app;
