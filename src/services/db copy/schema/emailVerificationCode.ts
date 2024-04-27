import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

import { users } from "./users";

export const emailVerificationCode = sqliteTable("email_verification_code", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  code: text("code").notNull(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const emailVerificationCodeRelations = relations(
  emailVerificationCode,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCode.userId],
      references: [users.id],
    }),
  }),
);
