# Inquiry Email Setup

The form and API are implemented, but the current local environment is not ready
for live email delivery. The readiness check found no usable Resend key, sender,
or recipient. Missing configuration returns HTTP 503, never a simulated success.

## Configure Locally

Create an account at https://resend.com and enter these variables in the existing
ignored `.env.local` file. Preserve the existing Sanity and company values.

```dotenv
RESEND_API_KEY=your_actual_resend_key
INQUIRY_FROM_EMAIL=inquiries@your-verified-domain.com
INQUIRY_TO_EMAIL=your-real-recipient@example.com
```

The sender and recipient variables must be bare email addresses. Use a sender
domain verified in the Resend account. These are server-only variables: never
prefix the key with NEXT_PUBLIC, commit it, or paste it into chat.

For a Resend onboarding test, the sender can be `onboarding@resend.dev`, but the
recipient must be an address permitted by that Resend account (typically the
account owner's address). The onboarding sender cannot send freely to arbitrary
recipients. Production requires a verified sending domain and current account
permissions. This application sends only to INQUIRY_TO_EMAIL, not to arbitrary
form-supplied recipients. The visitor's validated address becomes Reply-To.

Restart `npm run dev` after changing environment values. If this Windows machine
reports a certificate error, use the Windows trust store without disabling TLS:

```powershell
$env:NODE_OPTIONS = ($env:NODE_OPTIONS + ' --use-system-ca').Trim()
npm run dev
```

The optional `INQUIRY_ALLOWED_ORIGIN` can specify the exact trusted public origin
when a deployment proxy makes the request URL origin differ from the browser
origin. Do not set wildcard origins. Same-origin requests need no setting.

## Verify Delivery

1. Run the credential-safe readiness task or command below.
2. Submit one genuine test inquiry using contact details you control.
3. Check the Resend dashboard for acceptance, delivery, or bounce events.
4. Confirm receipt in the configured recipient inbox, including spam folders.

```bash
npm exec --yes --package=tsx -- tsx scripts/check-inquiry-config.ts
npm exec --yes --package=tsx -- tsx --test scripts/inquiry.test.ts
npm run lint
npm run build
```

A success response means Resend accepted the send request; it does not guarantee
inbox delivery. Browser mock tests and provider stubs do not prove real delivery.
No real email has been sent or inbox delivery verified during implementation.

## Runtime and Safety

- Both full-page and product-modal forms use React Hook Form and the same Zod v4
  schema enforced by the server. Product/country query prefills remain editable.
- All fields have labels and linked validation messages. Failed submissions keep
  entered details; success remains until Send Another Inquiry is selected.
- JSON request bodies are limited to 16 KiB while streaming. Unknown fields,
  invalid trade/country options, control characters, and malformed JSON are rejected.
- User content is HTML-escaped and also included in a plain-text email. There
  are no auto-replies, attachments, or client-controlled recipient addresses.
- Cross-site browser requests are rejected. Origin checks and the hidden trap
  field are basic friction, not bot authentication or complete spam prevention.
- In-memory limits allow five attempts per normalized email address and fifty
  overall per ten minutes per server process. Entries are bounded and expire.
  This is not a distributed limiter and resets on restart. An attacker can rotate
  addresses; before production use a shared durable limiter and a bot challenge
  or edge/WAF controls. Do not trust arbitrary X-Forwarded-For headers as identity.
- The browser reuses a submission key for unchanged retries; a payload digest
  scopes the provider idempotency key. Resend retention/rules still apply.
- The browser stops waiting after 30 seconds. A timed-out or interrupted request
  may still be accepted by the provider; unchanged retries reuse the key.
- Submitted personal information and provider errors are not logged by this
  application. Data is transmitted to Resend and the recipient's email service;
  configure their retention policies and your privacy notice before launch.
- Google Maps loads only after the visitor chooses Load Google Map. The iframe
  uses the supplied address search, not a verified pin; replace it with an
  approved embed once the precise office location is confirmed. Third-party
  access and availability depend on the visitor's network and Google policies.
- Placeholder phone/WhatsApp values remain non-dialable. Email is used until
  verified numbers are set in `lib/constants.ts`.

## Test Coverage

Automated handler tests use stubbed providers and cover validation, escaping,
configuration failure, malformed/oversized requests, origin checks, trap fields,
rate limiting, provider failure, and idempotent acceptance. Live local endpoint
checks cover 400/413/405/503. UI checks cover validation, retained errors,
mocked acceptance/reset, query prefills, modal keyboard focus/Escape, short-screen
layout, and map opt-in. Real Resend setup and inbox verification remain pending.