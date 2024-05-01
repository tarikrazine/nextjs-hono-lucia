import { User } from "lucia";
import { eq } from "drizzle-orm";
import { isWithinExpirationDate } from "oslo";

import db from "@/services/db";
import { emailVerificationCode } from "@/services/db/schema/emailVerificationCode";

export async function verifyVerificationCode(
  user: User,
  code: string,
): Promise<boolean> {
  return await db.transaction(async (tx) => {
    const [databaseCode] = await tx
      .select().from(emailVerificationCode)
      .where(eq(emailVerificationCode.userId, user.id));

    if (!databaseCode || databaseCode.code !== code) {
      console.log("🚨 Invalid verification code");
      return false;
    }

    await tx.delete(emailVerificationCode).where(
      eq(emailVerificationCode.id, databaseCode.id),
    );

    if (!isWithinExpirationDate(databaseCode.expiresAt)) {
      console.log("🚨 Expired code");
      return false;
    }

    if (databaseCode.email !== user.email) {
      return false;
    }

    return true;
  });
}
