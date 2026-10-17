import { Resend } from "resend";
import { getInquiryEmailConfig } from "@/lib/inquiry-email";
import { handleInquiry } from "@/lib/inquiry-handler";

export async function POST(request: Request) {
  const configuration = getInquiryEmailConfig(process.env);
  return handleInquiry(request, {
    configuration,
    allowedOrigin: process.env.INQUIRY_ALLOWED_ORIGIN,
    send: async (email, idempotencyKey) => {
      if (!configuration) throw new Error("Email unavailable");
      const resend = new Resend(configuration.apiKey);
      const { data, error } = await resend.emails.send(email, {
        idempotencyKey,
      });
      if (error || !data?.id)
        throw new Error("Email provider rejected submission");
      return { id: data.id };
    },
  });
}
