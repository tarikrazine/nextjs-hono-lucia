import { eq } from "drizzle-orm";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { generateId, Scrypt } from "lucia";

import { ContextVariables } from "@/services/types";
import { users } from "@/services/db/schema/users";
import { lucia } from "@/services/auth";
import { generateEmailVerificationCode } from "@/lib/generateEmailVerificationCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";
import { LoginSchema } from "@/schemas/loginSchema";

const app = new OpenAPIHono<{ Variables: ContextVariables }>();

const loginRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Login users",
  tags: ["Login"],
  body: LoginSchema,
  request: {
    body: {
      description: "Request body",
      content: {
        "application/json": {
          schema: LoginSchema.openapi("LoginUser", {
            example: {
              email: "email@example.com",
              password: "password123",
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

app.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("json");

  const db = c.get("db");

  try {
    const [existingUser] = await db.select().from(users).where(
      eq(users.email, email),
    );

    if (!existingUser) {
      return c.json({ error: "User not found" }, 400);
    }

    if (!existingUser.emailVerified) {
      const verificationCode = await generateEmailVerificationCode(
        existingUser.id,
        existingUser.email,
      );

      console.log(
        "[REGISTER_ROUTE]: Sending verification code to 🚨",
        verificationCode,
      );

      // await sendVerificationCode(existingUser.email, verificationCode);

      return c.json(
        { error: "Email not verified, please verify your email" },
        400,
      );
    }

    const validPassword = await new Scrypt().verify(
      existingUser.hashedPassword,
      password,
    );

    if (!validPassword) {
      return c.json({
        error: "Incorrect username or password",
      }, 400);
    }

    const session = await lucia.createSession(existingUser.id, {});

    const sessionCookie = lucia.createSessionCookie(session.id);

    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.json({ success: "User logged in successfully" }, 201);
  } catch (error: any) {
    console.log("[ERROR_LOGIN_ROUTE]: ", error);

    return c.json({ error: error?.message }, 400);
  }
});

export default app;
