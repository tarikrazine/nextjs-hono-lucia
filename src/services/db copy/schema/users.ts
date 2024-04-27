import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sessions } from "./sessions";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
  hashedPassword: text("hashed_password").notNull(),

  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
}, (table) => {
  return {
    emailIdx: uniqueIndex("email_idx").on(table.email),
  };
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));
