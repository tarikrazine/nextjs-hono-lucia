import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { RegisterSchema } from "@/schemas/registerSchema";
import { ContextVariables } from "@/services/types";

const app = new OpenAPIHono<{ Variables: ContextVariables }>({});

const registerRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Register a new user",
  tags: ["Auth"],
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

  const user = c.get("user");

  console.log(user);

  return c.json({ success: "User registered successfully" });
});

export default app;
