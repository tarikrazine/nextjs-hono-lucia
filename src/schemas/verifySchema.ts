import { z } from "@hono/zod-openapi";

export const VerifySchema = z
  .object({
    code: z.string().min(6, {
      message: "Verify code must be at least 6 characters long",
    }),
  })
  .openapi("VerifyUser");

export type VerifySchemaType = z.infer<typeof VerifySchema>;
