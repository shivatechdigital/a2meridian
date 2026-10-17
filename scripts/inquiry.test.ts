import assert from "node:assert/strict";
import { test } from "node:test";
import { inquirySchema } from "../lib/contact-schema";
import { buildInquiryEmail, getInquiryEmailConfig } from "../lib/inquiry-email";
import { createInquiryLimiter, handleInquiry } from "../lib/inquiry-handler";

const configuration = {
  apiKey: "re_test_config_only",
  from: "inquiries@example.com",
  to: "office@example.com",
};
const valid = {
  name: "Test Buyer",
  email: "buyer@example.com",
  phone: "+91 98765 43210",
  company: "Example Ltd",
  country: "India" as const,
  productInterest: "Basmati Rice 1121",
  tradeType: "both" as const,
  message: "Please share indicative details and product availability.",
  website: "",
};
const request = (body: unknown = valid, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      ...headers,
    },
    body: JSON.stringify(body),
  });
const send = async () => ({ id: "accepted-test-only" });

test("shared validation trims fields and accepts formatted international phone numbers", () => {
  assert.equal(
    inquirySchema.parse({ ...valid, name: "  Test Buyer  " }).name,
    "Test Buyer",
  );
  for (const phone of ["+91 98765 43210", "+1 (555) 123-4567", "020 1234 5678"])
    assert.ok(inquirySchema.safeParse({ ...valid, phone }).success);
  for (const phone of ["abcdefghi", "123456", "+1234567890123456"])
    assert.ok(!inquirySchema.safeParse({ ...valid, phone }).success);
  assert.ok(
    !inquirySchema.safeParse({ ...valid, name: "Name\r\nInjected" }).success,
  );
  assert.ok(
    !inquirySchema.safeParse({ ...valid, tradeType: "unknown" }).success,
  );
});
test("email HTML escapes all user content and includes a plain-text alternative", () => {
  const data = inquirySchema.parse({
    ...valid,
    name: "<Buyer>",
    company: 'A & "B"',
    message: '<script>alert("test")</script>\nSecond line',
  });
  const email = buildInquiryEmail(data, configuration);
  assert.ok(!email.html.includes("<script>"));
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(email.html.includes("A &amp; &quot;B&quot;"));
  assert.ok(email.text.includes("Second line"));
  assert.equal(email.replyTo, valid.email);
  assert.deepEqual(email.to, [configuration.to]);
});
test("missing or placeholder configuration cannot claim success", async () => {
  assert.equal(
    getInquiryEmailConfig({ RESEND_API_KEY: "re_your_api_key" }),
    null,
  );
  assert.equal(
    getInquiryEmailConfig({
      RESEND_API_KEY: "re_real_test",
      INQUIRY_FROM_EMAIL: "invalid",
      INQUIRY_TO_EMAIL: "office@example.com",
    }),
    null,
  );
  let sent = false;
  const response = await handleInquiry(request(), {
    configuration: null,
    send: async () => {
      sent = true;
      return send();
    },
  });
  assert.equal(response.status, 503);
  assert.equal(sent, false);
});
test("bad fields, malformed JSON, oversized bodies, origins, and bot traps are rejected", async () => {
  const dependencies = { configuration, send, limit: () => 0 };
  assert.equal(
    (await handleInquiry(request({ ...valid, email: "wrong" }), dependencies))
      .status,
    400,
  );
  assert.equal(
    (
      await handleInquiry(
        request(valid, { Origin: "https://other.example" }),
        dependencies,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleInquiry(
        request(valid, { "Content-Type": "text/plain" }),
        dependencies,
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await handleInquiry(
        request({ ...valid, website: "https://spam.example" }),
        dependencies,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleInquiry(
        request({ ...valid, message: "x".repeat(17000) }),
        dependencies,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleInquiry(
        new Request("http://localhost:3000/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{",
        }),
        dependencies,
      )
    ).status,
    400,
  );
});
test("limiter expires and handler emits Retry-After", async () => {
  const limit = createInquiryLimiter(2, 1000);
  assert.equal(limit("buyer", 0), 0);
  assert.equal(limit("buyer", 1), 0);
  assert.equal(limit("buyer", 2), 1);
  assert.equal(limit("buyer", 1001), 0);
  const response = await handleInquiry(request(), {
    configuration,
    send,
    limit: () => 60,
  });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
});
test("provider errors return failure; acceptance includes stable idempotency", async () => {
  const failed = await handleInquiry(request(), {
    configuration,
    limit: () => 0,
    send: async () => {
      throw new Error("provider-private-details");
    },
  });
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.text()).includes("provider-private-details"));
  const keys: string[] = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await handleInquiry(
      request(valid, { "Idempotency-Key": "test_submission_12345" }),
      {
        configuration,
        limit: () => 0,
        send: async (_email, key) => {
          keys.push(key);
          return send();
        },
      },
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
  }
  assert.equal(keys[0], keys[1]);
});
