import { loadEnvConfig } from "@next/env";
import { getInquiryEmailConfig } from "../lib/inquiry-email";

loadEnvConfig(process.cwd());
const key = process.env.RESEND_API_KEY?.trim();
console.log(
  JSON.stringify(
    {
      resendKeyConfigured: Boolean(
        key?.startsWith("re_") && !/your|placeholder|example/i.test(key),
      ),
      senderAddressConfigured: Boolean(process.env.INQUIRY_FROM_EMAIL),
      recipientAddressConfigured: Boolean(process.env.INQUIRY_TO_EMAIL),
      readyForProviderTest: Boolean(getInquiryEmailConfig(process.env)),
    },
    null,
    2,
  ),
);
