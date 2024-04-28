import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { createDate, TimeSpan } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

import db from "@/services/db";
import { emailVerificationCode } from "@/services/db/schema/emailVerificationCode";

export async function generateEmailVerificationCode(
  userId: string,
  email: string,
): Promise<string> {
  await db.delete(emailVerificationCode).where(
    eq(emailVerificationCode.userId, userId),
  );

  const code = generateRandomString(6, alphabet("0-9", "A-Z"));

  const emailVerificationCodeId = generateId(15);

  await db.insert(emailVerificationCode).values({
    id: emailVerificationCodeId,
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, "m")), // 15 minutes
  });

  return code;
}
