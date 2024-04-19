import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { RegisterSchema } from "@/schemas/registerSchema";

const authRegister = new Hono();

authRegister.post(
  "/",
  zValidator("form", RegisterSchema.omit({ passwordConfirmation: true })),
  (c) => {
    const { email, password } = c.req.valid("form");

    return c.json({ email, password }, 201);
  },
);

export default authRegister;
