import { eq } from "drizzle-orm";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getCookie } from "hono/cookie";
import { Scrypt } from "lucia";

import { ContextVariables } from "@/services/types";
import { users } from "@/services/db/schema/users";
import { lucia } from "@/services/auth";
import { VerifySchema } from "@/schemas/verifySchema";
import { verifyVerificationCode } from "@/lib/verifyVerificationCode";
import { generateEmailVerificationCode } from "@/lib/generateEmailVerificationCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";

export const verifyRoute = new OpenAPIHono<{ Variables: ContextVariables }>({})
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      summary: "Verify user",
      tags: ["Verify"],
      body: VerifySchema,
      request: {
        body: {
          description: "Request body",
          content: {
            "application/json": {
              schema: VerifySchema.openapi("VerifyUser", {
                example: {
                  code: "123456",
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
    }),
    async (c) => {
      const { code } = c.req.valid("json");

      const db = c.get("db");

      try {
        const sessionId = getCookie(c, lucia.sessionCookieName);

        if (!sessionId) {
          return c.json({ error: "Invalid session" }, 401);
        }

        const { user } = await lucia.validateSession(sessionId);

        if (!user) {
          return c.json({ error: "No user found" }, 401);
        }

        if (user.emailVerified) {
          return c.json({ error: "User already verified" }, 400);
        }

        const validCode = await verifyVerificationCode(user, code);

        if (!validCode) {
          const verificationCode = await generateEmailVerificationCode(
            user.id,
            user.email,
          );

          console.log(
            "[REGISTER_ROUTE]: Sending verification code to 🚨",
            verificationCode,
          );

          await sendVerificationCode(user.email, verificationCode);

          return c.json({ error: "Invalid verification code" }, 400);
        }

        await lucia.invalidateUserSessions(user.id);

        await db
          .update(users)
          .set({ emailVerified: true })
          .where(eq(users.id, user.id));

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header("Set-Cookie", sessionCookie.serialize(), {
          append: true,
        });

        return c.json({ success: "User verified" }, 201);
      } catch (error: any) {
        console.log("[ERROR_LOGIN_ROUTE]: ", error);

        return c.json({ error: error?.message }, 400);
      }
    },
  );
