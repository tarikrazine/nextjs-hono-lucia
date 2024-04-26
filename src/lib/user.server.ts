import { cache } from "react";

import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { headers } from "next/headers";

import { lucia } from "@/services/auth";

export const getUser = cache(async () => {
  const sessionId = getCookie(
    {
      req: {
        raw: {
          headers: headers(),
        },
      },
    } as Context<any, any, {}>,
    lucia.sessionCookieName,
  );

  if (!sessionId) return null;

  const { user } = await lucia.validateSession(sessionId);

  console.log(user);

  return user;
});
