import { createHash, randomUUID } from "node:crypto";
import { inquirySchema } from "./contact-schema";
import {
  buildInquiryEmail,
  type InquiryEmail,
  type InquiryEmailConfig,
} from "./inquiry-email";

const MAX_BODY_BYTES = 16 * 1024;
export function createInquiryLimiter(limit = 5, windowMs = 10 * 60 * 1000) {
  const entries = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()) => {
    for (const [storedKey, entry] of entries)
      if (entry.expires <= now) entries.delete(storedKey);
    const entry = entries.get(key);
    if (entry && entry.count >= limit)
      return Math.max(1, Math.ceil((entry.expires - now) / 1000));
    if (entry) entry.count += 1;
    else {
      if (entries.size >= 1000) return 60;
      entries.set(key, { count: 1, expires: now + windowMs });
    }
    return 0;
  };
}
const perAddressLimit = createInquiryLimiter();
const globalLimit = createInquiryLimiter(50);

interface Dependencies {
  configuration: InquiryEmailConfig | null;
  send: (
    email: InquiryEmail,
    idempotencyKey: string,
  ) => Promise<{ id: string }>;
  limit?: (key: string) => number;
  allowedOrigin?: string;
}

function json(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RangeError("Body too large");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Body too large");
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(buffer)) as unknown;
}

export async function handleInquiry(
  request: Request,
  dependencies: Dependencies,
) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
  const origin = request.headers.get("origin");
  if (
    (origin &&
      origin !== new URL(request.url).origin &&
      origin !== dependencies.allowedOrigin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return json({ error: "This request is not permitted." }, 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return json({ error: "Please submit JSON data." }, 415);
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    return json(
      {
        error:
          error instanceof RangeError
            ? "The inquiry is too large."
            : "Invalid JSON data.",
      },
      error instanceof RangeError ? 413 : 400,
    );
  }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success)
    return json(
      {
        error: "Please check the inquiry fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  if (parsed.data.website)
    return json({ error: "This inquiry could not be submitted." }, 400);
  if (!dependencies.configuration)
    return json(
      {
        error:
          "Email inquiries are not configured yet. Please email our team directly.",
      },
      503,
    );
  const requestKey = request.headers.get("idempotency-key") || randomUUID();
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(requestKey))
    return json(
      { error: "Invalid submission identifier. Please reload the form." },
      400,
    );
  const addressKey = createHash("sha256")
    .update(parsed.data.email.toLowerCase())
    .digest("hex");
  const wait = dependencies.limit
    ? dependencies.limit(addressKey)
    : Math.max(globalLimit("all"), perAddressLimit(addressKey));
  if (wait)
    return json(
      { error: "Too many inquiries. Please wait before trying again." },
      429,
      { "Retry-After": String(wait) },
    );
  const email = buildInquiryEmail(parsed.data, dependencies.configuration);
  const digest = createHash("sha256")
    .update(JSON.stringify(email))
    .digest("hex")
    .slice(0, 24);
  try {
    const result = await dependencies.send(
      email,
      `inquiry-${requestKey}-${digest}`,
    );
    if (!result.id) throw new Error("No acceptance identifier");
    return json(
      { success: true, message: "Your inquiry has been accepted for sending." },
      200,
    );
  } catch {
    return json(
      {
        error:
          "We could not submit your inquiry. Please try again or email our team directly.",
      },
      502,
    );
  }
}
