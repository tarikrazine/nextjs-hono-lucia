import { z } from "zod";

export const RegisterSchema = z.object(
  {
    email: z.string().email(),
    password: z.string().min(3, {
      message: "Password must be at least 3 characters long",
    }),
    passwordConfirmation: z.string().min(3, {
      message: "Password confirmation must be at least 3 characters long",
    }),
  },
).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords must match",
  path: ["passwordConfirmation"],
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
