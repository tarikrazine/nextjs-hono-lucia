import { Resend } from "resend";

import { serverEnvs } from "@/env/server";
import EmailTemplate from "@/components/emailTemplate";

const resend = new Resend(serverEnvs.RESEND_API_KEY);

export async function sendVerificationCode(
  email: string,
  code: string,
) {
  try {
    const data = await resend.emails.send({
      from: "Next-hono-lucia-app <onboarding@resend.dev>",
      to: [email],
      subject: "Verification code",
      react: EmailTemplate({ email, code }),
    });

    return data;
  } catch (error) {
    console.log("[SEND_VERIFICATION_CODE_ERROR]", error);
    return null;
  }
}
